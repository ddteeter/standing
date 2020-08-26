import DeskControlService from "../control/DeskControlService";
import DeskStatusService, {
  DeskPosition,
  DeskStatus,
} from "../status/DeskStatusService";
import { Observable } from "rxjs";
import Particle, { Device } from "particle-api-js";
import DeskServiceInitializer, {
  InitializedDeskServices,
} from "../DeskServiceInitializer";
import CredentialsService from "../../credentials/CredentialsService";
import SettingsService from "../../settings/SettingsService";

const CREDENTIALS_SERVICE = "Standing/Geekdesk";
const CREDENTIALS_ACCOUNT = "basic";
const CREDENTIALS_TOKEN = "token";

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
  getDevices(): Promise<Device[]>;
  setDevice(deviceId: string): void;
  setHeights(sittingHeight: number, standingHeight: number): void;
  getCurrentPosition(): Promise<DeskPosition>;
  getCurrentHeight(): Promise<number>;
}

type GeekdeskCredentials = {
  username: string;
  password: string;
  token?: string;
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
  private accessToken: string;
  private deviceId: string;
  private heightSettings: Map<DeskPosition, number>;

  constructor(private readonly particle?: Particle) {
    this.particle = new Particle();
    this.heightSettings = new Map<DeskPosition, number>();
  }

  getObservable(): Observable<DeskStatus> {
    throw new Error("Method not implemented.");
  }

  async initialize(
    username: string,
    password: string,
    token?: string
  ): Promise<string> {
    let responseToken: Promise<string>;
    if (token) {
      this.accessToken = token;
      responseToken = Promise.resolve(this.accessToken);
    } else {
      try {
        // Non-expiring token for now
        this.accessToken = (
          await this.particle.login({
            username,
            password,
            tokenDuration: 0,
          })
        ).body.access_token;

        responseToken = Promise.resolve(this.accessToken);
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
    this.accessToken = await (
      await this.particle.sendOtp({ mfaToken, otp: oneTimePassword })
    ).body.access_token;
    return this.accessToken;
  }

  setDevice(deviceId: string): void {
    this.deviceId = deviceId;
  }

  setHeights(sittingHeight: number, standingHeight: number): void {
    this.heightSettings.set(DeskPosition.SITTING, sittingHeight);
    this.heightSettings.set(DeskPosition.STANDING, standingHeight);
  }

  async getDevices(): Promise<Device[]> {
    return (await this.particle.listDevices({ auth: this.accessToken })).body;
  }

  async setDeskPosition(position: DeskPosition): Promise<void> {
    await this.particle.callFunction({
      deviceId: this.deviceId,
      auth: this.accessToken,
      name: "setHeight",
      argument: `${this.heightSettings.get(position)}`,
    });
  }

  async getCurrentPosition(): Promise<DeskPosition> {
    const currentHeight = await this.getCurrentHeight();
    const standingHeight = this.heightSettings.get(DeskPosition.STANDING);

    let currentPosition: DeskPosition;
    if (currentHeight >= standingHeight * 0.9) {
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
        auth: this.accessToken,
        name: "getHeight",
        argument: "",
      })
    ).body.return_value;
  }
}

class GeekdeskServiceInitializer implements DeskServiceInitializer {
  async initialize(
    credentialsService: CredentialsService,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __settingsService: SettingsService
  ): Promise<InitializedDeskServices> {
    const geekdeskService = new DefaultGeekdeskService();
    const credentials = await loadCredentials(credentialsService);

    if (credentials) {
      await geekdeskService.initialize(
        credentials.username,
        credentials.password,
        credentials.token
      );
      return {
        statusService: geekdeskService,
        controlService: geekdeskService,
      };
    } else {
      return Promise.reject(
        "Unable to initialize Geekdesk service -- missing credentials"
      );
    }
  }
}

export {
  GeekdeskService,
  GeekdeskServiceInitializer,
  Device,
  CREDENTIALS_ACCOUNT,
  CREDENTIALS_SERVICE,
  CREDENTIALS_TOKEN,
  loadCredentials,
};
