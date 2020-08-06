import * as React from "react";
import ArrowUp from "../icons/ArrowUp";
import ArrowDown from "../icons/ArrowDown";
import IconButton from "./IconButton";
import Adjustments from "../icons/Adjustments";

const NavBar = (): React.ReactElement => {
  return (
    <div className="fixed bottom-0 w-full bg-gray-600">
      <div className="flex flex-row items-center justify-start">
        <div className="flex flex-row items-center justify-start">
          <IconButton>
            <ArrowUp />
          </IconButton>
          <IconButton>
            <ArrowDown />
          </IconButton>
        </div>
        <div className="ml-auto flex flex-row items-center justify-start">
          <IconButton>
            <Adjustments />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
