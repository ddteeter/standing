import React, { useState, useEffect } from "react";
import TogglPresenceService from "./presence/toggl/TogglPresenceService";
import PresenceService, {
  Presence,
  PresenceStatus,
} from "./presence/PresenceService";
import CredentialsService from "./credentials/CredentialsService";
import Dashboard from "./view/dashboard/Dashboard";
import { combineLatest, Observable, Subscription } from "rxjs";
import { map, shareReplay, distinctUntilKeyChanged } from "rxjs/operators";
import Status from "./status/Status";
import ManualDeskStatusService from "./desk/status/ManualDeskStatusService";
import DeskStatusService, {
  DeskStatus,
  DeskPosition,
} from "./desk/status/DeskStatusService";
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
import RxDbPersistenceService from "./persistence/RxDbPersistenceService";
import SettingsService, {
  DefaultSettingsService,
} from "./settings/SettingsService";
import SettingsServiceContext from "./settings/SettingsServiceContext";
import SettingsLoadingDeskServiceManager from "./desk/SettingsLoadingDeskServiceManager";

const credentialsService = new CredentialsService();
const presenceService: PresenceService = new TogglPresenceService();
const rxDbPersistenceService: RxDbPersistenceService = new RxDbPersistenceService();
const statusPersistenceService: StatusPersistenceService = new RxDbStatusPersistenceService(
  rxDbPersistenceService
);
const analyticsService: AnalyticsService = new DefaultAnalyticsService(
  statusPersistenceService
);
const settingsService: SettingsService = new DefaultSettingsService(
  rxDbPersistenceService
);
const deskServiceManager = new SettingsLoadingDeskServiceManager(
  settingsService,
  credentialsService
);

const App = (): React.ReactElement => {
  const [statusObservable, setStatusObservable] = useState(
    new Observable<Status>(() => {
      // Never emits
    })
  );
  const [deskControlService, setDeskControlService] = useState<
    DeskControlService
  >(new ManualDeskControlService(new ManualDeskStatusService()));

  const [analyticsObservable, setAnalyticsObservable] = useState(
    new Observable<Analytics>(() => {
      // Never emits
    })
  );

  useEffect(() => {
    let statusSubscription: Subscription | undefined;

    Promise.all([
      presenceService.initialize(credentialsService),
      rxDbPersistenceService.initialize(),
      statusPersistenceService.initialize(),
    ])
      .then(
        async (): Promise<DeskStatusService> => {
          const deskServices = await deskServiceManager.getDeskServices();
          setDeskControlService(deskServices.controlService);
          return deskServices.statusService;
        }
      )
      .then((statusService: DeskStatusService) => {
        setAnalyticsObservable(analyticsService.getActiveAnalytics());

        combineLatest(
          presenceService
            .getObservable()
            .pipe(distinctUntilKeyChanged("presence")),
          statusService
            .getObservable()
            .pipe(distinctUntilKeyChanged("position"))
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
    <SettingsServiceContext.Provider value={settingsService}>
      <DeskControlServiceContext.Provider value={deskControlService}>
        <StatusContext.Provider value={statusObservable}>
          <AnalyticsContext.Provider value={analyticsObservable}>
            <Dashboard />
            <NavBar />
          </AnalyticsContext.Provider>
        </StatusContext.Provider>
      </DeskControlServiceContext.Provider>
    </SettingsServiceContext.Provider>
  );
};

export default App;
