import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import heroImage from "../assets/smartpark-hero.png";

function Home() {
const navigate = useNavigate();

const [showIntro, setShowIntro] = useState(true);

const [isLoggedIn, setIsLoggedIn] = useState(
!!localStorage.getItem("token")
);

const [stats, setStats] = useState({
totalParkings: 14,
totalSlots: 2490,
availableSlots: 1305,
totalBookings: 10,
});

// ==========================================
// INTRO SCREEN
// ==========================================

useEffect(() => {
const timer = setTimeout(() => {
setShowIntro(false);
}, 2400);


return () => clearTimeout(timer);


}, []);

// ==========================================
// LOGIN STATE
// ==========================================

useEffect(() => {
const checkLogin = () => {
setIsLoggedIn(!!localStorage.getItem("token"));
};


window.addEventListener("storage", checkLogin);
window.addEventListener("focus", checkLogin);

return () => {
  window.removeEventListener("storage", checkLogin);
  window.removeEventListener("focus", checkLogin);
};


}, []);

// ==========================================
// DASHBOARD STATS
// ==========================================

useEffect(() => {
const API_URL =
import.meta.env.VITE_API_URL ||
"https://smartpark-tvls.onrender.com";


fetch(`${API_URL}/api/dashboard`)
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch dashboard statistics");
    }

    return res.json();
  })
  .then((data) => {
    setStats({
      totalParkings: data.totalParkings ?? 14,
      totalSlots: data.totalSlots ?? 2490,
      availableSlots: data.availableSlots ?? 1305,
      totalBookings: data.totalBookings ?? 10,
    });
  })
  .catch((error) => {
    console.log("HOME STATS ERROR:", error);
  });


}, []);

// ==========================================
// BOOKING
// ==========================================

const handleBooking = () => {
if (localStorage.getItem("token")) {
navigate("/map");
} else {
navigate("/login");
}
};

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
// SCROLL TO SECTION
// ==========================================

const scrollToSection = (id) => {
document
.getElementById(id)
?.scrollIntoView({
behavior: "smooth",
});
};

