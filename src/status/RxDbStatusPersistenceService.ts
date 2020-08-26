import StatusPersistenceService, {
  StatusChange,
} from "./StatusPersistenceService";
import StatusUpdate from "./StatusUpdate";
import * as uuid from "uuid";
import { Observable, concat, of } from "rxjs";
import { concatAll } from "rxjs/operators";
import { startOfToday, startOfDay, endOfDay } from "date-fns";
import RxDbPersistenceService from "../persistence/RxDbPersistenceService";

class RxDbStatusPersistenceService implements StatusPersistenceService {
  private persistenceService: RxDbPersistenceService;

  constructor(persistenceService: RxDbPersistenceService) {
    this.persistenceService = persistenceService;
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }

  async statusUpdate(status: StatusUpdate): Promise<void> {
    await this.persistenceService.getDatabase().status_changes.insert({
      id: uuid.v4(),
      atEpochMilliseconds: Math.max(
        status.desk.at.getTime(),
        status.presence.at.getTime()
      ),
      presence: status.presence.presence,
      deskPosition: status.desk.position,
    });
  }

  async getStatusObservable(): Promise<Observable<StatusChange>> {
    const latestStatusChanges: StatusChange[] = await this.persistenceService
      .getDatabase()
      .status_changes.find()
      .where("atEpochMilliseconds")
      .gte(startOfToday().getTime())
      .sort({
        atEpochMilliseconds: "desc",
      })
      .limit(1)
      .exec();

    const latestEpochSeconds =
      latestStatusChanges.length > 0
        ? latestStatusChanges[0].atEpochMilliseconds
        : startOfToday().getTime();

    let statusChangesObservable: Observable<StatusChange> = this.persistenceService
      .getDatabase()
      .status_changes.find()
      .sort({
        atEpochMilliseconds: "desc",
      })
      .where("atEpochMilliseconds")
      .gte(latestEpochSeconds + 1)
      .limit(1)
      .$.pipe(concatAll());

    if (latestStatusChanges.length > 0) {
      statusChangesObservable = concat(
        of(latestStatusChanges[0]),
        statusChangesObservable
      );
    }

    return statusChangesObservable;
  }

  getAllChangesForDayObservable(day: Date): Observable<StatusChange[]> {
    return this.persistenceService
      .getDatabase()
      .status_changes.find()
      .where("atEpochMilliseconds")
      .gte(startOfDay(day).getTime())
      .lte(endOfDay(day).getTime()).$;
  }
}

export default RxDbStatusPersistenceService;
