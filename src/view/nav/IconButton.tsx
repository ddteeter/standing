import * as React from "react";

type Props = {};

const IconButton: React.FunctionComponent = ({
  children,
}: React.PropsWithChildren<Props>): React.ReactElement<
  React.PropsWithChildren<Props>
> => {
  return (
    <button
      type="button"
      className={
        "text-gray-100 hover:text-blue-400 active:text-blue-700 focus:outline-none focus:text-blue-400"
      }
    >
      {children}
    </button>
  );
};

export default IconButton;
