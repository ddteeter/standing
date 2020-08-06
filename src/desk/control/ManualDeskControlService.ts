import DeskControlService from "./DeskControlService";
import { DeskPosition } from "../status/DeskStatusService";
import ManualDeskStatusService from "../status/ManualDeskStatusService";

class ManualDeskControlService implements DeskControlService {
  constructor(readonly deskStatusService: ManualDeskStatusService) {}

  setDeskPosition(position: DeskPosition): void {
    this.deskStatusService.positionChanged(position);
  }
}

export default ManualDeskControlService;
