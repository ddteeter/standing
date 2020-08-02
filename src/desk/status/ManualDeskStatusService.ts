import DeskStatusService, {
  DeskStatus,
  DeskPosition,
} from "./DeskStatusService";
import { Observable } from "rxjs";

class ManualDeskStatusService implements DeskStatusService {
  getObservable(): Observable<DeskStatus> {
    return new Observable((subscriber) => {
      subscriber.next({
        position: DeskPosition.SITTING,
        at: new Date(),
      });
    });
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }
}

export default ManualDeskStatusService;
