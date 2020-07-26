import { hot } from "react-hot-loader";
import * as React from "react";
import TogglPresenceService from "./presence/toggl/TogglPresenceService";
import PresenceService, { PresenceStatus } from "./presence/PresenceService";
import CredentialsService from "./credentials/CredentialsService";
import Dashboard from "./view/dashboard/Dashboard";

const credentialsService = new CredentialsService();
const presenceService: PresenceService = new TogglPresenceService();

presenceService.initialize(credentialsService).then(() => {
  presenceService
    .getObservable()
    .subscribe((presenceStatus: PresenceStatus) => {
      console.log(presenceStatus);
    });
});

const App = () => <Dashboard />;

export default hot(module)(App);
