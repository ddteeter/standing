import PresenceService, { Presence, PresenceStatus } from "./PresenceService";
import { Subject } from "rxjs";
import WebSocket from "ws";

class TogglPresenceService implements PresenceService {
  private readonly subject: Subject<PresenceStatus>;
  private readonly apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;

    const socket = new WebSocket("wss://stream.toggl.com/ws");

    socket.on("open", () => {
      socket.send({
        type: "authenticate",
        // eslint-disable-next-line @typescript-eslint/camelcase
        api_token: apiToken,
      });
    });

    socket.on("message", (msg) => {
      if (typeof msg === "string") {
        const message = JSON.parse(msg);

        if (message.session_id) {
          // Authenticated
        } else if (message.type === "ping") {
          socket.send({
            type: "pong",
          });
        } else {
          console.log(msg);
        }
      } else {
        // Error handling
      }
    });

    // TODO: Error handling
  }

  getSubject(): Subject<PresenceStatus> {
    return this.subject;
  }
}

export default TogglPresenceService;
