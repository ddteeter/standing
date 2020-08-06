import { app } from "electron";
import { menubar } from "menubar";
import { initialize as initializeIPCListeners } from "./main/ipcListeners";
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

initializeIPCListeners();

const mb = menubar({
  index: MAIN_WINDOW_WEBPACK_ENTRY,
  icon: process.cwd() + "/img/icons/DeskIconTemplate.png",
  preloadWindow: true,
  browserWindow: {
    height: 425,
    width: 385,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  },
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

mb.on("after-create-window", () => {
  mb.window.webContents.openDevTools({ mode: "detach" });
});
