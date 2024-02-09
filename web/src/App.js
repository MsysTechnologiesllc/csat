import React, { useState, useEffect } from "react";
import "./App.scss";
import { Header } from "./components/header/header";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [displayPrjTitle, setDisplayPrjTitle] = useState("/");
  function getUrlPath(data) {
    setDisplayPrjTitle(data);
  }

  useEffect(() => {
    if (window.location.pathname === "/") {
      setDisplayPrjTitle("/");
    }
  }, [window.location.pathname]);

  return (
    <div className="App">
      <Header prjTitle={"Project"} displayPrjTitle={displayPrjTitle} />
      <AppRoutes getUrlPath={getUrlPath} />
    </div>
  );
}
export default App;
