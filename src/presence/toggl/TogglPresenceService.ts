import PresenceService, { Presence, PresenceStatus } from "../PresenceService";
import { Observable, Subscriber } from "rxjs";
import TimeEntry from "./TimeEntry";

class TogglPresenceService implements PresenceService {
  private readonly observable: Observable<PresenceStatus>;
  private readonly apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;

    this.observable = new Observable((subscriber) => {
      let activeTimeEntry;

      fetch("https://www.toggl.com/api/v8/time_entries/current", {
        headers: {
          Authorization: `Basic ${atob(apiToken + ":api_token")}`,
        },
      })
        .then(async (response) => {
          const json = await response.json();
          const timeEntry: TimeEntry = JSON.parse(json);
          activeTimeEntry = timeEntry.id;
          subscriber.next({
            presence: Presence.PRESENT,
            at: new Date(Date.parse(timeEntry.start)),
          });
        })
        .finally(() => {
          const socket = new WebSocket("wss://stream.toggl.com/ws");

          socket.addEventListener("open", () => {
            socket.send(
              JSON.stringify({
                type: "authenticate",
                // eslint-disable-next-line @typescript-eslint/camelcase
                api_token: apiToken,
              })
            );
          });

          socket.addEventListener("message", (event: MessageEvent) => {
            if (typeof event.data === "string") {
              const message = JSON.parse(event.data);

              if (message.session_id) {
                // Authenticated
              } else if (message.type === "ping") {
                socket.send(
                  JSON.stringify({
                    type: "pong",
                  })
                );
              } else {
                this.processMessage(subscriber, message);
              }
            } else {
              // Error handling
            }
          });
        });
    });

    // TODO: Error handling
  }

  processMessage(
    subscriber: Subscriber<PresenceStatus>,
    message: Record<string, any>
  ): void {
    // TODO
  }

  getObservable(): Observable<PresenceStatus> {
    return this.observable;
  }
}

export default TogglPresenceService;
