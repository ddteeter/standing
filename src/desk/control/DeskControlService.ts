import { DeskPosition } from "../status/DeskStatusService";

interface DeskControlService {
  setDeskPosition(position: DeskPosition): void;
}

export default DeskControlService;
