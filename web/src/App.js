import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import "./App.scss";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId="286646243612-d82l0mk8l1mcgnsu75n8vdbhmrop18ic.apps.googleusercontent.com">
        <AppRoutes />
      </GoogleOAuthProvider>
    </div>
  );
}
export default App;
