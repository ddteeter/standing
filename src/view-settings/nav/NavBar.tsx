import * as React from "react";

const NavBar = (): React.ReactElement => {
  return (
    <div className="fixed top-0 w-full bg-gray-600 p-2">
      <nav>
        <ul className="flex">
          <li className="mr-4">
            <a
              className="text-gray-100 hover:text-blue-400 active:text-blue-700 focus:outline-none focus:text-blue-400"
              href="#"
            >
              Desk
            </a>
          </li>
          <li className="mr-4">
            <a
              className="text-gray-100 hover:text-blue-400 active:text-blue-700 focus:outline-none focus:text-blue-400"
              href="#"
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
