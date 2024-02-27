import React from "react";
import { plLibComponents } from "../../context-provider/component-provider";
import "./error.scss";

const Error = () => {
  const { Error } = plLibComponents.components;
  return (
    <div className="error-wrapper">
      <Error
        heading={"Error 404"}
        descriptionLine1={"Oops nothing here"}
        descriptionLine2={"The content your are looking for can't be found"}
      />
    </div>
  );
};

export default Error;
