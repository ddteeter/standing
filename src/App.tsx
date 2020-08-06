import { hot } from "react-hot-loader";
import * as React from "react";
import TogglPresenceService from "./presence/toggl/TogglPresenceService";
import PresenceService, { PresenceStatus } from "./presence/PresenceService";
import CredentialsService from "./credentials/CredentialsService";
import Dashboard from "./view/dashboard/Dashboard";
import { interval, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import ManualDeskStatusService from "./desk/status/ManualDeskStatusService";
import DeskStatusService, { DeskStatus } from "./desk/status/DeskStatusService";
import NavBar from "./view/nav/NavBar";

const credentialsService = new CredentialsService();
const presenceService: PresenceService = new TogglPresenceService();
const deskStatusService: DeskStatusService = new ManualDeskStatusService();

presenceService.initialize(credentialsService).then(() => {
  combineLatest(
    interval(1000),
    presenceService.getObservable(),
    deskStatusService.getObservable()
  )
    .pipe(
      map((observation: [number, PresenceStatus, DeskStatus]) => {
        return {
          presence: observation[1],
          desk: observation[2],
        };
      })
    )
    .subscribe(console.log);
});

const App = (): React.ReactElement => (
  <div>
    <Dashboard />
    <NavBar />
  </div>
);

export default hot(module)(App);
