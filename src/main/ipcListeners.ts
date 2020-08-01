import { ipcMain } from "electron";
import keytar from "keytar";

interface GetPasswordRequest {
  service: string;
  account: string;
}

const initialize = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcMain.handle("getPassword", (event: any, msg: any) => {
    const payload: GetPasswordRequest = msg;
    return keytar.getPassword(payload.service, payload.account);
  });
};

export { initialize };
