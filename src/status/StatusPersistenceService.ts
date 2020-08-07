import { Status } from "./Status";

type StatusChange = {
  id: string;
  atEpochSeconds: number;
  presence: string;
  deskPosition: string;
};

interface StatusPersistenceService {
  statusUpdate(status: Status): void;

  initialize(): Promise<void>;
}

export default StatusPersistenceService;
export { StatusChange };
