import React from "react";
import { FieldError } from "react-hook-form";

type Props = {
  id: string;
  type?: string;
  required?: boolean;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  error?: FieldError;
};

const Input = ({
  id,
  type,
  label,
  register,
  error,
}: Props): React.ReactElement<Props> => {
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-5 text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1 rounded-md shadow-sm">
        <input
          ref={register}
          name={id}
          type={type || "input"}
          aria-invalid={error ? "true" : "false"}
          className={[
            "appearance-none",
            "block",
            "w-full",
            "px-3",
            "py-2",
            "border",
            "border-gray-300",
            "rounded-md",
            "placeholder-gray-400",
            "focus:outline-none",
            "focus:shadow-outline-blue",
            "focus:border-blue-400",
            "transition duration-150",
            "ease-in-out",
            "sm:text-sm",
            "sm:leading-5",
          ]
            .concat(error ? ["shadow-outline-red", "border-red-400"] : [])
            .join(" ")}
        />
        {error && error.type === "required" && (
          <span className="text-sm text-red-400" role="alert">
            {label} is required
          </span>
        )}
      </div>
    </>
  );
};

export default Input;
