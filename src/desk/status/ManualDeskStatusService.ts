import DeskStatusService, {
  DeskStatus,
  DeskPosition,
} from "./DeskStatusService";
import { Observable, Subject, ReplaySubject } from "rxjs";

class ManualDeskStatusService implements DeskStatusService {
  constructor(private subject: Subject<DeskStatus> = new ReplaySubject(1)) {
    subject.next({
      position: DeskPosition.SITTING,
      at: new Date(),
    });
  }

  getObservable(): Observable<DeskStatus> {
    return this.subject;
  }

  positionChanged(newPosition: DeskPosition): void {
    this.subject.next({
      position: newPosition,
      at: new Date(),
    });
  }
}

export default ManualDeskStatusService;
