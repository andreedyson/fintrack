"use client";

import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="flex h-[70vh] items-center justify-center">
      <BeatLoader color="#50ddb3" loading={loading} />
    </div>
  );
}

export default Loader;
