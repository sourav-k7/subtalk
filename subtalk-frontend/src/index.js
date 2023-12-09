import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HuddleProvider, HuddleClient } from "@huddle01/react";

const huddleClient = new HuddleClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HuddleProvider client={huddleClient}>
    <App />
  </HuddleProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
