import * as React from "react";
import SecondaryButton from "../../forms/SecondaryButton";
import { useForm } from "react-hook-form";
import { GeekdeskService } from "../../desk/geekdesk/GeekdeskService";
import Input from "../../forms/Input";

type Props = {
  geekdeskService: GeekdeskService;
  onSettingsSubmit(positionSettings: PositionSettings): void;
  selectedDevice: string;
};

type PositionSettings = {
  standingHeight: number;
  sittingHeight: number;
};

const GeekdeskDeskSettingsForm = ({
  onSettingsSubmit,
  geekdeskService,
}: Props): React.ReactElement<Props> => {
  const { register, handleSubmit, errors, setValue } = useForm<
    PositionSettings
  >({
    mode: "onBlur",
  });

  const onSubmit = (data: PositionSettings): void => {
    onSettingsSubmit(data);
  };

  const readPositionInto = async (field: string): Promise<void> => {
    setValue(field, await geekdeskService.getCurrentHeight());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-4">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Position Settings
          </h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            Configure the settings related to desk positions.
          </p>
        </div>
        <div>
          <div className="mt-4">
            <Input
              register={register({
                required: true,
              })}
              type="number"
              error={errors.standingHeight}
              label="Standing Height"
              id="standingHeight"
              required={true}
            />
            <div className="mt-4">
              <SecondaryButton
                label="Read Current Position"
                onClick={async (): Promise<void> =>
                  await readPositionInto("standingHeight")
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <Input
              register={register({
                required: true,
              })}
              type="number"
              error={errors.sittingHeight}
              label="Sitting Height"
              id="sittingHeight"
              required={true}
            />
            <div className="mt-4">
              <SecondaryButton
                label="Read Current Position"
                onClick={async (): Promise<void> =>
                  await readPositionInto("sittingHeight")
                }
              />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-5">
          <SecondaryButton
            disabled={errors && Object.keys(errors).length > 0}
            type="submit"
            label="Save"
          />
        </div>
      </div>
    </form>
  );
};

export default GeekdeskDeskSettingsForm;
export { PositionSettings };
