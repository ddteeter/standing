import { Status } from "./Status";
import { Observable } from "rxjs";

type StatusChange = {
  id: string;
  atEpochSeconds: number;
  presence: string;
  deskPosition: string;
};

interface StatusPersistenceService {
  statusUpdate(status: Status): void;
  initialize(): Promise<void>;
  getStatusObservable(): Promise<Observable<StatusChange>>;
}

export default StatusPersistenceService;
export { StatusChange };
