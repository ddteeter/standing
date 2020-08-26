import * as React from "react";
import NavBar, { Page } from "./view-settings/nav/NavBar";
import DeskSettingsPage from "./view-settings/pages/DeskSettingsPage";
import CredentialsService from "./credentials/CredentialsService";
import CredentialsServiceContext from "./credentials/CredentialsServiceContext";
import SettingsService, {
  DefaultSettingsService,
} from "./settings/SettingsService";
import RxDbPersistenceService from "./persistence/RxDbPersistenceService";
import SettingsServiceContext from "./settings/SettingsServiceContext";
import { useEffect, useState } from "react";

const credentialsService: CredentialsService = new CredentialsService();
const rxDbPersistenceService: RxDbPersistenceService = new RxDbPersistenceService();
const settingsService: SettingsService = new DefaultSettingsService(
  rxDbPersistenceService
);

const Settings = (): React.ReactElement => {
  const [page, setPage] = useState(Page.DESK);
  const [loading, setLoading] = useState(true);

  const renderPage = (selectedPage: Page): React.ReactElement => {
    let pageElement;

    switch (selectedPage) {
      case Page.DESK:
        pageElement = (
          <DeskSettingsPage
            settingsService={settingsService}
            credentialsService={credentialsService}
          />
        );
        break;
      case Page.PRESENCE:
        pageElement = <></>;
        break;
      default:
        throw new Error(`Unknown page ${selectedPage}`);
    }

    return pageElement;
  };

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      await rxDbPersistenceService.initialize();
      setLoading(false);
    };

    initialize();
  }, []);

  return (
    <SettingsServiceContext.Provider value={settingsService}>
      <CredentialsServiceContext.Provider value={credentialsService}>
        {!loading && (
          <>
            <NavBar selectPage={setPage} />
            <div>{renderPage(page)}</div>
          </>
        )}
      </CredentialsServiceContext.Provider>
    </SettingsServiceContext.Provider>
  );
};

export default Settings;
