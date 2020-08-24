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

interface GeekdeskService extends DeskControlService, DeskStatusService {
  initialize(username: string, password: string): Promise<void>;
  getConnectedDevice(): Promise<Device | null>;
  getDevices(): Promise<Device[]>;
}

type GeekdeskCredentials = {
  username: string;
  password: string;
};

const loadCredentials = async (
  credentialsService: CredentialsService
): Promise<GeekdeskCredentials | null> => {
  let resolvedCredentials: GeekdeskCredentials | null = null;

  const credentials = await credentialsService.getCredentials(
    CREDENTIALS_SERVICE,
    CREDENTIALS_ACCOUNT
  );

  if (credentials) {
    const credentialsParts = btoa(credentials.password).split(":");
    if (credentialsParts.length === 2) {
      resolvedCredentials = {
        username: credentialsParts[0],
        password: credentialsParts[1],
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
  constructor(
    private readonly particle?: Particle,
    private accessToken?: string
  ) {
    this.particle = new Particle();
  }

  getObservable(): Observable<DeskStatus> {
    throw new Error("Method not implemented.");
  }

  async initialize(username: string, password: string): Promise<void> {
    this.accessToken = (
      await this.particle.login({ username, password })
    ).body.access_token;
  }

  async getDevices(): Promise<Device[]> {
    return await this.particle.getDevices({ auth: this.accessToken });
  }

  async getConnectedDevice(): Promise<Device | null> {
    return Promise.reject("Not yet implemented");
  }

  setDeskPosition(position: DeskPosition): void {
    console.log(position);
    throw new Error("Method not implemented.");
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
        credentials.password
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
  loadCredentials,
};
