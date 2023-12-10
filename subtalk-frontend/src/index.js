import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HuddleProvider, HuddleClient } from "@huddle01/react";
import { LightNodeProvider } from "@waku/react";

const huddleClient = new HuddleClient({
  projectId: 'vcJkGmxQBhIf9ghmqU6W7Lj7TIexbPrX',
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
});

const NODE_OPTIONS = { defaultBootstrap: true };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LightNodeProvider options={NODE_OPTIONS}>
    <HuddleProvider client={huddleClient}>
      <App />
    </HuddleProvider>
  </LightNodeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
