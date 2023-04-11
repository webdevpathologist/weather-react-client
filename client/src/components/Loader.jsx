import React from "react";
import { CirclesWithBar } from "react-loader-spinner";

export default function Loader(props) {
  return (
    <CirclesWithBar
      height="100"
      width="100"
      color="#ffffff"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      outerCircleColor=""
      innerCircleColor=""
      barColor=""
      ariaLabel="circles-with-bar-loading"
    />
  );
}
