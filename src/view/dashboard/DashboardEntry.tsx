import * as React from "react";

type Props = {
  label: string;
};

const DashboardEntry = ({ label }: Props): React.ReactElement => {
  return (
    <div className="justify-center w-full h-32 xs:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 ml-auto mr-auto p-3">
      <div className="justify-center h-full">
        <div className="justify-between leading-normal p-4 text-center">
          <p className="text-gray-900 text-3xl font-hairline">12:25</p>
          <div className="mt-0 mb-0 ml-auto mr-auto h-px bg-gray-900 bg-gradient-white-to-gray-to-white" />
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardEntry;
