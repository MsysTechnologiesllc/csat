import "./App.css";
import { Header } from "./components/header/header";
import AppRoutes from "./routes/AppRoutes";
// import ComponentProvider from "./context-provider/component-provider";

function App() {
  return (
    <div className="App">
      {/* <ComponentProvider> */}
      <Header />
      <AppRoutes />
      {/* </ComponentProvider> */}
    </div>
  );
}
export default App;
