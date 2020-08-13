import StatusPersistenceService, {
  StatusChange,
} from "./StatusPersistenceService";
import { Status } from "./Status";
import {
  RxDocument,
  RxCollection,
  RxDatabase,
  createRxDatabase,
  RxJsonSchema,
  addRxPlugin,
} from "rxdb";
import * as uuid from "uuid";
import * as pouchDbIdb from "pouchdb-adapter-idb";
import { Observable, concat, of } from "rxjs";
import { concatAll } from "rxjs/operators";
import { startOfToday } from "date-fns";

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
    atEpochSeconds: {
      type: "integer",
    },
    presence: {
      type: "string",
    },
    deskPosition: {
      type: "string",
    },
  },
  required: ["id", "atEpochSeconds", "presence", "deskPosition"],
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
  statusChanges: StatusChangeCollection;
};

type Database = RxDatabase<DatabaseCollections>;

addRxPlugin(pouchDbIdb);

class RxDbStatusPersistenceService implements StatusPersistenceService {
  private database: Database;

  async initialize(): Promise<void> {
    this.database = await createRxDatabase<DatabaseCollections>({
      name: "withstanding-db",
      adapter: "idb",
    });

    await this.database.collection({
      name: "statusChange",
      schema: statusChangeSchema,
      methods: statusChangeMethods,
      statics: StatusChangeCollectionMethods,
    });
  }

  async statusUpdate(status: Status): Promise<void> {
    await this.database.statusChanges.insert({
      id: uuid.v4(),
      atEpochSeconds: Math.max(
        status.desk.at.getTime(),
        status.presence.at.getTime()
      ),
      presence: status.desk.position,
      deskPosition: status.presence.presence,
    });
  }

  async getStatusObservable(): Promise<Observable<StatusChange>> {
    const latestStatusChanges: StatusChange[] = await this.database.statusChanges
      .find()
      .where("atEpochSeconds")
      .gte(startOfToday().getTime())
      .sort({
        atEpochSeconds: "desc",
      })
      .limit(1)
      .exec();

    const latestEpochSeconds =
      latestStatusChanges.length > 0
        ? latestStatusChanges[0].atEpochSeconds
        : startOfToday().getTime();

    let statusChangesObservable: Observable<StatusChange> = this.database.statusChanges
      .find()
      .sort({
        atEpochSeconds: "desc",
      })
      .where("atEpochSeconds")
      .gte(latestEpochSeconds + 1)
      .$.pipe(concatAll());

    if (latestStatusChanges.length > 0) {
      statusChangesObservable = concat(
        of(latestStatusChanges[0]),
        statusChangesObservable
      );
    }

    return statusChangesObservable;
  }
}

export default RxDbStatusPersistenceService;
