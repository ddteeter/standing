import * as React from "react";
import Input from "../../forms/Input";
import SecondaryButton from "../../forms/SecondaryButton";
import { useForm } from "react-hook-form";
import { useState } from "react";

type ParticleCredentials = {
  particleUsername: string;
  particlePassword: string;
};

type PositionSettings = {
  standingHeight: string;
  sittingHeight: string;
};

const DeskSettingsPage = (): React.ReactElement => {
  const [connected, setConnected] = useState(false);

  const {
    register: registerCredentials,
    handleSubmit: handleSubmitCredentials,
    errors: errorsCredentials,
  } = useForm<ParticleCredentials>({
    mode: "onBlur",
  });

  const {
    register: registerPosition,
    handleSubmit: handleSubmitPosition,
    errors: errorsPosition,
    setValue: setValuePosition,
  } = useForm<PositionSettings>({
    mode: "onBlur",
  });

  const onCredentialsSubmit = (data: ParticleCredentials): void => {
    console.log(data);
    // Attempt to connect
    setConnected(true);
  };

  const onSettingsSubmit = (data: {}): void => {
    console.log(data);
  };

  const readPositionInto = (field: string): void => {
    // Get value
    setValuePosition(field, "5");
  };

  return (
    <div className="mx-auto w-10/12 p-4">
      <form onSubmit={handleSubmitCredentials(onCredentialsSubmit)}>
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Particle Credentials
            </h3>
            <p className="mt-1 text-sm leading-5 text-gray-500">
              Configure the credentials for your Particle account. They will be
              stored securely using your operating system password storage
              mechanism.
            </p>
          </div>
          <div>
            <div className="mt-4">
              <Input
                register={registerCredentials({
                  required: true,
                })}
                error={errorsCredentials.particleUsername}
                label="Username"
                id="particleUsername"
                required={true}
              />
            </div>

            <div className="mt-4">
              <Input
                register={registerCredentials({
                  required: true,
                })}
                error={errorsCredentials.particlePassword}
                label="Password"
                id="particlePassword"
                required={true}
                type="password"
              />
            </div>
          </div>
          <div className="mt-4">
            <SecondaryButton
              disabled={
                errorsCredentials && Object.keys(errorsCredentials).length > 0
              }
              type="submit"
              label="Save and Connect"
            />
          </div>
        </div>
      </form>

      {connected && (
        <form onSubmit={handleSubmitPosition(onSettingsSubmit)}>
          <div className="mt-8 border-t border-gray-200 pt-8">
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
                  register={registerPosition({
                    required: true,
                  })}
                  error={errorsPosition.standingHeight}
                  label="Standing Height"
                  id="standingHeight"
                  required={true}
                />
                <div className="mt-4">
                  <SecondaryButton
                    label="Read Current Position"
                    onClick={(): void => readPositionInto("standingHeight")}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Input
                  register={registerPosition({
                    required: true,
                  })}
                  error={errorsPosition.sittingHeight}
                  label="Sitting Height"
                  id="sittingHeight"
                  required={true}
                />
                <div className="mt-4">
                  <SecondaryButton
                    label="Read Current Position"
                    onClick={(): void => readPositionInto("sittingHeight")}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-5">
              <SecondaryButton
                disabled={
                  errorsPosition && Object.keys(errorsPosition).length > 0
                }
                type="submit"
                label="Save"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default DeskSettingsPage;
