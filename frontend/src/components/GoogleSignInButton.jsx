import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../utils/auth";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

// Loads Google's script once and calls back when it's ready.
function loadGoogleScript(callback) {
  if (window.google && window.google.accounts) {
    callback();
    return;
  }

  const existing = document.querySelector(
    `script[src="${GOOGLE_SCRIPT_SRC}"]`
  );

  if (existing) {
    existing.addEventListener("load", callback);
    return;
  }

  const script = document.createElement("script");
  script.src = GOOGLE_SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
}

// Works for both login and registration: Google tells us the
// account either way, and the backend creates the user the
// first time it sees that email.
function GoogleSignInButton({ onAuthSuccess }) {
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      // No Client ID configured yet -- silently skip rendering
      // the button instead of breaking the page. See README /
      // GOOGLE_SETUP notes for how to get one.
      return;
    }

    async function handleCredentialResponse(response) {
      try {
        const apiResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: response.credential })
          }
        );

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
          alert(data.message || "Google sign-in failed.");
          return;
        }

        saveSession(data.token, data.user);

        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }

        navigate("/");
      } catch (error) {
        console.log("Google Sign-In Error:", error);
        alert(
          "Cannot connect to the server. Make sure the backend is running."
        );
      }
    }

    loadGoogleScript(() => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="google-signin-wrapper">
      <div className="auth-divider">
        <span>or</span>
      </div>
      <div ref={buttonRef} />
    </div>
  );
}

export default GoogleSignInButton;
