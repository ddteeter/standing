import { ipcMain, BrowserWindow } from "electron";
import keytar from "keytar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const SETTINGS_WINDOW_WEBPACK_ENTRY: any;

let settingsWindow: BrowserWindow | null;

type GetPasswordRequest = {
  service: string;
  account: string;
};

type SetPasswordRequest = {
  service: string;
  account: string;
  password: string;
};

const initialize = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcMain.handle("getPassword", (event: any, msg: any) => {
    const payload: GetPasswordRequest = msg;
    return keytar.getPassword(payload.service, payload.account);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcMain.handle("setPassword", (event: any, msg: any) => {
    const payload: SetPasswordRequest = msg;
    return keytar.setPassword(
      payload.service,
      payload.account,
      payload.password
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcMain.handle("removePassword", (event: any, msg: any) => {
    const payload: SetPasswordRequest = msg;
    return keytar.deletePassword(payload.service, payload.account);
  });

  ipcMain.handle("showSettings", () => {
    if (settingsWindow) {
      settingsWindow.show();
    } else {
      settingsWindow = new BrowserWindow({
        show: false,
        height: 600,
        width: 800,
        webPreferences: {
          nodeIntegration: true,
        },
      });

      settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

      settingsWindow.on("ready-to-show", () => {
        settingsWindow.show();
        settingsWindow.webContents.openDevTools({ mode: "detach" });
      });

      settingsWindow.on("closed", () => {
        settingsWindow = null;
      });
    }
  });
};

export { initialize };
