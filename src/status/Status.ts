import { Presence } from "../presence/PresenceService";
import { DeskPosition } from "../desk/status/DeskStatusService";

export default interface StatusChange {
  at: Date;
  presence: Presence;
  deskPosition: DeskPosition;
}
