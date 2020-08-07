import React, { useState, useContext, useEffect } from "react";
import DashboardEntry from "./DashboardEntry";
import { Status } from "../../status/Status";
import {
  displayable as displayableDeskPosition,
  invert,
  DeskPosition,
} from "../../desk/status/DeskStatusService";
import {
  displayable as displayablePresence,
  Presence,
} from "../../presence/PresenceService";
import StatusContext from "../../status/StatusContext";
import AnalyticsContext from "../../analytics/AnalyticsContext";
import EntryDisplayable from "./EntryDisplayable";

const formatSeconds = (seconds: number): string => {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

const Dashboard = (): React.ReactElement => {
  const statusContext = useContext(StatusContext);
  const analyticsContext = useContext(AnalyticsContext);

  const [deskPosition, setDeskPosition] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalTime: 0,
    standingTime: 0,
  });

  useEffect(() => {
    const subscription = statusContext.subscribe((status) => {
      setDeskPosition(status.desk.position);
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }, [statusContext]);

  useEffect(() => {
    const subscription = analyticsContext.subscribe((analytics) => {
      setAnalytics(analytics);
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }, [analyticsContext]);

  return (
    <div className="flex flex-wrap">
      <DashboardEntry
        label="Standing Time"
        transform={(): EntryDisplayable => {
          return {
            value: formatSeconds(analytics.standingTime),
          };
        }}
      />
      <DashboardEntry
        label="Sitting Time"
        transform={(): EntryDisplayable => {
          return {
            value: formatSeconds(analytics.totalTime - analytics.standingTime),
          };
        }}
      />
      <DashboardEntry
        label="Remaining to Goal"
        transform={(): EntryDisplayable => {
          return {
            value: formatSeconds(analytics.standingTime),
          };
        }}
      />
      <DashboardEntry
        label={
          "Time to " +
          (deskPosition != null
            ? displayableDeskPosition(invert(deskPosition))
            : "...")
        }
        transform={(): EntryDisplayable => {
          return {
            value: "N/A",
          };
        }}
      />
      <DashboardEntry
        label="Desk Position"
        transform={(status: Status): EntryDisplayable => {
          return {
            value: displayableDeskPosition(status.desk.position),
            color:
              status.desk.position == DeskPosition.SITTING
                ? "text-red-600"
                : "text-green-600",
          };
        }}
      />
      <DashboardEntry
        label="Status"
        transform={(status: Status): EntryDisplayable => {
          return {
            value: displayablePresence(status.presence.presence),
            color:
              status.presence.presence == Presence.ABSENT
                ? "text-red-600"
                : "text-green-600",
          };
        }}
      />
    </div>
  );
};

export default Dashboard;
