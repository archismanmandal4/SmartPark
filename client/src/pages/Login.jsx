
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: email.trim(),
          password,
        }
      );

      console.log("LOGIN RESPONSE:", res.data);

      // ======================================
      // SAVE TOKEN
      // ======================================

      if (res.data.token) {
        localStorage.setItem(
          "token",
          res.data.token
        );
      }

      // ======================================
      // SAVE USER
      // ======================================

      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
      }

      console.log(
        "TOKEN:",
        localStorage.getItem("token")
      );

      console.log(
        "USER:",
        localStorage.getItem("user")
      );

      // ======================================
      // SUCCESS
      // ======================================

      alert("Login Successful!");

      // ======================================
      // REDIRECT
      // ======================================

      if (res.data.user?.role === "owner") {
        navigate("/owner-dashboard", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }

      // IMPORTANT:
      // Do NOT use window.location.reload()
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(
        error?.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <Navbar />

      <div className="login-page">

        {/* =====================================
            ANIMATED BACKGROUND
        ===================================== */}

        <div className="login-background">

          <div className="login-glow glow-one"></div>

          <div className="login-glow glow-two"></div>

          <div className="login-glow glow-three"></div>

          <div className="login-grid"></div>

          <div className="floating-line line-one"></div>

          <div className="floating-line line-two"></div>

        </div>


        {/* =====================================
            LOGIN CONTENT
        ===================================== */}

        <div className="login-content">

          {/* BRAND */}

          <div className="login-brand">

            <div className="brand-mark">
              P
            </div>

            <div>
              <span>Smart</span>
              <strong>Park</strong>
            </div>

          </div>


          {/* LOGIN CARD */}

          <div className="login-card">

            <div className="login-card-header">

              <div className="login-label">
                SMARTPARK / ACCOUNT
              </div>

              <h1>
                Welcome back.
              </h1>

              <p>
                Sign in to continue managing
                your parking experience.
              </p>

            </div>


            {/* EMAIL */}

            <div className="login-field">

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
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

            </div>


            {/* PASSWORD */}

            <div className="login-field">

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
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="button"
              className="login-submit"
              onClick={handleLogin}
              disabled={loading}
            >

              <span>
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </span>

              {!loading && (
                <span className="login-arrow">
                  →
                </span>
              )}

            </button>


            {/* REGISTER */}

            <div className="login-register">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
              >
                Create Account
              </button>

            </div>

          </div>


          {/* SECURITY TEXT */}

          <div className="login-footer">

            <span className="security-dot"></span>

            Secure SmartPark authentication

          </div>

        </div>

      </div>
    </>
  );
}

export default Login;
