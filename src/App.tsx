import React, { useState, useEffect } from "react";
import TogglPresenceService from "./presence/toggl/TogglPresenceService";
import PresenceService, {
  Presence,
  PresenceStatus,
} from "./presence/PresenceService";
import CredentialsService from "./credentials/CredentialsService";
import Dashboard from "./view/dashboard/Dashboard";
import { combineLatest, Observable, Subscription, interval } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import Status from "./status/Status";
import ManualDeskStatusService from "./desk/status/ManualDeskStatusService";
import { DeskStatus, DeskPosition } from "./desk/status/DeskStatusService";
import NavBar from "./view/nav/NavBar";
import StatusContext from "./status/StatusContext";
import Analytics from "./analytics/Analytics";
import AnalyticsContext from "./analytics/AnalyticsContext";
import AnalyticsService, {
  DefaultAnalyticsService,
} from "./analytics/AnalyticsService";
import DeskControlService from "./desk/control/DeskControlService";
import ManualDeskControlService from "./desk/control/ManualDeskControlService";
import DeskControlServiceContext from "./desk/control/DeskControlServiceContext";
import StatusPersistenceService, {
  StatusChange,
} from "./status/StatusPersistenceService";
import RxDbStatusPersistenceService from "./status/RxDbStatusPersistenceService";

const credentialsService = new CredentialsService();
const presenceService: PresenceService = new TogglPresenceService();
const deskStatusService: ManualDeskStatusService = new ManualDeskStatusService();
const statusPersistenceService: StatusPersistenceService = new RxDbStatusPersistenceService();
const analyticsService: AnalyticsService = new DefaultAnalyticsService(
  statusPersistenceService
);
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
      statusPersistenceService.initialize(),
    ]).then(() => {
      setAnalyticsObservable(
        combineLatest(
          interval(1000),
          analyticsService.getActiveAnalytics()
        ).pipe(
          tap((entry) => {
            console.log(entry);
          }),
          map((entry: [number, Analytics]) => {
            return entry[1];
          })
        )
      );

      combineLatest(
        presenceService.getObservable(),
        deskStatusService.getObservable()
      )
        .pipe(
          map((observation: [PresenceStatus, DeskStatus]) => {
            return {
              presence: observation[0],
              desk: observation[1],
            };
          })
        )
        .subscribe((status) => {
          statusPersistenceService.statusUpdate(status);
        });

      statusPersistenceService
        .getStatusObservable()
        .then((statusObservable) => {
          const tickingStatusObservable: Observable<Status> = shareReplay<
            StatusChange
          >(1)(statusObservable).pipe(
            map((observation: StatusChange) => {
              return {
                at: new Date(observation.atEpochMilliseconds),
                presence:
                  Presence[observation.presence as keyof typeof Presence],
                deskPosition:
                  DeskPosition[
                    observation.deskPosition as keyof typeof DeskPosition
                  ],
              };
            })
          );

          setStatusObservable(tickingStatusObservable);
        });
    });

    return (): void => {
      if (statusSubscription) {
        statusSubscription.unsubscribe();
      }
    };
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
