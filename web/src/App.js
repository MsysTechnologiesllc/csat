import React, { useContext } from "react";
import "./App.css";
import { ComponentProviderContext } from "./context-provider/component-provider";
function App() {
  const { NoData } = useContext(ComponentProviderContext);
  return (
    <div className="App">
      React app
      <NoData />
    </div>
  );
}
export default App;
