import { Observable } from "rxjs";

interface PresenceService {
  getObservable(): Observable<PresenceStatus>;
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
  private readonly observable: Observable<PresenceStatus>;

  constructor() {
    this.observable = new Observable((subscriber) => {
      subscriber.next({
        presence: Presence.PRESENT,
        at: new Date(),
      });
    });
  }

  getObservable(): Observable<PresenceStatus> {
    return this.observable;
  }
}

export default PresenceService;
export { AlwaysPresentService, Presence, PresenceStatus };
