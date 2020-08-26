import DeskControlService from "../control/DeskControlService";
import DeskStatusService, {
  DeskPosition,
  DeskStatus,
} from "../status/DeskStatusService";
import { Observable, Subject } from "rxjs";
import Particle, { Device, EventStream, ParticleEvent } from "particle-api-js";
import DeskServiceInitializer, {
  InitializedDeskServices,
} from "../DeskServiceInitializer";
import CredentialsService from "../../credentials/CredentialsService";
import SettingsService from "../../settings/SettingsService";
import { share, distinctUntilChanged } from "rxjs/operators";
import { parseISO } from "date-fns";

const CREDENTIALS_SERVICE = "Standing/Geekdesk";
const CREDENTIALS_ACCOUNT = "basic";
const CREDENTIALS_TOKEN = "token";
const SETTINGS_TYPE = "GEEKDESK";

interface GeekdeskService extends DeskControlService, DeskStatusService {
  initialize(
    username: string,
    password: string,
    accessToken?: string
  ): Promise<string>;
  initializeWithOneTimePassword(
    mfaToken: string,
    oneTimePassword: string
  ): Promise<string>;
  getObservable(): Observable<DeskStatus>;
  getDevices(): Promise<Device[]>;
  setDevice(deviceId: string): void;
  setHeights(sittingHeight: number, standingHeight: number): void;
  getCurrentPosition(): Promise<DeskPosition>;
  getCurrentHeight(): Promise<number>;
  getSelectedDevice(): string | null;
  getHeights(): { sittingHeight: number; standingHeight: number } | null;
  getCredentials(): GeekdeskCredentials | null;
  isReady(): boolean;
}

type GeekdeskCredentials = {
  username: string;
  password: string;
  token?: string;
};

type GeekdeskSettings = {
  deviceId: string;
  sittingHeight: number;
  standingHeight: number;
};

const loadCredentials = async (
  credentialsService: CredentialsService
): Promise<GeekdeskCredentials | null> => {
  let resolvedCredentials: GeekdeskCredentials | null = null;

  const credentials = await credentialsService.getCredentials(
    CREDENTIALS_SERVICE,
    CREDENTIALS_ACCOUNT
  );

  const token = await credentialsService.getCredentials(
    CREDENTIALS_SERVICE,
    CREDENTIALS_TOKEN
  );

  if (credentials && credentials.password) {
    const credentialsParts = atob(credentials.password).split(":");
    if (credentialsParts.length === 2) {
      resolvedCredentials = {
        username: credentialsParts[0],
        password: credentialsParts[1],
        token: token ? token.password : null,
      };
    } else {
      console.error(
        `Credentials were not in expected format -- ${credentialsParts.length} parts`
      );
    }
  }

  return resolvedCredentials;
};

export default class DefaultGeekdeskService implements GeekdeskService {
  private credentials: GeekdeskCredentials;
  private deviceId: string;
  private heightSettings: Map<DeskPosition, number>;
  private currentObservable: Observable<DeskStatus>;

  constructor(private readonly particle?: Particle) {
    this.particle = new Particle();
    this.heightSettings = new Map<DeskPosition, number>();
  }

  getObservable(): Observable<DeskStatus> {
    if (!this.currentObservable) {
      this.currentObservable = new Observable<DeskStatus>((subscriber) => {
        let eventStream: EventStream;

        this.particle
          .getEventStream({
            deviceId: this.deviceId,
            name: "height",
            auth: this.credentials.token,
          })
          .then((stream) => {
            eventStream = stream;
            eventStream.on("event", (data: unknown) => {
              if (
                typeof data === "object" &&
                Object.prototype.hasOwnProperty.call(data, "data") &&
                Object.prototype.hasOwnProperty.call(data, "published_at") &&
                Object.prototype.hasOwnProperty.call(data, "name")
              ) {
                const particleEvent = data as ParticleEvent;
                subscriber.next({
                  at: parseISO(particleEvent.published_at),
                  position: this.getPositionFromHeight(
                    Number.parseInt(particleEvent.data)
                  ),
                });
              }
            });
          });

        return (): void => {
          if (eventStream) {
            eventStream.end();
          }
        };
      }).pipe(share(), distinctUntilChanged());
    }

    return this.currentObservable;
  }

  isReady(): boolean {
    return (
      this.credentials &&
      this.deviceId &&
      this.heightSettings &&
      this.heightSettings.has(DeskPosition.SITTING) &&
      this.heightSettings.has(DeskPosition.STANDING)
    );
  }

