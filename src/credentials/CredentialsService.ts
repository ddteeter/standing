import { ipcRenderer } from "electron";
import Credentials from "./Credentials";

export default class CredentialService {
  getCredentials(service: string, account: string): Promise<Credentials> {
    return ipcRenderer
      .invoke("getPassword", {
        service: service,
        account: account,
      })
      .then((password: string) => {
        return {
          service,
          account,
          password,
        };
      });
  }
}
