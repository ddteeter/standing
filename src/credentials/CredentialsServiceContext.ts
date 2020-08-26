import React from "react";
import CredentialsService from "./CredentialsService";
import Credentials from "./Credentials";

class NoOpCredentialsService implements CredentialsService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCredentials(_service: string, _account: string): Promise<void> {
    return Promise.reject("No-op");
  }
  saveCredentials(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _service: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _account: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _password: string
  ): Promise<void> {
    return Promise.reject("No-op");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCredentials(_service: string, _account: string): Promise<Credentials> {
    return Promise.reject("No-op");
  }
}

const CredentialsServiceContext: React.Context<CredentialsService> = React.createContext<
  CredentialsService
>(new NoOpCredentialsService());

export default CredentialsServiceContext;
