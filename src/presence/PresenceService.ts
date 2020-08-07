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
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

const displayable = (presence: Presence): string => {
  let displayableValue;

  switch (presence) {
    case Presence.PRESENT:
      displayableValue = "Present";
      break;
    case Presence.ABSENT:
      displayableValue = "Away";
      break;
  }

  return displayableValue;
};

export default PresenceService;
export { Presence, PresenceStatus, displayable };
