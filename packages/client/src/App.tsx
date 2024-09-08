import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./assets/styles/index.less";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
