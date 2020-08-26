import * as React from "react";
import Input from "../../forms/Input";
import SecondaryButton from "../../forms/SecondaryButton";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState, useCallback } from "react";
import CredentialsServiceContext from "../../credentials/CredentialsServiceContext";
import {
  CREDENTIALS_SERVICE,
  CREDENTIALS_ACCOUNT,
  CREDENTIALS_TOKEN,
  loadCredentials,
  GeekdeskService,
} from "../../desk/geekdesk/GeekdeskService";

type ParticleCredentials = {
  particleUsername: string;
  particlePassword: string;
  oneTimePassword: string;
};

type Props = {
  setConnected(connected: boolean): void;
  geekdeskService: GeekdeskService;
};

const GeekdeskCredentialsForm = ({
  setConnected: setParentConnected,
  geekdeskService,
}: Props): React.ReactElement<Props> => {
  const credentialsService = useContext(CredentialsServiceContext);
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const { register, handleSubmit, errors, setValue, reset } = useForm<
    ParticleCredentials
  >({
    mode: "onBlur",
  });

  const clearForm = async (): Promise<void> => {
    setConnected(false);
    await credentialsService.removeCredentials(
      CREDENTIALS_SERVICE,
      CREDENTIALS_ACCOUNT
    );
    await credentialsService.removeCredentials(
      CREDENTIALS_SERVICE,
      CREDENTIALS_TOKEN
    );
    setMfaToken(null);
    await reset();
  };

  const tryConnection = useCallback(
    async (
      username: string,
      password: string,
      existingAccessToken?: string,
      oneTimePassword?: string
    ): Promise<boolean> => {
      if (Object.keys(errors).length === 0) {
        let accessToken: string;
        if (!connected) {
          if (mfaToken) {
            if (oneTimePassword) {
              accessToken = await geekdeskService.initializeWithOneTimePassword(
                mfaToken,
                oneTimePassword
              );
              setMfaToken(null);
            }
          } else {
            try {
              accessToken = await geekdeskService.initialize(
                username,
                password,
                existingAccessToken
              );
            } catch (error) {
              if (
                typeof error === "object" &&
                Object.prototype.hasOwnProperty.call(error, "mfaToken")
              ) {
                setMfaToken(error.mfaToken);
                return false;
              } else {
                throw error;
              }
            }
          }
          if (accessToken) {
            try {
              await geekdeskService.getDevices();
              await credentialsService.saveCredentials(
                CREDENTIALS_SERVICE,
                CREDENTIALS_TOKEN,
                accessToken
              );
              setConnected(true);
              return true;
            } catch (error) {
              return false;
            }
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },
    [connected, credentialsService, errors, geekdeskService, mfaToken]
  );

  useEffect(() => {
    const checkCredentials = async (): Promise<void> => {
      const geekdeskCredentials = await loadCredentials(credentialsService);

      if (geekdeskCredentials) {
        setValue("particleUsername", geekdeskCredentials.username);
        setValue("particlePassword", geekdeskCredentials.password);

        tryConnection(
          geekdeskCredentials.username,
          geekdeskCredentials.password,
          geekdeskCredentials.token
        );
      }
    };
    checkCredentials();
    // We really only want to do this on initialization -- we manage it manually from here on out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setParentConnected(connected);
  }, [connected, setParentConnected]);

  const onCredentialsSubmit = async (
    data: ParticleCredentials
  ): Promise<void> => {
    await credentialsService.saveCredentials(
      CREDENTIALS_SERVICE,
      CREDENTIALS_ACCOUNT,
      btoa(`${data.particleUsername}:${data.particlePassword}`)
    );
    await tryConnection(
      data.particleUsername,
      data.particlePassword,
      null,
      data.oneTimePassword
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
          {mfaToken && (
            <div className="mt-4">
              <Input
                register={register({
                  required: true,
                })}
                error={errors.oneTimePassword}
                label="One Time Password"
                id="oneTimePassword"
                required={true}
              />
            </div>
          )}
        </div>
        <div className="mt-4">
          {!connected && (
            <SecondaryButton
              disabled={errors && Object.keys(errors).length > 0}
              type="submit"
              label="Save and Connect"
            />
          )}
          {connected && (
            <SecondaryButton
              type="button"
              label="Disconnect"
              onClick={() => {
                clearForm();
              }}
            />
          )}
        </div>
      </div>
    </form>
  );
};

export default GeekdeskCredentialsForm;
