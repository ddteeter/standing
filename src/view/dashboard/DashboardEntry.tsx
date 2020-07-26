import * as React from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardEntry = ({ children }: Props): React.ReactElement => {
  return (
    <div className="justify-center w-1/2 h-32 sm:w-1/3 md:w-1/4 lg:w-1/5 ml-auto mr-auto p-3">
      {children}
    </div>
  );
};

export default DashboardEntry;
