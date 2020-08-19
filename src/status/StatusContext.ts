import Status from "./Status";
import { Observable } from "rxjs";
import React from "react";

const StatusContext: React.Context<Observable<Status>> = React.createContext(
  new Observable<Status>(() => {
    // Never emits by default
  })
);

export default StatusContext;
