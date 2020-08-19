import DeskControlService from "../control/DeskControlService";
import DeskStatusService, {
  DeskPosition,
  DeskStatus,
} from "../status/DeskStatusService";
import { Observable } from "rxjs";

export default class GeekdeskService
  implements DeskControlService, DeskStatusService {
  getObservable(): Observable<DeskStatus> {
    throw new Error("Method not implemented.");
  }
  initialize(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  setDeskPosition(position: DeskPosition): void {
    throw new Error("Method not implemented.");
  }
}
