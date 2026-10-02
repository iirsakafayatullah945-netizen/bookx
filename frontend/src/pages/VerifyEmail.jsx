import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification link. Please use the link from your email.");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        setStatus(ok ? "success" : "error");
        setMessage(data.message || (ok ? "Email verified!" : "Verification failed."));
      })
      .catch(() => {
        setStatus("error");
        setMessage("Cannot connect to the server. Make sure the backend is running.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="auth-page">
      <div className="auth-container">
        <h1>
          {status === "verifying" && "Verifying..."}
          {status === "success" && "Email Verified"}
          {status === "error" && "Verification Failed"}
        </h1>

        <p className="auth-subtitle">{message}</p>

        {status !== "verifying" && (
          <Link to="/login" className="primary-btn auth-btn" style={{ display: "block", textAlign: "center" }}>
            Go to Login
          </Link>
        )}
      </div>
    </main>
  );
}

export default VerifyEmail;
