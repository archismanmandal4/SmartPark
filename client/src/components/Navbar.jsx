
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.log("USER DATA ERROR:", error);
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    navigate("/");
  };

  // ==========================================
  // LINK CLASS
  // ==========================================

  const linkClass = (path) =>
    location.pathname === path
      ? "navbar-link navbar-link-active"
      : "navbar-link";

  return (
    <nav className="navbar">

      {/* =====================================
          LOGO
      ===================================== */}

      <Link to="/" className="navbar-logo">
        SmartPark
      </Link>

      {/* =====================================
          NAVIGATION
      ===================================== */}

      <div className="navbar-links">

        {/* HOME */}

        <Link
          to="/"
          className={linkClass("/")}
        >
          Home
        </Link>

        {/* MAP */}

        <Link
          to="/map"
          className={linkClass("/map")}
        >
          Map
        </Link>

        {/* =================================
            LOGGED IN
        ================================= */}

        {isLoggedIn ? (
          <>

            {/* DASHBOARD */}

            <Link
              to="/dashboard"
              className={linkClass("/dashboard")}
            >
              Dashboard
            </Link>

            {/* OWNER ONLY */}

            {user?.role === "owner" && (
              <Link
                to="/add-parking"
                className={linkClass("/add-parking")}
              >
                Add Parking
              </Link>
            )}

            {/* USER NAME */}

            <span className="navbar-user">
              👋 {user?.name || "User"}
            </span>

            {/* BOOK A SLOT */}

            <button
              type="button"
              className="navbar-book"
              onClick={() => navigate("/map")}
            >
              Book a Slot
            </button>

            {/* LOGOUT */}

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              ↪ Logout
            </button>

          </>
        ) : (
          /* =================================
             LOGGED OUT
          ================================= */

          <>
            <Link
              to="/login"
              className={linkClass("/login")}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={linkClass("/register")}
            >
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;
