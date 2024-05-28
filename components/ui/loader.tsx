"use client";

import BeatLoader from "react-spinners/BeatLoader";

function Loader() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <BeatLoader color="#50ddb3" />
    </div>
  );
}

export default Loader;
