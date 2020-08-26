import * as React from "react";
import { useState, useEffect } from "react";
import GeekdeskCredentialsForm from "../forms/GeekdeskCredentialsForm";
import GeekdeskDevicesForm from "../forms/GeekdeskDevicesForm";
import {
  GeekdeskService,
  GeekdeskSettings,
  SETTINGS_TYPE,
  GeekdeskServiceInitializer,
  GeekdeskCredentials,
} from "../../desk/geekdesk/GeekdeskService";
import GeekdeskDeskSettingsForm, {
  PositionSettings,
} from "../forms/GeekdeskDeskSettingsForm";
import SettingsService from "../../settings/SettingsService";
import CredentialsService from "../../credentials/CredentialsService";

type Props = {
  settingsService: SettingsService;
  credentialsService: CredentialsService;
};

const DeskSettingsPage = ({
  settingsService,
  credentialsService,
}: Props): React.ReactElement<Props> => {
  const [connected, setConnected] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [
    initialCredentials,
    setInitialCredentials,
  ] = useState<GeekdeskCredentials | null>(null);
  const [initialHeights, setInitialHeights] = useState<{
    sittingHeight: number;
    standingHeight: number;
  } | null>(null);
  const [
    geekdeskService,
    setGeekdeskService,
  ] = useState<GeekdeskService | null>(null);

  useEffect(() => {
    const initializeGeekdeskService = async (): Promise<void> => {
      const geekdeskService: GeekdeskService = await new GeekdeskServiceInitializer().initializeGeekdeskService(
        credentialsService,
        settingsService
      );
      console.log(
        "Initialized",
        geekdeskService.getSelectedDevice(),
        geekdeskService.getCredentials(),
        geekdeskService.getHeights()
      );
      setSelectedDevice(geekdeskService.getSelectedDevice());
      setInitialCredentials(geekdeskService.getCredentials());
      setInitialHeights(geekdeskService.getHeights());
      setGeekdeskService(geekdeskService);
    };
    initializeGeekdeskService();
  }, [credentialsService, settingsService]);

  const onSettingsSubmit = async (
    positionSettings: PositionSettings
  ): Promise<boolean> => {
    geekdeskService.setHeights(
      positionSettings.sittingHeight,
      positionSettings.standingHeight
    );
    const geekdeskSettings: GeekdeskSettings = {
      deviceId: selectedDevice,
      sittingHeight: positionSettings.sittingHeight,
      standingHeight: positionSettings.standingHeight,
    };
    console.log("Updating settings", geekdeskSettings);
    await settingsService.updateSettings(SETTINGS_TYPE, true, geekdeskSettings);
    return true;
  };

  const deviceSelected = (deviceId: string): void => {
    geekdeskService.setDevice(deviceId);
    setSelectedDevice(deviceId);
  };

  return (
    <>
      {geekdeskService && (
        <div className="mx-auto w-10/12 p-4">
          <GeekdeskCredentialsForm
            initialCredentials={initialCredentials}
            setConnected={setConnected}
            geekdeskService={geekdeskService}
          />
          {connected && (
            <GeekdeskDevicesForm
              geekdeskService={geekdeskService}
              initialSelectedDevice={selectedDevice}
              onDeviceSelected={deviceSelected}
            />
          )}
          {connected && selectedDevice && (
            <GeekdeskDeskSettingsForm
              geekdeskService={geekdeskService}
              onSettingsSubmit={onSettingsSubmit}
              initialSittingHeight={
                initialHeights ? initialHeights.sittingHeight : null
              }
              initialStandingHeight={
                initialHeights ? initialHeights.standingHeight : null
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default DeskSettingsPage;
