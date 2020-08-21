import React from "react";

type Props = {
  label: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

const SecondaryButton = ({
  label,
  type,
  disabled,
  onClick,
}: Props): React.ReactElement<Props> => {
  const buttonType = type || "button";

  return (
    <div className="flex justify-start">
      <span className="inline-flex rounded-md shadow-sm">
        <button
          onClick={(event): void => {
            if (onClick) {
              if (buttonType !== "submit") {
                event.preventDefault();
              }
            }
          }}
          // Intentionally not using disabled, since it kind of seems to break tabbing
          // disabled={disabled}
          type={buttonType}
          className={[
            "py-2",
            "px-3",
            "border",
            "border-gray-300",
            "rounded-md",
            "text-sm leading-4",
            "font-medium",
            "text-gray-700",
            "transition duration-150",
            "ease-in-out",
          ]
            .concat(
              disabled
                ? ["opacity-50 cursor-not-allowed"]
                : [
                    "hover:text-gray-500",
                    "focus:outline-none",
                    "focus:border-blue-400",
                    "focus:shadow-outline-blue",
                    "active:bg-gray-50",
                    "active:text-gray-800",
                  ]
            )
            .join(" ")}
        >
          {label}
        </button>
      </span>
    </div>
  );
};

export default SecondaryButton;
