import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Force Navbar to track login state
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

    window.location.reload();
  };

  // ==========================================
  // LINK STYLE
  // ==========================================

  const linkStyle = (path) => ({
    color:
      location.pathname === path
        ? "#d4a373"
        : "#ffffff",

    textDecoration: "none",

    fontWeight: "600",

    fontSize: "15px",

    whiteSpace: "nowrap",

    transition: "0.3s",
  });

  return (
    <nav
      style={{
        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        padding: "18px 50px",

        background:
          "rgba(45, 10, 15, 0.97)",

        color: "white",

        position: "sticky",

        top: 0,

        zIndex: 1000,

        boxShadow:
          "0 5px 25px rgba(0,0,0,0.3)",

        borderBottom:
          "1px solid rgba(212,163,115,0.15)",
      }}
    >

      {/* =====================================
          LOGO
      ===================================== */}

      <Link
        to="/"
        style={{
          color: "white",

          textDecoration: "none",

          fontSize: "27px",

          fontWeight: "800",

          whiteSpace: "nowrap",
        }}
      >
         SmartPark
      </Link>


      {/* =====================================
          NAVIGATION
      ===================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "26px",
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
  }}
>

        {/* HOME */}

        <Link
          to="/"
          style={linkStyle("/")}
        >
          Home
        </Link>


        {/* MAP */}

        <Link
          to="/map"
          style={linkStyle("/map")}
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
              style={linkStyle("/dashboard")}
            >
              Dashboard
            </Link>


            {/* OWNER ONLY */}

            {user?.role === "owner" && (
              <Link
                to="/add-parking"
                style={linkStyle("/add-parking")}
              >
                Add Parking
              </Link>
            )}


            {/* USER NAME */}

            <span
              style={{
                background:
                  "rgba(212,163,115,0.12)",

                border:
                  "1px solid rgba(212,163,115,0.25)",

                padding: "8px 14px",

                borderRadius: "20px",

                fontWeight: "600",

                color: "#f5d0a9",

                whiteSpace: "nowrap",
              }}
            >
              👋 {user?.name || "User"}
            </span>

<button
  onClick={() => navigate("/map")}
  style={{
    padding: "10px 18px",
    border: "1px solid rgba(255, 112, 135, 0.35)",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #a51e3d, #7f1530)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    whiteSpace: "nowrap",
    flexShrink: 0,
    boxShadow:
      "0 8px 25px rgba(112, 13, 37, 0.3)",
  }}
>
  Book a Slot
</button>
            {/* LOGOUT */}

            <button
  onClick={handleLogout}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",

    padding: "9px 18px",

    border: "1px solid rgba(255, 112, 135, 0.35)",

    borderRadius: "10px",

    background:
      "linear-gradient(135deg, #7f1530, #5d1025)",

    color: "#ffffff",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "14px",

    whiteSpace: "nowrap",

    flexShrink: 0,

    boxShadow:
      "0 6px 20px rgba(112, 13, 37, 0.25)",

    transition:
      "transform 0.25s ease, box-shadow 0.25s ease",
  }}
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
              style={linkStyle("/login")}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={linkStyle("/register")}
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