import React from "react";
import { FieldError } from "react-hook-form";

type Props = {
  id: string;
  required?: boolean;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  error?: FieldError;
};

const Select = ({
  id,
  label,
  required,
  register,
  error,
  children,
}: React.PropsWithChildren<Props>): React.ReactElement<
  React.PropsWithChildren<Props>
> => {
  return (
    <>
      <label
        htmlFor="device"
        className="block text-sm font-medium leading-5 text-gray-700"
      >
        Device
      </label>
      <select
        name={id}
        ref={register}
        required={required}
        aria-invalid={error ? "true" : "false"}
        className={[
          "mt-1",
          "block",
          "form-select",
          "w-full",
          "py-2",
          "px-3",
          "border",
          "border-gray-300",
          "bg-white",
          "rounded-md",
          "shadow-sm",
          "focus:outline-none",
          "focus:shadow-outline-blue",
          "focus:border-blue-300",
          "transition",
          "duration-150",
          "ease-in-out",
          "sm:text-sm",
          "sm:leading-5",
        ]
          .concat(error ? ["shadow-outline-red", "border-red-400"] : [])
          .join(" ")}
      >
        {children}
      </select>
      {error && error.type === "required" && (
        <div className="text-sm text-red-400" role="alert">
          {label} is required
        </div>
      )}
    </>
  );
};

export default Select;
