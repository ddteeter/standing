import { PresenceStatus } from "../presence/PresenceService";
import { DeskStatus } from "../desk/status/DeskStatusService";

export interface Status {
  presence: PresenceStatus;
  desk: DeskStatus;
}
