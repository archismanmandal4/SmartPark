
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    navigate("/");
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "navbar-link active"
      : "navbar-link";
  };

  return (
    <nav className="smartpark-navbar">
      <div className="navbar-inner">

        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          SmartPark
        </Link>

        {/* NAVIGATION */}
        <div className="navbar-links">

          {/* HOME */}
          <Link
            to="/"
            className={getLinkClass("/")}
          >
            Home
          </Link>

          {/* MAP */}
          <Link
            to="/map"
            className={getLinkClass("/map")}
          >
            Map
          </Link>

          {/* HOW IT WORKS */}
          <a
            href="/#how-it-works"
            className="navbar-link"
          >
            How It Works
          </a>

          {/* LOGGED IN */}
          {isLoggedIn ? (
            <>
              {/* DASHBOARD */}
              <Link
                to="/dashboard"
                className={getLinkClass("/dashboard")}
              >
                Dashboard
              </Link>

              {/* OWNER */}
              {user?.role === "owner" && (
                <Link
                  to="/add-parking"
                  className={getLinkClass("/add-parking")}
                >
                  Add Parking
                </Link>
              )}

              {/* USER NAME */}
              <span className="navbar-user">
                👋 {user?.name || "User"}
              </span>

              {/* BOOK SLOT */}
              <button
                type="button"
                className="navbar-button"
                onClick={() => navigate("/map")}
              >
                Book a Slot
              </button>

              {/* LOGOUT */}
              <button
                type="button"
                className="navbar-button navbar-logout"
                onClick={handleLogout}
              >
                ↪ Logout
              </button>
            </>
          ) : (
            <>
              {/* LOGIN */}
              <Link
                to="/login"
                className={getLinkClass("/login")}
              >
                Login
              </Link>

              {/* REGISTER */}
              <Link
                to="/register"
                className={getLinkClass("/register")}
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
