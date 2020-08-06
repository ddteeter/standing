import React from "react";
import DeskControlService from "./DeskControlService";

class NoOpDeskControlService implements DeskControlService {
  setDeskPosition(): void {
    // Intentionally do nothing
  }
}

const DeskControlServiceContext: React.Context<DeskControlService> = React.createContext<
  DeskControlService
>(new NoOpDeskControlService());

export default DeskControlServiceContext;
