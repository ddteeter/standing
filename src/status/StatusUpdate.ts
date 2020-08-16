import { PresenceStatus } from "../presence/PresenceService";
import { DeskStatus } from "../desk/status/DeskStatusService";

export default interface StatusUpdate {
  presence: PresenceStatus;
  desk: DeskStatus;
}
