import React, { useState, useEffect } from "react";
import TogglPresenceService from "./presence/toggl/TogglPresenceService";
import PresenceService, { PresenceStatus } from "./presence/PresenceService";
import CredentialsService from "./credentials/CredentialsService";
import Dashboard from "./view/dashboard/Dashboard";
import { interval, combineLatest, Observable, Subscription } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import ManualDeskStatusService from "./desk/status/ManualDeskStatusService";
import { DeskStatus } from "./desk/status/DeskStatusService";
import NavBar from "./view/nav/NavBar";
import { Status } from "./status/Status";
import StatusContext from "./status/StatusContext";
import Analytics from "./analytics/Analytics";
import AnalyticsContext from "./analytics/AnalyticsContext";
import AnalyticsService, {
  DefaultAnalyticsService,
} from "./analytics/AnalyticsService";
import DeskControlService from "./desk/control/DeskControlService";
import ManualDeskControlService from "./desk/control/ManualDeskControlService";
import DeskControlServiceContext from "./desk/control/DeskControlServiceContext";

const credentialsService = new CredentialsService();
const presenceService: PresenceService = new TogglPresenceService();
const deskStatusService: ManualDeskStatusService = new ManualDeskStatusService();
const analyticsService: AnalyticsService = new DefaultAnalyticsService();
const deskControlService: DeskControlService = new ManualDeskControlService(
  deskStatusService
);

const App = (): React.ReactElement => {
  const [statusObservable, setStatusObservable] = useState(
    new Observable<Status>(() => {
      // Never emits
    })
  );

  const [analyticsObservable, setAnalyticsObservable] = useState(
    new Observable<Analytics>(() => {
      // Never emits
    })
  );

  useEffect(() => {
    let statusSubscription: Subscription | undefined;

    Promise.all([
      presenceService.initialize(credentialsService),
      deskStatusService.initialize(),
    ]).then(() => {
      const statusObservable = shareReplay<Status>(1)(
        combineLatest(
          interval(1000),
          presenceService.getObservable(),
          deskStatusService.getObservable()
        ).pipe(
          map((observation: [number, PresenceStatus, DeskStatus]) => {
            return {
              presence: observation[1],
              desk: observation[2],
            };
          })
        )
      );

      setStatusObservable(statusObservable);
    });

    return (): void => {
      if (statusSubscription) {
        statusSubscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    setAnalyticsObservable(analyticsService.getActiveAnalytics());
  }, []);

  return (
    <DeskControlServiceContext.Provider value={deskControlService}>
      <StatusContext.Provider value={statusObservable}>
        <AnalyticsContext.Provider value={analyticsObservable}>
          <Dashboard />
          <NavBar />
        </AnalyticsContext.Provider>
      </StatusContext.Provider>
    </DeskControlServiceContext.Provider>
  );
};

export default App;
