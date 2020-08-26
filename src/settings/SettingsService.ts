import { ipcRenderer } from "electron";
import RxDbPersistenceService from "../persistence/RxDbPersistenceService";

type ResolvedSettings = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
};

interface SettingsService {
  showSettings(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getActiveSettings(): Promise<ResolvedSettings>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSettings(type: string): Promise<Record<string, any>>;
  updateSettings(
    type: string,
    active: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings: Record<string, any>
  ): Promise<void>;
}

class DefaultSettingsService implements SettingsService {
  private persistenceService: RxDbPersistenceService;

  constructor(persistenceService: RxDbPersistenceService) {
    this.persistenceService = persistenceService;
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }

  showSettings(): void {
    ipcRenderer.invoke("showSettings");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getActiveSettings(): Promise<ResolvedSettings | null> {
    const settings = await this.persistenceService
      .getDatabase()
      .settings.find()
      .where("active")
      .eq(true)
      .exec();

    let resolvedSettings = null;
    if (settings.length) {
      resolvedSettings = {
        type: settings[0].type,
        values: settings[0].values,
      };
    }

    return resolvedSettings;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSettings(type: string): Promise<ResolvedSettings | null> {
    const settings = await this.persistenceService
      .getDatabase()
      .settings.find()
      .where("type")
      .eq(type)
      .exec();

    let resolvedSettings = null;
    if (settings) {
      resolvedSettings = {
        type,
        values: settings.values,
      };
    }

    return resolvedSettings;
  }

  async updateSettings(
    type: string,
    active: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings: Record<string, any>
  ): Promise<void> {
    await this.persistenceService.getDatabase().settings.upsert({
      type: type,
      values: settings,
    });
    // Update all other settings to inactive
    (
      await this.persistenceService
        .getDatabase()
        .settings.find()
        .where("active")
        .eq(true)
        .exec()
    ).forEach((activeSetting) => {
      if (activeSetting.type !== type) {
        activeSetting.update({
          active: false,
        });
      }
    });
  }
}

export default SettingsService;
export { DefaultSettingsService, ResolvedSettings };