  async initialize(
    username: string,
    password: string,
    token?: string
  ): Promise<string> {
    let responseToken: Promise<string>;
    if (token) {
      this.credentials = {
        username,
        password,
        token,
      };
      responseToken = Promise.resolve(this.credentials.token);
    } else {
      try {
        // Non-expiring token for now
        const accessToken = (
          await this.particle.login({
            username,
            password,
            tokenDuration: 0,
          })
        ).body.access_token;
        this.credentials = {
          username,
          password,
          token: accessToken,
        };

        responseToken = Promise.resolve(accessToken);
      } catch (error) {
        if (
          typeof error === "object" &&
          Object.prototype.hasOwnProperty.call(error, "body") &&
          typeof error.body === "object" &&
          Object.prototype.hasOwnProperty.call(error.body, "mfa_token")
        ) {
          responseToken = Promise.reject({ mfaToken: error.body.mfa_token });
        } else {
          responseToken = Promise.reject(error);
        }
      }
    }

    return responseToken;
  }

  async initializeWithOneTimePassword(
    mfaToken: string,
    oneTimePassword: string
  ): Promise<string> {
    const accessToken = await (
      await this.particle.sendOtp({ mfaToken, otp: oneTimePassword })
    ).body.access_token;
    this.credentials.token = accessToken;
    return accessToken;
  }

  setDevice(deviceId: string): void {
    this.deviceId = deviceId;
  }

  setHeights(sittingHeight: number, standingHeight: number): void {
    this.heightSettings.set(DeskPosition.SITTING, sittingHeight);
    this.heightSettings.set(DeskPosition.STANDING, standingHeight);
  }

  async getDevices(): Promise<Device[]> {
    return (await this.particle.listDevices({ auth: this.getAccessToken() }))
      .body;
  }

  async setDeskPosition(position: DeskPosition): Promise<void> {
    console.log("Setting desk height: ", this.heightSettings.get(position));
    // await this.particle.callFunction({
    //   deviceId: this.deviceId,
    //   auth: this.getAccessToken(),
    //   name: "setHeight",
    //   argument: `${this.heightSettings.get(position)}`,
    // });
  }

  async getCurrentPosition(): Promise<DeskPosition> {
    return this.getPositionFromHeight(await this.getCurrentHeight());
  }

  getPositionFromHeight(height: number): DeskPosition {
    const standingHeight = this.heightSettings.get(DeskPosition.STANDING);

    let currentPosition: DeskPosition;
    if (height >= standingHeight * 0.9) {
      currentPosition = DeskPosition.STANDING;
    } else {
      currentPosition = DeskPosition.SITTING;
    }

    return currentPosition;
  }

  async getCurrentHeight(): Promise<number> {
    return (
      await this.particle.callFunction({
        deviceId: this.deviceId,
        auth: this.getAccessToken(),
        name: "getHeight",
        argument: "",
      })
    ).body.return_value;
  }

  getSelectedDevice(): string | null {
    return this.deviceId;
  }

  getHeights(): { sittingHeight: number; standingHeight: number } | null {
    const sittingHeight = this.heightSettings.get(DeskPosition.SITTING);
    const standingHeight = this.heightSettings.get(DeskPosition.STANDING);

    let heights: { sittingHeight: number; standingHeight: number } = null;
    if (sittingHeight && standingHeight) {
      heights = {
        sittingHeight,
        standingHeight,
      };
    }

    return heights;
  }

  getCredentials(): GeekdeskCredentials | null {
    return this.credentials;
  }

  private getAccessToken(): string | null {
    return (this.credentials || { token: null }).token;
  }
}

class GeekdeskServiceInitializer implements DeskServiceInitializer {
  async initialize(
    credentialsService: CredentialsService,
    settingsService: SettingsService
  ): Promise<InitializedDeskServices> {
    const geekdeskService = await this.initializeGeekdeskService(
      credentialsService,
      settingsService
    );

    if (!geekdeskService.isReady()) {
      return Promise.reject("Geekdesk is not fully configured");
    }

    return {
      statusService: geekdeskService,
      controlService: geekdeskService,
    };
  }

  async initializeGeekdeskService(
    credentialsService: CredentialsService,
    settingsService: SettingsService
  ): Promise<GeekdeskService> {
    const geekdeskService = new DefaultGeekdeskService();
    const credentials = await loadCredentials(credentialsService);

    if (credentials) {
      await geekdeskService.initialize(
        credentials.username,
        credentials.password,
        credentials.token
      );
    }

    const settings = await settingsService.getActiveSettings();
    if (settings && settings.type === SETTINGS_TYPE) {
      const geekdeskSettings = settings.values as GeekdeskSettings;
      geekdeskService.setHeights(
        geekdeskSettings.sittingHeight,
        geekdeskSettings.standingHeight
      );
      geekdeskService.setDevice(geekdeskSettings.deviceId);
    }

    return geekdeskService;
  }
}

export {
  GeekdeskService,
  GeekdeskServiceInitializer,
  GeekdeskSettings,
  GeekdeskCredentials,
  Device,
  CREDENTIALS_ACCOUNT,
  CREDENTIALS_SERVICE,
  CREDENTIALS_TOKEN,
  SETTINGS_TYPE,
  loadCredentials,
};
