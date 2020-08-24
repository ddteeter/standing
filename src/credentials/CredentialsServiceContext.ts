import React from "react";
import CredentialsService from "./CredentialsService";
import Credentials from "./Credentials";

class NoOpCredentialsService implements CredentialsService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCredentials(_service: string, _account: string): Promise<Credentials> {
    return Promise.reject("No-op");
  }
}

const CredentialsServiceContext: React.Context<CredentialsService> = React.createContext<
  CredentialsService
>(new NoOpCredentialsService());

export default CredentialsServiceContext;
