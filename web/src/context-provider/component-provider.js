import React, { createContext, useMemo } from "react";
import PropTypes from "prop-types";

export const plLibComponents = require("pl-lib");

console.log(plLibComponents.components);

export const ComponentProviderContext = createContext();

console.log(ComponentProviderContext);

function ComponentProvider(props) {
  const { children } = props;
  // plLibComponents.components is having all the components which are exported from pl-lib
  const value = useMemo(() => ({
    ...plLibComponents.components,
    libTranslationObj: plLibComponents.libTranslationObj,
  }));
  console.log(value);
  return (
    <ComponentProviderContext.Provider value={value}>
      {children}
    </ComponentProviderContext.Provider>
  );
}

ComponentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ComponentProvider;
