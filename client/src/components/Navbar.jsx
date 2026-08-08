
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

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

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setMenuOpen(false);

    navigate("/");
    window.location.reload();
  };

  // ==============================
  // CLOSE MOBILE MENU
  // ==============================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="smartpark-navbar">

      {/* ==========================
          LOGO
      ========================== */}

      <Link
        to="/"
        className="smartpark-logo"
        onClick={closeMenu}
      >
        Smart<span>Park</span>
      </Link>

      {/* ==========================
          DESKTOP NAVIGATION
      ========================== */}

      <div className="desktop-nav">

        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          Home
        </Link>

        <Link
          to="/map"
          className={location.pathname === "/map" ? "active" : ""}
        >
          Map
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className={
                location.pathname === "/dashboard"
                  ? "active"
                  : ""
              }
            >
              Dashboard
            </Link>

            {user?.role === "owner" && (
              <Link
                to="/add-parking"
                className={
                  location.pathname === "/add-parking"
                    ? "active"
                    : ""
                }
              >
                Add Parking
              </Link>
            )}

            <span className="navbar-user">
              👋 {user?.name || "User"}
            </span>

            <button
              className="navbar-book"
              onClick={() => navigate("/map")}
            >
              Book a Slot
            </button>

            <button
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={
                location.pathname === "/login"
                  ? "active"
                  : ""
              }
            >
              Login
            </Link>

            <Link
              to="/register"
              className={
                location.pathname === "/register"
                  ? "active"
                  : ""
              }
            >
              Register
            </Link>
          </>
        )}

      </div>

      {/* ==========================
          MOBILE MENU BUTTON
      ========================== */}

      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span className={menuOpen ? "open" : ""}></span>
        <span className={menuOpen ? "open" : ""}></span>
        <span className={menuOpen ? "open" : ""}></span>
      </button>

      {/* ==========================
          MOBILE NAVIGATION
      ========================== */}

      <div
        className={`mobile-nav ${
          menuOpen ? "mobile-nav-open" : ""
        }`}
      >

        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/map" onClick={closeMenu}>
          Map
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              onClick={closeMenu}
            >
              Dashboard
            </Link>

            {user?.role === "owner" && (
              <Link
                to="/add-parking"
                onClick={closeMenu}
              >
                Add Parking
              </Link>
            )}

            <div className="mobile-user">
              👋 {user?.name || "User"}
            </div>

            <button
              className="mobile-book"
              onClick={() => {
                closeMenu();
                navigate("/map");
              }}
            >
              Book a Slot
            </button>

            <button
              className="mobile-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={closeMenu}
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
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
