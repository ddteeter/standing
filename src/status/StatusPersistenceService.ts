import { Observable } from "rxjs";
import StatusUpdate from "./StatusUpdate";

type StatusChange = {
  id: string;
  atEpochSeconds: number;
  presence: string;
  deskPosition: string;
};

interface StatusPersistenceService {
  statusUpdate(status: StatusUpdate): void;
  initialize(): Promise<void>;
  getStatusObservable(): Promise<Observable<StatusChange>>;
}

export default StatusPersistenceService;
export { StatusChange };