return ( <div className="smartpark-page">

```
  {/* ==========================================
      INTRO SCREEN
  ========================================== */}

  <AnimatePresence>
    {showIntro && (
      <motion.div
        className="intro-screen"
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.7,
          },
        }}
      >
        <div className="intro-background-glow" />

        <motion.div
          className="intro-logo"
          initial={{
            opacity: 0,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
          }}
        >
          <span>Smart</span>
          <strong>Park</strong>
        </motion.div>

        <div className="intro-word">
          Find Nearest Parking
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.9,
          }}
        >
          SMART PARKING. SMARTER CITY.
        </motion.p>
      </motion.div>
    )}
  </AnimatePresence>

  {/* ==========================================
      MAIN WEBSITE
  ========================================== */}

  <motion.div
    className="main-site"
    initial={{ opacity: 0 }}
    animate={{
      opacity: showIntro ? 0 : 1,
    }}
    transition={{
      duration: 0.7,
    }}
  >

    {/* ==========================================
        NAVBAR
    ========================================== */}

    <header className="premium-navbar">

      {/* LOGO */}

      <div
        className="premium-logo"
        onClick={() => navigate("/")}
      >
        <span>Smart</span>
        <strong>Park</strong>
      </div>


      {/* NAVIGATION */}

      <nav className="premium-nav-links">

        <button
          className="nav-link active"
          onClick={() => navigate("/")}
        >
          Home
        </button>


        <button
          className="nav-link"
          onClick={() => navigate("/map")}
        >
          Map
        </button>


        <button
          className="nav-link"
          onClick={() =>
            scrollToSection("how-it-works")
          }
        >
          How it Works
        </button>


        <button
          className="nav-link"
          onClick={() =>
            scrollToSection("features")
          }
        >
          Features
        </button>


        <button
          className="nav-link"
          onClick={() =>
            scrollToSection("contact")
          }
        >
          Contact
        </button>


        {isLoggedIn && (
          <button
            className="nav-link"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </button>
        )}

      </nav>


      {/* NAVBAR ACTIONS */}

      <div className="navbar-actions">

        {isLoggedIn ? (
          <>

            <button
              className="nav-book-btn"
              onClick={handleBooking}
            >
              Book a Slot
            </button>


            <button
              className="nav-logout-btn"
              onClick={handleLogout}
            >
              <span>↪</span>
              Logout
            </button>

          </>
        ) : (
          <>

            <button
              className="nav-link"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>


            <button
              className="nav-book-btn"
              onClick={() =>
                navigate("/register")
              }
            >
              Register
            </button>


            <button
              className="nav-book-btn"
              onClick={handleBooking}
            >
              Book a Slot
            </button>

          </>
        )}

      </div>

    </header>


    {/* ==========================================
        HERO
    ========================================== */}

    <section className="premium-hero">

      <div className="hero-glow-one" />
      <div className="hero-glow-two" />


      <div className="hero-content">

        <div className="network-badge">

          <span className="live-dot" />

          Find Nearest Available Parking

        </div>


        <h1>

          Your Space

          <br />

          <span>
            Before You
          </span>

          <br />

          <span>
            Reach It !
          </span>

        </h1>


        <p className="hero-description">

          SmartPark connects you with available
          parking around you, shows live availability,
          compares prices and helps you reserve your
          space in advance.

        </p>


        <div className="hero-actions">

          <button
            className="hero-primary-btn"
            onClick={() => navigate("/map")}
          >
            Explore Parking

            <span>
              →
            </span>
          </button>


          <button
            className="hero-secondary-btn"
            onClick={handleBooking}
          >
            Reserve a Space
          </button>

        </div>


        <div className="hero-benefits">

          <div className="benefit">

            <div className="benefit-icon">
              ◉
            </div>

            <div>
              <strong>
                Live Availability
              </strong>

              <span>
                Real-time updates
              </span>
            </div>

          </div>


          <div className="benefit">

            <div className="benefit-icon">
              ⚡
            </div>

            <div>
              <strong>
                Instant Reservation
              </strong>

              <span>
                Book in seconds
              </span>
            </div>

          </div>


          <div className="benefit">

            <div className="benefit-icon">
              ♢
            </div>

            <div>
              <strong>
                Secure Platform
              </strong>

              <span>
                Protected account
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* HERO VISUAL */}

      <div className="hero-visual">

        <img
          src={heroImage}
          alt="SmartPark parking"
          className="hero-car-image"
        />


        <motion.div>

          <div className="parking-ring outer" />
          <div className="parking-ring middle" />
          <div className="parking-ring inner" />

          <div className="parking-pin">
            <span>
              P
            </span>
          </div>

        </motion.div>


        {/* LOCATION CARD */}

        <div className="floating-info-card card-location">

          <div className="info-icon">
            ♧
          </div>

          <div>

            <strong>
              {stats.totalParkings}
            </strong>

            <span>
              Spots Nearby
            </span>

            <small>
              Within 500m
            </small>

          </div>

        </div>


        {/* PRICE CARD */}

        <div className="floating-info-card card-price">

          <div className="info-icon">
            ₹
          </div>

          <div>

            <strong>
              ₹25
            </strong>

            <span>
              Starting From
            </span>

            <small>
              Per Hour
            </small>

          </div>

        </div>


        {/* TIME CARD */}

        <div className="floating-info-card card-time">

          <div className="info-icon">
            ◷
          </div>

          <div>

            <strong>
              2 <small>mins</small>
            </strong>

            <small>
              From You
            </small>

          </div>

        </div>

      </div>

    </section>


    {/* ==========================================
        STATS
    ========================================== */}

    <section className="stats-section">

      <StatCard
        icon="⌖"
        value={stats.totalParkings}
        label="Parking Locations"
      />

      <StatCard
        icon="▱"
        value={stats.totalSlots}
        label="Total Slots"
      />

      <StatCard
        icon="✓"
        value={stats.availableSlots}
        label="Available Slots"
      />

      <StatCard
        icon="♙"
        value={stats.totalBookings}
        label="Total Bookings"
      />

    </section>


    {/* ==========================================
        HOW IT WORKS
    ========================================== */}

    <section
      className="simple-section"
      id="how-it-works"
    >

      <div className="section-label">
        SIMPLE PROCESS
      </div>


      <h2>
        Park smarter in three steps.
      </h2>


      <p>
        Find your space, reserve it and arrive
        without wasting time searching for parking.
      </p>


      <div className="steps-grid">

        <div className="step-card">

          <span>
            01
          </span>

          <h3>
            Find
          </h3>

          <p>
            Discover available parking near
            your destination.
          </p>

        </div>


        <div className="step-card">

          <span>
            02
          </span>

          <h3>
            Reserve
          </h3>

          <p>
            Choose your preferred slot and
            reserve it instantly.
          </p>

        </div>


        <div className="step-card">

          <span>
            03
          </span>

          <h3>
            Park
          </h3>

          <p>
            Arrive, park and enjoy a completely
            stress-free experience.
          </p>

        </div>

      </div>

    </section>


    {/* ==========================================
        FEATURES
    ========================================== */}

    <section
      className="simple-section"
      id="features"
    >

      <div className="section-label">
        SMARTPARK FEATURES
      </div>


      <h2>
        Built for both{" "}
        <span>
          Drivers & Parking Owners.
        </span>
      </h2>


      <p className="features-intro">
        SmartPark makes parking easier for drivers
        while helping parking owners manage their
        parking spaces.
      </p>


      {/* ========================================
          DRIVER FEATURES
      ======================================== */}

      <div className="feature-category">

        <div className="feature-category-label">
          FOR USERS
        </div>


        <div className="feature-grid">

          <div className="premium-feature">

            <div className="feature-icon">
              ◉
            </div>

            <h3>
              Nearest Availability
            </h3>

            <p>
              Find nearby parking spaces using
              your live location.
            </p>

          </div>


          <div className="premium-feature">

            <div className="feature-icon">
              ⚡
            </div>

            <h3>
              Instant Booking
            </h3>

            <p>
              Reserve an available parking space
              before you arrive.
            </p>

          </div>


          <div className="premium-feature">

            <div className="feature-icon">
              ₹
            </div>

            <h3>
              Transparent Pricing
            </h3>

            <p>
              View hourly parking rates before
              making a reservation.
            </p>

          </div>


          <div className="premium-feature">

            <div className="feature-icon">
              ✓
            </div>

            <h3>
              Booking Management
            </h3>

            <p>
              View your reservations and manage
              active bookings from your dashboard.
            </p>

          </div>

        </div>

      </div>


      {/* ========================================
          OWNER FEATURES
      ======================================== */}

      <div className="feature-category owner-features">

        <div className="feature-category-label">
          FOR PARKING OWNERS
        </div>


        <div className="feature-grid">

          <div className="premium-feature">

            <div className="feature-icon">
              ＋
            </div>

            <h3>
              Add Parking Space
            </h3>

            <p>
              Register your parking location and
              make it available on SmartPark.
            </p>

          </div>


          <div className="premium-feature">

            <div className="feature-icon">
              ◫
            </div>

            <h3>
              Manage Parking
            </h3>

            <p>
              Manage your registered parking
              locations and capacity.
            </p>

          </div>


          <div className="premium-feature">

            <div className="feature-icon">
              ◉
            </div>

            <h3>
              Live Slot Availability
            </h3>

            <p>
              Track occupied and available slots
              for your parking space.
            </p>

          </div>


          <div className="premium-feature">

            <div className="feature-icon">
              ▣
            </div>

            <h3>
              Owner Dashboard
            </h3>

            <p>
              Monitor parking capacity and manage
              your parking operations from one place.
            </p>

          </div>

        </div>

      </div>

    </section>


    {/* ==========================================
        PRICING / LOCATION
    ========================================== */}

    <section
      className="pricing-section"
      id="pricing"
    >

      <div className="section-label">
        CHOOSE PARKINGS BASED ON USER RATINGS
      </div>


      <h2>
        Instead of roaming around looking for
        a parking, find nearest available spots
        using your live location.
      </h2>


      <p>
        No complicated plans. Find a spot and pay
        according to the parking location.
      </p>

    </section>


    {/* ==========================================
        CTA
    ========================================== */}

    <section
      className="final-cta"
      id="contact"
    >

      <div>

        <div className="section-label">
          READY WHEN YOU ARE
        </div>


        <h2>
          Your parking space is waiting.
        </h2>


        <p>
          Stop searching. Start parking smarter.
        </p>

      </div>


      <button
        className="hero-primary-btn"
        onClick={handleBooking}
      >

        Reserve a Space

        <span>
          →
        </span>

      </button>

    </section>


    {/* ==========================================
        FOOTER
    ========================================== */}

    <footer className="premium-footer">

      <div className="premium-logo">

        <span>
          Smart
        </span>

        <strong>
          Park
        </strong>

      </div>


      <p>
        Smart Parking Management System
      </p>


      <span>
        © 2026 SmartPark. All Rights Reserved.
      </span>

    </footer>

  </motion.div>

</div>


);
}

// ==========================================
// STAT CARD COMPONENT
// ==========================================

function StatCard({
icon,
value,
label,
}) {
return (
<motion.div
className="premium-stat-card"
whileHover={{
y: -6,
}}
transition={{
duration: 0.25,
}}
>


  <div className="stat-icon">
    {icon}
  </div>


  <div>

    <strong>
      {value}
    </strong>

    <span>
      {label}
    </span>

  </div>

</motion.div>


);
}

export default Home;
