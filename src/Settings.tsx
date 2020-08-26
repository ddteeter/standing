import * as React from "react";
import NavBar, { Page } from "./view-settings/nav/NavBar";
import DeskSettingsPage from "./view-settings/pages/DeskSettingsPage";
import CredentialsService from "./credentials/CredentialsService";
import CredentialsServiceContext from "./credentials/CredentialsServiceContext";
import DefaultGeekdeskService, {
  GeekdeskService,
} from "./desk/geekdesk/GeekdeskService";

const credentialsService: CredentialsService = new CredentialsService();
const geekdeskService: GeekdeskService = new DefaultGeekdeskService();

const Settings = (): React.ReactElement => {
  const [page, setPage] = React.useState(Page.DESK);

  const renderPage = (selectedPage: Page): React.ReactElement => {
    let pageElement;

    switch (selectedPage) {
      case Page.DESK:
        pageElement = <DeskSettingsPage geekdeskService={geekdeskService} />;
        break;
      case Page.PRESENCE:
        pageElement = <></>;
        break;
      default:
        throw new Error(`Unknown page ${selectedPage}`);
    }

    return pageElement;
  };

  return (
    <CredentialsServiceContext.Provider value={credentialsService}>
      <NavBar selectPage={setPage} />
      <div>{renderPage(page)}</div>
    </CredentialsServiceContext.Provider>
  );
};

export default Settings;
