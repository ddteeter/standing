import StatusPersistenceService, {
  StatusChange,
} from "./StatusPersistenceService";
import StatusUpdate from "./StatusUpdate";
import {
  RxDocument,
  RxCollection,
  RxDatabase,
  createRxDatabase,
  RxJsonSchema,
  addRxPlugin,
  removeRxDatabase,
} from "rxdb";
import * as uuid from "uuid";
import * as pouchDbIdb from "pouchdb-adapter-idb";
import { Observable, concat, of } from "rxjs";
import { concatAll } from "rxjs/operators";
import { startOfToday, startOfDay, endOfDay } from "date-fns";

type StatusChangeMethods = {};
const statusChangeMethods: StatusChangeMethods = {};

const statusChangeSchema: RxJsonSchema<StatusChange> = {
  title: "status change schema",
  version: 0,
  keyCompression: true,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true,
    },
    atEpochMilliseconds: {
      type: "integer",
    },
    presence: {
      type: "string",
    },
    deskPosition: {
      type: "string",
    },
  },
  required: ["id", "atEpochMilliseconds", "presence", "deskPosition"],
  indexes: ["atEpochMilliseconds"],
};

type StatusChangeDocument = RxDocument<StatusChange, StatusChangeMethods>;

type StatusChangeCollectionMethods = {};
const StatusChangeCollectionMethods: StatusChangeCollectionMethods = {};

type StatusChangeCollection = RxCollection<
  StatusChange,
  StatusChangeMethods,
  StatusChangeCollectionMethods
>;

type DatabaseCollections = {
  status_changes: StatusChangeCollection;
};

type Database = RxDatabase<DatabaseCollections>;

addRxPlugin(pouchDbIdb);

class RxDbStatusPersistenceService implements StatusPersistenceService {
  private database: Database;

  async initialize(): Promise<void> {
    // TODO: Development only
    await removeRxDatabase("withstanding_db", "idb");

    this.database = await createRxDatabase<DatabaseCollections>({
      name: "withstanding_db",
      adapter: "idb",
    });

    await this.database.collection({
      name: "status_changes",
      schema: statusChangeSchema,
      methods: statusChangeMethods,
      statics: StatusChangeCollectionMethods,
    });
  }

  async statusUpdate(status: StatusUpdate): Promise<void> {
    await this.database.status_changes.insert({
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
    const latestStatusChanges: StatusChange[] = await this.database.status_changes
      .find()
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

    let statusChangesObservable: Observable<StatusChange> = this.database.status_changes
      .find()
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
    return this.database.status_changes
      .find()
      .where("atEpochMilliseconds")
      .gte(startOfDay(day).getTime())
      .and("atEpochMilliseconds")
      .lte(endOfDay(day).getTime()).$;
  }
}

export default RxDbStatusPersistenceService;
