import * as React from "react";
import ArrowUp from "../icons/ArrowUp";
import ArrowDown from "../icons/ArrowDown";
import IconButton from "./IconButton";
import Adjustments from "../icons/Adjustments";
import DeskControlService from "../../desk/control/DeskControlService";
import DeskControlServiceContext from "../../desk/control/DeskControlServiceContext";
import { useContext } from "react";
import { DeskPosition } from "../../desk/status/DeskStatusService";
import SettingsService, {
  DefaultSettingsService,
} from "../../settings/SettingsService";

const settingsService: SettingsService = new DefaultSettingsService();

const NavBar = (): React.ReactElement => {
  const deskControlService: DeskControlService = useContext(
    DeskControlServiceContext
  );

  return (
    <div className="fixed bottom-0 w-full bg-gray-600">
      <div className="flex flex-row items-center justify-start">
        <div className="flex flex-row items-center justify-start">
          <IconButton
            onClick={(): void =>
              deskControlService.setDeskPosition(DeskPosition.STANDING)
            }
          >
            <ArrowUp />
          </IconButton>
          <IconButton
            onClick={(): void =>
              deskControlService.setDeskPosition(DeskPosition.SITTING)
            }
          >
            <ArrowDown />
          </IconButton>
        </div>
        <div className="ml-auto flex flex-row items-center justify-start">
          <IconButton onClick={(): void => settingsService.showSettings()}>
            <Adjustments />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
