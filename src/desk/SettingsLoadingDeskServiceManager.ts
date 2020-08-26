import {
  GeekdeskServiceInitializer,
  SETTINGS_TYPE,
} from "./geekdesk/GeekdeskService";
import SettingsService, { ResolvedSettings } from "../settings/SettingsService";
import ManualDeskStatusService from "./status/ManualDeskStatusService";
import ManualDeskControlService from "./control/ManualDeskControlService";
import DeskServiceInitializer, {
  InitializedDeskServices,
} from "./DeskServiceInitializer";
import CredentialsService from "../credentials/CredentialsService";

class DefaultDeskServiceInitializer implements DeskServiceInitializer {
  initialize(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _credentialsService: CredentialsService,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _settingsService: SettingsService
  ): Promise<InitializedDeskServices> {
    const defaultStatusService: ManualDeskStatusService = new ManualDeskStatusService();
    return Promise.resolve({
      statusService: defaultStatusService,
      controlService: new ManualDeskControlService(defaultStatusService),
    });
  }
}

const TYPE_TO_INITIALIZER = new Map<string, DeskServiceInitializer>();
TYPE_TO_INITIALIZER.set(SETTINGS_TYPE, new GeekdeskServiceInitializer());

export default class SettingsLoadingDeskServiceManager {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly credentialsService: CredentialsService
  ) {}

  async getDeskServices(): Promise<InitializedDeskServices> {
    const settings: ResolvedSettings | null = await this.settingsService.getActiveSettings();

    let initializer: DeskServiceInitializer = new DefaultDeskServiceInitializer();
    if (settings !== null) {
      initializer = TYPE_TO_INITIALIZER.get(settings.type);
    }

    return await initializer.initialize(
      this.credentialsService,
      this.settingsService
    );
  }
}
