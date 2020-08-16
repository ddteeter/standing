import React, { useContext, useState, useEffect } from "react";
import StatusContext from "../../status/StatusContext";
import Status from "../../status/Status";
import EntryDisplayable from "./EntryDisplayable";

type Props = {
  label: string;
  transform: (status: Status) => EntryDisplayable;
};

const DEFAULT_COLOR = "text-gray-900";

const DEFAULT_VALUE: EntryDisplayable = {
  value: "-",
};

const DashboardEntry = ({ label, transform }: Props): React.ReactElement => {
  const statusContext = useContext(StatusContext);
  const [display, setDisplay] = useState(DEFAULT_VALUE);

  useEffect(() => {
    const subscription = statusContext.subscribe((status) => {
      setDisplay(transform(status));
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }, [statusContext, transform]);

  return (
    <div className="justify-center w-full h-32 xs:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 ml-auto mr-auto p-3">
      <div className="justify-center h-full">
        <div className="justify-between leading-normal p-4 text-center">
          <p
            className={
              "text-3xl font-hairline " + (display.color || DEFAULT_COLOR)
            }
          >
            {display.value}
          </p>
          <div className="mt-0 mb-0 ml-auto mr-auto h-px bg-gray-900 bg-gradient-white-to-gray-to-white" />
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardEntry;
