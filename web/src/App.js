import React from "react";
import "./App.scss";
import { Header } from "./components/header/header";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="App">
      <Header prjTitle={"Project"} />
      <AppRoutes />
    </div>
  );
}
export default App;
