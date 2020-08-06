import { ipcRenderer } from "electron";

interface SettingsService {
  showSettings(): void;
}

class DefaultSettingsService implements SettingsService {
  showSettings(): void {
    ipcRenderer.postMessage("settings", { command: "show" });
  }
}

export default SettingsService;
export { DefaultSettingsService };
