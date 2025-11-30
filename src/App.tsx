// src/App.tsx
import "./App.css";
import { withAuthenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { FileUpload } from "./components/FileUpload";

function App() {
  // Hook nur für signOut, alles andere macht withAuthenticator
  const { signOut } = useAuthenticator();

  return (
    <main className="app">
      <div className="app-container">
        <h1>My uploads</h1>

        {/* oberer Button: Upload */}
        <FileUpload />

        {/* unterer Button: Sign out */}
        <button type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
    </main>
  );
}

// WICHTIG: dadurch bekommst du wieder den Login-Screen (Hosted UI von Cognito / Amplify UI)
export default withAuthenticator(App);
