import { Observable } from "rxjs";
import CredentialsService from "../credentials/CredentialsService";

interface PresenceService {
  getObservable(): Observable<PresenceStatus>;
  initialize(credentialsService: CredentialsService): Promise<void>;
}

class PresenceStatus {
  presence: Presence;
  at: Date;
}

enum Presence {
  PRESENT,
  ABSENT,
}

export default PresenceService;
export { Presence, PresenceStatus };
