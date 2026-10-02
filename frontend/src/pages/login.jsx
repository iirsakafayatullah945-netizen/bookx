import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveSession } from "../utils/auth";
import GoogleSignInButton from "../components/GoogleSignInButton";

function Login({ onAuthSuccess }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleLogin(e) {

    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter email and password.");
      return;
    }

    setNeedsVerification(false);

    try {

      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Incorrect email or password.");

        if (data.needsVerification) {
          setNeedsVerification(true);
        }

        return;
      }

      // Save token + logged-in user
      saveSession(data.token, data.user);

      // Update App/Navbar state immediately
      if (onAuthSuccess) {
        onAuthSuccess(data.user);
      }

      alert("Login successful!");

      navigate("/");

    } catch (error) {

      console.log("Login Error:", error);

      alert(
        "Cannot connect to the server. Make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }
  }

  async function handleResendVerification() {
    if (!email.trim()) {
      alert("Enter your email above first.");
      return;
    }

    try {
      setResending(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() })
        }
      );

      const data = await response.json();
      alert(data.message || "Could not resend verification email.");
    } catch (error) {
      console.log("Resend Error:", error);
      alert("Cannot connect to the server.");
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="auth-page">

      <div className="auth-container">

        <h1>
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Login to your Book.X account
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          <button
            type="submit"
            className="primary-btn auth-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {needsVerification && (
            <button
              type="button"
              className="auth-btn"
              onClick={handleResendVerification}
              disabled={resending}
              style={{ marginTop: "10px" }}
            >
              {resending ? "Sending..." : "Resend Verification Email"}
            </button>
          )}

        </form>

        <GoogleSignInButton onAuthSuccess={onAuthSuccess} />

        <p className="auth-switch">

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Login;