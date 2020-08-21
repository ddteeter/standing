import * as React from "react";
import Input from "../../forms/Input";
import SecondaryButton from "../../forms/SecondaryButton";
import { useForm } from "react-hook-form";

type ParticleCredentials = {
  particleUsername: string;
  particlePassword: string;
};

const DeskSettingsPage = (): React.ReactElement => {
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
  });

  const onCredentialsSubmit = (data: {
    particleUsername: string;
    particlePassword: string;
  }): void => {
    console.log(data);
  };

  return (
    <div className="mx-auto w-10/12 p-4">
      <form onSubmit={handleSubmit(onCredentialsSubmit)}>
        <div>
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Particle Credentials
              </h3>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                Configure the credentials for your Particle account. They will
                be stored securely using your operating system password storage
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
            <div className="mt-4 pt-5">
              <SecondaryButton
                disabled={errors && Object.keys(errors).length > 0}
                type="submit"
                label="Try Connecting"
              />
            </div>
          </div>
        </div>
      </form>
      <form>
        <div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Position Settings
              </h3>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                Configuring the settings for your desk sitting and standing
                heights.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  First name
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="first_name"
                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Last name
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="last_name"
                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="email"
                    type="email"
                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Country / Region
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <select
                    id="country"
                    className="form-select block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="street_address"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Street address
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="street_address"
                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  City
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="city"
                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  State / Province
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="state"
                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  ZIP / Postal
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="zip"
                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-5">
          <div className="flex justify-end">
            <span className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className="py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            </span>
            <span className="ml-3 inline-flex rounded-md shadow-sm">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                Save
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeskSettingsPage;
