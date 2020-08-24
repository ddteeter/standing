import { ipcRenderer } from "electron";
import Credentials from "./Credentials";

export default class CredentialService {
  getCredentials(service: string, account: string): Promise<Credentials> {
    return ipcRenderer
      .invoke("getPassword", {
        service,
        account,
      })
      .then((password: string) => {
        return {
          service,
          account,
          password,
        };
      });
  }

  async saveCredentials(
    service: string,
    account: string,
    password: string
  ): Promise<void> {
    await ipcRenderer.invoke("setPassword", {
      service,
      account,
      password,
    });
  }
}
