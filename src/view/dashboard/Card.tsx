import * as React from "react";

type Props = {
  label: string;
};

const Card = ({ label }: Props): React.ReactElement => {
  console.log(label);

  return (
    <div className="justify-center flex rounded-md border border-gray-400 h-full">
      <div className="justify-between leading-normal p-4 text-center">
        <p className="text-gray-900 text-3xl font-hairline">12:25</p>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  );
};

export default Card;
