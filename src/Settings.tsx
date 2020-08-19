import * as React from "react";
import NavBar, { Page } from "./view-settings/nav/NavBar";
import DeskSettingsPage from "./view-settings/pages/DeskSettingsPage";

const Settings = (): React.ReactElement => {
  const [page, setPage] = React.useState(Page.DESK);

  const renderPage = (selectedPage: Page): React.ReactElement => {
    let pageElement;

    switch (selectedPage) {
      case Page.DESK:
        pageElement = <DeskSettingsPage />;
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
    <div>
      <NavBar selectPage={setPage} />
      <main>{renderPage(page)}</main>
    </div>
  );
};

export default Settings;
