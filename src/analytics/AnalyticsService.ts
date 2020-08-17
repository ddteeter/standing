import Analytics from "./Analytics";
import { Observable } from "rxjs";
import StatusPersistenceService, {
  StatusChange,
} from "../status/StatusPersistenceService";
import { map } from "rxjs/operators";
import { Presence } from "../presence/PresenceService";
import { DeskPosition } from "../desk/status/DeskStatusService";
import { differenceInSeconds } from "date-fns";

interface AnalyticsService {
  getActiveAnalytics(): Observable<Analytics>;
}

type PresentPeriod = {
  start: Date;
  end?: Date;
  deskPosition: DeskPosition;
};

class DefaultAnalyticsService implements AnalyticsService {
  constructor(
    private readonly statusPersistenceService: StatusPersistenceService
  ) {}

  getActiveAnalytics(): Observable<Analytics> {
    return this.statusPersistenceService
      .getAllChangesForDayObservable(new Date())
      .pipe(
        map((statusChanges: StatusChange[]) => {
          console.log(statusChanges);
          let currentPresentPeriod: PresentPeriod | null = null;

          const presentPeriods: PresentPeriod[] = [];
          statusChanges.forEach((statusChange: StatusChange) => {
            if (statusChange.presence === Presence.PRESENT) {
              let createNew = false;

              if (
                currentPresentPeriod &&
                currentPresentPeriod.deskPosition !==
                  DeskPosition[
                    statusChange.deskPosition as keyof typeof DeskPosition
                  ]
              ) {
                currentPresentPeriod.end = new Date(
                  statusChange.atEpochMilliseconds
                );

                createNew = true;
              } else if (!currentPresentPeriod) {
                createNew = true;
              }

              if (createNew) {
                currentPresentPeriod = {
                  start: new Date(statusChange.atEpochMilliseconds),
                  deskPosition:
                    DeskPosition[
                      statusChange.deskPosition as keyof typeof DeskPosition
                    ],
                };

                presentPeriods.push(currentPresentPeriod);
              }
            } else {
              if (currentPresentPeriod) {
                currentPresentPeriod.end = new Date(
                  statusChange.atEpochMilliseconds
                );
              }
            }
          });

          return {
            standingTime: presentPeriods.reduce(
              (totalStandingTime, presentPeriod) => {
                if (presentPeriod.deskPosition === DeskPosition.STANDING) {
                  return (
                    totalStandingTime +
                    differenceInSeconds(
                      presentPeriod.start,
                      presentPeriod.end || new Date()
                    )
                  );
                } else {
                  return totalStandingTime;
                }
              },
              0
            ),
            totalTime: presentPeriods.reduce((totalTime, presentPeriod) => {
              return (
                totalTime +
                differenceInSeconds(presentPeriod.start, presentPeriod.end)
              );
            }, 0),
          };
        })
      );
  }
}

export default AnalyticsService;
export { DefaultAnalyticsService };
