import * as React from "react";
import { useState } from "react";
import GeekdeskCredentialsForm from "../forms/GeekdeskCredentialsForm";
import GeekdeskDevicesForm from "../forms/GeekdeskDevicesForm";
import { GeekdeskService } from "../../desk/geekdesk/GeekdeskService";
import GeekdeskDeskSettingsForm, {
  PositionSettings,
} from "../forms/GeekdeskDeskSettingsForm";

type Props = {
  geekdeskService: GeekdeskService;
};

const DeskSettingsPage = ({
  geekdeskService,
}: Props): React.ReactElement<Props> => {
  const [connected, setConnected] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const onSettingsSubmit = (positionSettings: PositionSettings): void => {
    geekdeskService.setHeights(
      positionSettings.sittingHeight,
      positionSettings.standingHeight
    );
  };

  const deviceSelected = (deviceId: string): void => {
    geekdeskService.setDevice(deviceId);
    setSelectedDevice(deviceId);
  };

  return (
    <div className="mx-auto w-10/12 p-4">
      <GeekdeskCredentialsForm
        setConnected={setConnected}
        geekdeskService={geekdeskService}
      />
      {connected && (
        <GeekdeskDevicesForm
          geekdeskService={geekdeskService}
          onDeviceSelected={deviceSelected}
        />
      )}
      {connected && selectedDevice && (
        <GeekdeskDeskSettingsForm
          geekdeskService={geekdeskService}
          onSettingsSubmit={onSettingsSubmit}
          selectedDevice={selectedDevice}
        />
      )}
    </div>
  );
};

export default DeskSettingsPage;
