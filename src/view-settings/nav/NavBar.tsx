import * as React from "react";

enum Page {
  DESK,
  PRESENCE,
}

interface Props {
  selectPage: (page: Page) => void;
}

const NavBar = ({ selectPage }: Props): React.ReactElement<Props> => {
  return (
    <div className="fixed top-0 w-full bg-gray-600 p-2">
      <nav>
        <ul className="flex">
          <li className="mr-4">
            <a
              className="text-gray-100 hover:text-blue-400 active:text-blue-700 focus:outline-none focus:text-blue-400"
              href="#"
              onClick={(): void => selectPage(Page.DESK)}
            >
              Desk
            </a>
          </li>
          <li className="mr-4">
            <a
              className="text-gray-100 hover:text-blue-400 active:text-blue-700 focus:outline-none focus:text-blue-400"
              href="#"
              onClick={(): void => selectPage(Page.PRESENCE)}
            >
              Presence
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
export { Page };
