import { StatusChange } from "../status/StatusPersistenceService";
import {
  RxDocument,
  RxCollection,
  RxDatabase,
  createRxDatabase,
  RxJsonSchema,
  addRxPlugin,
  removeRxDatabase,
} from "rxdb";
import * as pouchDbIdb from "pouchdb-adapter-idb";

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
      final: true,
    },
    presence: {
      type: "string",
      final: true,
    },
    deskPosition: {
      type: "string",
      final: true,
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

type SettingsMethods = {};
const settingsMethods: SettingsMethods = {};

type Settings = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
};

const settingsSchema: RxJsonSchema<Settings> = {
  title: "settings schema",
  version: 0,
  keyCompression: true,
  type: "object",
  properties: {
    type: {
      type: "string",
      primary: true,
    },
    values: {
      type: "object",
    },
  },
  required: ["type", "values"],
};

type SettingsDocument = RxDocument<Settings, SettingsMethods>;

type SettingsCollectionMethods = {};
const SettingsCollectionMethods: SettingsCollectionMethods = {};

type SettingsCollection = RxCollection<
  Settings,
  SettingsMethods,
  SettingsCollectionMethods
>;

type DatabaseCollections = {
  status_changes: StatusChangeCollection;
  settings: SettingsCollection;
};

type Database = RxDatabase<DatabaseCollections>;

addRxPlugin(pouchDbIdb);

export default class RxDbPersistenceService {
  private database: Database;

  async initialize(): Promise<Database> {
    if (!this.database) {
      // TODO: Development only
      await removeRxDatabase("withstanding_db", "idb");

      this.database = await createRxDatabase<DatabaseCollections>({
        name: "withstanding_db",
        adapter: "idb",
        multiInstance: true,
      });

      await this.database.collection({
        name: "status_changes",
        schema: statusChangeSchema,
        methods: statusChangeMethods,
        statics: StatusChangeCollectionMethods,
      });

      await this.database.collection({
        name: "settings",
        schema: settingsSchema,
        methods: settingsMethods,
        statics: SettingsCollectionMethods,
      });
    } else {
      return Promise.resolve(this.database);
    }
  }

  getDatabase(): Database {
    return this.database;
  }
}

export { Database };
