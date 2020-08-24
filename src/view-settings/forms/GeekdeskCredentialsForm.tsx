import * as React from "react";
import Input from "../../forms/Input";
import SecondaryButton from "../../forms/SecondaryButton";
import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import CredentialsServiceContext from "../../credentials/CredentialsServiceContext";
import {
  CREDENTIALS_SERVICE,
  CREDENTIALS_ACCOUNT,
  loadCredentials,
  GeekdeskService,
} from "../../desk/geekdesk/GeekdeskService";

type ParticleCredentials = {
  particleUsername: string;
  particlePassword: string;
};

type Props = {
  setConnected(connected: boolean): void;
  geekdeskService: GeekdeskService;
};

const GeekdeskCredentialsForm = ({
  setConnected,
  geekdeskService,
}: Props): React.ReactElement<Props> => {
  const credentialsService = useContext(CredentialsServiceContext);

  const { register, handleSubmit, errors, setValue } = useForm<
    ParticleCredentials
  >({
    mode: "onBlur",
  });

  const checkConnected = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    await geekdeskService.initialize(username, password);
    await geekdeskService.getDevices();
    return true;
  };

  useEffect(() => {
    const checkCredentials = async (): Promise<void> => {
      const geekdeskCredentials = await loadCredentials(credentialsService);

      if (geekdeskCredentials) {
        setValue("particleUsername", geekdeskCredentials.username);
        setValue("particlePassword", geekdeskCredentials.password);
      }
    };
    checkCredentials();
  }, [credentialsService, setValue]);

  const onCredentialsSubmit = async (
    data: ParticleCredentials
  ): Promise<void> => {
    await credentialsService.saveCredentials(
      CREDENTIALS_SERVICE,
      CREDENTIALS_ACCOUNT,
      btoa(`${data.particleUsername}:${data.particlePassword}`)
    );
    setConnected(
      await checkConnected(data.particleUsername, data.particlePassword)
    );
  };

  return (
    <form onSubmit={handleSubmit(onCredentialsSubmit)}>
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
              register={register({
                required: true,
              })}
              error={errors.particleUsername}
              label="Username"
              id="particleUsername"
              required={true}
            />
          </div>

          <div className="mt-4">
            <Input
              register={register({
                required: true,
              })}
              error={errors.particlePassword}
              label="Password"
              id="particlePassword"
              required={true}
              type="password"
            />
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
