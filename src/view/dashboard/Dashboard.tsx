import * as React from "react";
import DashboardEntry from "./DashboardEntry";

const Dashboard = (): React.ReactElement => {
  return (
    <div className="flex flex-wrap">
      <DashboardEntry label="Standing Time" />
      <DashboardEntry label="Remaining to Goal" />
      <DashboardEntry label="Sitting Time" />
      <DashboardEntry label="Time Until Sit" />
      <DashboardEntry label="Next Sitting Period" />
    </div>
  );
};

export default Dashboard;
