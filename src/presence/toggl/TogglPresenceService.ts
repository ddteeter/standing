import PresenceService, { Presence, PresenceStatus } from "../PresenceService";
import { Observable, Subscriber } from "rxjs";
import TimeEntry from "./TimeEntry";
import TogglResponse from "./TogglResponse";
import CredentialsService from "../../credentials/CredentialsService";
import Credentials from "../../credentials/Credentials";

class TogglPresenceService implements PresenceService {
  private apiToken: string;

  initialize(credentialsService: CredentialsService): Promise<void> {
    return credentialsService
      .getCredentials("Standing/Toggl", "api_token")
      .then((credentials: Credentials) => {
        this.apiToken = credentials.password;
      });
  }

  getObservable(): Observable<PresenceStatus> {
    return new Observable((subscriber) => {
      this.fetchActiveTimeEntry(subscriber).finally(() => {
        const socket = new WebSocket("wss://stream.toggl.com/ws");

        socket.addEventListener("open", () => {
          socket.send(
            JSON.stringify({
              type: "authenticate",
              // eslint-disable-next-line @typescript-eslint/camelcase
              api_token: this.apiToken,
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
              this.fetchActiveTimeEntry(subscriber);
            }
          } else {
            subscriber.error({
              message: "Unknown Toggl event structure",
              details: event,
            });
          }
        });
      });
    });
  }

  private fetchActiveTimeEntry(
    subscriber: Subscriber<PresenceStatus>
  ): Promise<void> {
    return fetch("https://www.toggl.com/api/v8/time_entries/current", {
      headers: {
        Authorization: `Basic ${btoa(this.apiToken + ":api_token")}`,
      },
    })
      .then(async (response) => {
        const togglResponse: TogglResponse<TimeEntry> = await response.json();
        if (togglResponse.data) {
          const timeEntry = togglResponse.data;
          if (timeEntry.id) {
            subscriber.next({
              presence: Presence.PRESENT,
              at: new Date(Date.parse(timeEntry.start)),
            });
          } else {
            subscriber.next({
              presence: Presence.ABSENT,
              at: new Date(),
            });
          }
        } else {
          subscriber.next({
            presence: Presence.ABSENT,
            at: new Date(),
          });
        }
      })
      .catch((reason) => {
        subscriber.error({
          message: "Unable to fetch Toggl presence",
          details: reason,
        });
      });
  }
}

export default TogglPresenceService;
