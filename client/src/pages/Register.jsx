import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }
      );

      console.log("REGISTER RESPONSE:", res.data);

      alert("Registration Successful!");

      navigate("/login");

    } catch (error) {
      console.log("REGISTER ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="register-page">

      {/* =========================================
          ANIMATED BACKGROUND
      ========================================= */}

      <div className="register-background">

        <div className="register-glow register-glow-one"></div>

        <div className="register-glow register-glow-two"></div>

        <div className="register-grid"></div>

        <div className="register-orbit orbit-one"></div>

        <div className="register-orbit orbit-two"></div>

      </div>


      {/* =========================================
          REGISTER CONTAINER
      ========================================= */}

      <div className="register-container">

        {/* =====================================
            LEFT BRAND PANEL
        ===================================== */}

        <div className="register-brand-panel">

          <div className="register-brand">

            <span>Smart</span>
            <strong>Park</strong>

          </div>


          <div className="brand-line"></div>


          <h1>
            Parking made
            <span> smarter.</span>
          </h1>


          <p>
            Create your SmartPark account and discover
            smarter, faster and more convenient parking
            around you.
          </p>


          <div className="register-features">

            <div className="register-feature">

              <div className="feature-number">
                01
              </div>

              <div>
                <strong>Find Nearby Parking</strong>

                <span>
                  Discover available spaces around you.
                </span>
              </div>

            </div>


            <div className="register-feature">

              <div className="feature-number">
                02
              </div>

              <div>
                <strong>Reserve Instantly</strong>

                <span>
                  Book your preferred parking space.
                </span>
              </div>

            </div>


            <div className="register-feature">

              <div className="feature-number">
                03
              </div>

              <div>
                <strong>Park Without Stress</strong>

                <span>
                  Arrive knowing your space is ready.
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* =====================================
            REGISTER CARD
        ===================================== */}

        <div className="register-card">

          <div className="register-card-header">

            <div className="register-label">
              CREATE ACCOUNT
            </div>

            <h2>
              Join SmartPark
            </h2>

            <p>
              Create your account to get started.
            </p>

          </div>


          {/* NAME */}

          <div className="register-field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              onKeyDown={handleKeyDown}
            />

          </div>


          {/* EMAIL */}

          <div className="register-field">

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
            />

          </div>


          {/* PASSWORD */}

          <div className="register-field">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <span className="password-hint">
              Minimum 6 characters
            </span>

          </div>


          {/* ROLE */}

          <div className="register-field">

            <label>
              Account Type
            </label>

            <div className="role-options">

              <button
                type="button"
                className={
                  role === "user"
                    ? "role-option active"
                    : "role-option"
                }
                onClick={() =>
                  setRole("user")
                }
              >

                <span className="role-radio"></span>

                <div>
                  <strong>User</strong>
                  <small>
                    Find and reserve parking
                  </small>
                </div>

              </button>


              <button
                type="button"
                className={
                  role === "owner"
                    ? "role-option active"
                    : "role-option"
                }
                onClick={() =>
                  setRole("owner")
                }
              >

                <span className="role-radio"></span>

                <div>
                  <strong>Owner</strong>
                  <small>
                    Manage parking locations
                  </small>
                </div>

              </button>

            </div>

          </div>


          {/* REGISTER BUTTON */}

          <button
            className="register-button"
            onClick={handleRegister}
            disabled={loading}
          >

            <span>
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </span>

            {!loading && (
              <span className="register-arrow">
                →
              </span>
            )}

          </button>


          {/* LOGIN */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <button
              onClick={() =>
                navigate("/login")
              }
            >
              Sign in
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;