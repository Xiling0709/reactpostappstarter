import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Auth from "./components/Auth/Auth";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth>
    <App />
  </Auth>
);

// like Auth. the <App> is wrapped in the Auth
// const showText = ({children}) => {
//   return <p>{children}</p>

// }

// {/* <showTextNicely text = "some message" /> */}

// <showTextNicely>
//   some message
// </showTextNicely>