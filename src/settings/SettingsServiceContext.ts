import React from "react";
import SettingsService, { ResolvedSettings } from "./SettingsService";

class NoOpSettingsService implements SettingsService {
  showSettings(): void {
    // No-op
  }
  getActiveSettings(): Promise<ResolvedSettings> {
    return Promise.reject("No-op");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
  getSettings(_type: string): Promise<Record<string, any>> {
    return Promise.reject("No-op");
  }
  updateSettings(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _type: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _active: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    _settings: Record<string, any>
  ): Promise<void> {
    return Promise.reject("No-op");
  }
}

const SettingsServiceContext: React.Context<SettingsService> = React.createContext<
  SettingsService
>(new NoOpSettingsService());

export default SettingsServiceContext;
