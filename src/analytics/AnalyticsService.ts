import Analytics from "./Analytics";
import { Observable } from "rxjs";

interface AnalyticsService {
  getActiveAnalytics(): Observable<Analytics>;
}

class DefaultAnalyticsService implements AnalyticsService {
  getActiveAnalytics(): Observable<Analytics> {
    return new Observable<Analytics>((subscriber) => {
      subscriber.next({
        sittingTime: 0,
        standingTime: 0,
      });
    });
  }
}

export default AnalyticsService;
export { DefaultAnalyticsService };
