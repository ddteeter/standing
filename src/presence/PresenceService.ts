import { Subject } from "rxjs";

interface PresenceService {
  getSubject(): Subject<PresenceStatus>;
}

class PresenceStatus {
  presence: Presence;
  at: Date;
}

enum Presence {
  PRESENT,
  ABSENT,
}

class AlwaysPresentService implements PresenceService {
  private readonly subject: Subject<PresenceStatus>;

  constructor() {
    this.subject = new Subject();
    this.subject.next({
      presence: Presence.PRESENT,
      at: new Date(),
    });
  }

  getSubject(): Subject<PresenceStatus> {
    return this.subject;
  }
}

export default PresenceService;
export { AlwaysPresentService, Presence, PresenceStatus };
