import { ipcRenderer } from "electron";

interface SettingsService {
  showSettings(): void;
}

class DefaultSettingsService implements SettingsService {
  showSettings(): void {
    ipcRenderer.invoke("showSettings");
  }
}

export default SettingsService;
export { DefaultSettingsService };
