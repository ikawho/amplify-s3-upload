import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "amplifyAuthUserPool4BA7F805-1vRp01gYI5TJ",
      userPoolClientId: "5h8l13cfskuikqveub99l6gj5",
      loginWith: {
        email: true,
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>
);

