import DeskStatusService from "./status/DeskStatusService";
import DeskControlService from "./control/DeskControlService";
import SettingsService from "../settings/SettingsService";
import CredentialsService from "../credentials/CredentialsService";

type InitializedDeskServices = {
  statusService: DeskStatusService;
  controlService: DeskControlService;
};

export default interface DeskServiceInitializer {
  initialize(
    credentialsService: CredentialsService,
    settingsService: SettingsService
  ): Promise<InitializedDeskServices>;
}

export { InitializedDeskServices };
