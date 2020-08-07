import StatusPersistenceService, {
  StatusChange,
} from "./StatusPersistenceService";
import { Status } from "./Status";
import {
  RxDocument,
  RxCollection,
  RxDatabase,
  createRxDatabase,
  addRxPlugin,
} from "rxdb";
import * as pouchDbIdb from "pouchdb-adapter-idb";

type StatusChangeMethods = {};

type StatusChangeDocument = RxDocument<StatusChange, StatusChangeMethods>;

type StatusChangeCollectionMethods = {
  insert(statusChange: StatusChange): void;
};

type StatusChangeCollection = RxCollection<
  StatusChange,
  StatusChangeMethods,
  StatusChangeCollectionMethods
>;

type DatabaseCollections = {
  statusChanges: StatusChangeCollectionMethods;
};

type Database = RxDatabase<DatabaseCollections>;

addRxPlugin(pouchDbIdb);

class RxDbStatusPersistenceService implements StatusPersistenceService {
  private database: Database;

  initialize(): Promise<void> {
    return createRxDatabase<DatabaseCollections>({
      name: "withstanding-db",
      adapter: "idb",
    }).then((database) => {
      this.database = database;
    });
  }

  statusUpdate(status: Status): void {
    throw new Error("Method not implemented.");
  }
}

export default RxDbStatusPersistenceService;
