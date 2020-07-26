import * as React from "react";
import DashboardEntry from "./DashboardEntry";
import Card from "./Card";

const Dashboard = (): React.ReactElement => {
  return (
    <div className="flex flex-wrap">
      <DashboardEntry>
        <Card label="Standing Time" />
      </DashboardEntry>
      <DashboardEntry>
        <Card label="Remaining for Goal" />
      </DashboardEntry>
      <DashboardEntry>
        <Card label="Sitting Time" />
      </DashboardEntry>
      <DashboardEntry>
        <Card label="Time to Sit" />
      </DashboardEntry>
      <DashboardEntry>
        <Card label="Next Sitting Period" />
      </DashboardEntry>
      <DashboardEntry>
        <Card label="TBD" />
      </DashboardEntry>
    </div>
  );
};

export default Dashboard;
