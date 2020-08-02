import * as React from "react";
import DashboardEntry from "./DashboardEntry";

const Dashboard = (): React.ReactElement => {
  return (
    <div className="flex flex-wrap">
      <DashboardEntry label="Standing Time" />
      <DashboardEntry label="Sitting Time" />
      <DashboardEntry label="Remaining to Goal" />
      <DashboardEntry label="Time Until Sit" />
      <DashboardEntry label="Desk Position" />
      <DashboardEntry label="Status" />
    </div>
  );
};

export default Dashboard;
