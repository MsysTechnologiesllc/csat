import React from "react";
import "./App.css";
import { plLibComponents } from "./context-provider/component-provider";
function App() {
  const { NoData } = plLibComponents.components;
  return (
    <div className="App">
      React <NoData />
    </div>
  );
}
export default App;
