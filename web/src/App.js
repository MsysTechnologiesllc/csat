import React, { useContext } from "react";
import "./App.css";
import {  plLibComponents } from "./context-provider/component-provider";
function App() {
  const { NoData,OptionButton
 } = plLibComponents.components;
  console.log(NoData)
  return (
    <div className="App">
      React app
      <NoData />
      <OptionButton
/>
    </div>
  );
}
export default App;
