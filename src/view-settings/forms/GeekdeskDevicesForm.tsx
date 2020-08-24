import * as React from "react";
import SecondaryButton from "../../forms/SecondaryButton";
import { useForm } from "react-hook-form";
import { GeekdeskService, Device } from "../../desk/geekdesk/GeekdeskService";
import { useEffect, useState } from "react";
import Select from "../../forms/Select";

type Props = {
  geekdeskService: GeekdeskService;
  onDeviceSelected(deviceId: string): void;
};

type DeviceForm = {
  id: string;
};

const GeekdeskCredentialsForm = ({
  geekdeskService,
  onDeviceSelected,
}: Props): React.ReactElement<Props> => {
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);

  const { register, handleSubmit, errors } = useForm<DeviceForm>({
    mode: "onBlur",
  });

  useEffect((): void => {
    const loadDevices = async (): Promise<void> => {
      setAvailableDevices(await geekdeskService.getDevices());
    };
    loadDevices();
  }, [geekdeskService]);

  const handleFormSubmit = (data: DeviceForm): void => {
    onDeviceSelected(data.id);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Connected Device
          </h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            Select the device to connect to for all Geekdesk operations and
            height status.
          </p>
        </div>
        <div>
          <div className="col-span-6 sm:col-span-3">
            <Select
              id="device"
              label="Device"
              required={true}
              error={errors.id}
              register={register}
            >
              {availableDevices.map((availableDevice) => {
                <option value={availableDevice.id}>
                  {availableDevice.name}
                </option>;
              })}
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <SecondaryButton
            disabled={errors && Object.keys(errors).length > 0}
            type="submit"
            label="Save and Connect"
          />
        </div>
      </div>
    </form>
  );
};

export default GeekdeskCredentialsForm;
