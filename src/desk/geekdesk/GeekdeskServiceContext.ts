import React from "react";
import { GeekdeskService, Device } from "./GeekdeskService";
import { Observable } from "rxjs";
import { DeskStatus, DeskPosition } from "../status/DeskStatusService";

class NoOpGeekdeskService implements GeekdeskService {
  getObservable(): Observable<DeskStatus> {
    return new Observable();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialize(_username: string, _password: string): Promise<void> {
    return Promise.reject("No-op");
  }
  getDevices(): Promise<Device[]> {
    return Promise.reject("No-op");
  }
  getConnectedDevice(): Promise<Device> {
    return Promise.reject("No-op");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDeskPosition(_position: DeskPosition): void {
    // No-op
  }
}

const GeekdeskServiceContext: React.Context<GeekdeskService> = React.createContext<
  GeekdeskService
>(new NoOpGeekdeskService());

export default GeekdeskServiceContext;
