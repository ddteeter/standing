import { hot } from "react-hot-loader";
import * as React from "react";
import TogglPresenceService from "./presence/toggl/TogglPresenceService";
import PresenceService, { PresenceStatus } from "./presence/PresenceService";
import { ipcRenderer } from "electron";

interface RetrievedPassword {
  service: string;
  account: string;
  password: string;
}

ipcRenderer
  .invoke("getPassword", {
    service: "Standing/Toggl",
    account: "api_token",
  })
  .then((password: string) => {
    console.log("Using api token", password);
    const presenceService: PresenceService = new TogglPresenceService(password);
    presenceService
      .getObservable()
      .subscribe((presenceStatus: PresenceStatus) => {
        console.log(presenceStatus);
      });
  });

const App = () => <div>Hi from react!</div>;

export default hot(module)(App);
