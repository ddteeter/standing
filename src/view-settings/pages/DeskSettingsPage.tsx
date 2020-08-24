import * as React from "react";
import { useState } from "react";
import GeekdeskCredentialsForm from "../forms/GeekdeskCredentialsForm";
import GeekdeskDevicesForm from "../forms/GeekdeskDevicesForm";
import DefaultGeekdeskService from "../../desk/geekdesk/GeekdeskService";
import GeekdeskDeskSettingsForm from "../forms/GeekdeskDeskSettingsForm";

const DeskSettingsPage = (): React.ReactElement => {
  const [connected, setConnected] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const geekdeskService = new DefaultGeekdeskService();

  const onSettingsSubmit = (data: {}): void => {
    console.log(data);
  };

  return (
    <div className="mx-auto w-10/12 p-4">
      <GeekdeskCredentialsForm
        setConnected={setConnected}
        geekdeskService={geekdeskService}
      />
      (connected &&
      <GeekdeskDevicesForm
        geekdeskService={geekdeskService}
        onDeviceSelected={(deviceId: string): void => {
          setSelectedDevice(deviceId);
        }}
      />
      )
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
