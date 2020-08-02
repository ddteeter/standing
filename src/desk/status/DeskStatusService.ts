import { Observable } from "rxjs";

interface DeskStatusService {
  getObservable(): Observable<DeskStatus>;
  initialize(): Promise<void>;
}

class DeskStatus {
  position: DeskPosition;
  at: Date;
}

enum DeskPosition {
  SITTING,
  STANDING,
}

export default DeskStatusService;
export { DeskStatus, DeskPosition };
