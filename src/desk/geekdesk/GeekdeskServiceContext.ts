import React from "react";
import { GeekdeskService, Device } from "./GeekdeskService";
import { Observable } from "rxjs";
import { DeskStatus, DeskPosition } from "../status/DeskStatusService";

class NoOpGeekdeskService implements GeekdeskService {
  initializeWithOneTimePassword(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _mfaToken: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _oneTimePassword: string
  ): Promise<string> {
    return Promise.reject("No-op");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDevice(_deviceId: string): void {
    // No-op
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setHeights(_sittingHeight: number, _standingHeight: number): void {
    // No-op
  }
  getCurrentPosition(): Promise<DeskPosition> {
    return Promise.reject("No-op");
  }
  getCurrentHeight(): Promise<number> {
    return Promise.reject("No-op");
  }
  getObservable(): Observable<DeskStatus> {
    return new Observable();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialize(_username: string, _password: string): Promise<string> {
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
