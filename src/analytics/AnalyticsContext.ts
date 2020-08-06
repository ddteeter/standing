import { Observable } from "rxjs";
import React from "react";
import Analytics from "./Analytics";

const AnalyticsContext: React.Context<Observable<
  Analytics
>> = React.createContext(
  new Observable<Analytics>(() => {
    // Never emits by default
  })
);

export default AnalyticsContext;
