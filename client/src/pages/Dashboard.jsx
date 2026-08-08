
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // API URL
  // ==========================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  // ==========================================
  // LOAD USER + BOOKINGS
  // ==========================================

  useEffect(() => {
    const loadDashboard = async () => {
      const storedUser =
        localStorage.getItem("user");

      const token =
        localStorage.getItem("token");

      // ----------------------------------------
      // CHECK LOGIN
      // ----------------------------------------

      if (!storedUser || !token) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      try {
        const parsedUser =
          JSON.parse(storedUser);

        // --------------------------------------
        // OWNER REDIRECT
        // --------------------------------------

        if (parsedUser.role === "owner") {
          navigate("/owner-dashboard", {
            replace: true,
          });
          return;
        }

        setUser(parsedUser);

        // --------------------------------------
        // GET USER BOOKINGS
        // --------------------------------------

        const response = await axios.get(
          `${API_URL}/api/bookings/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = Array.isArray(
          response.data
        )
          ? response.data
          : response.data?.data || [];

        console.log(
          "SMARTPARK USER DASHBOARD"
        );

        console.log(
          "USER:",
          parsedUser
        );

        console.log(
          "MY BOOKINGS:",
          data
        );

        setBookings(data);
      } catch (error) {
        console.error(
          "DASHBOARD ERROR:",
          error
        );

        // --------------------------------------
        // TOKEN EXPIRED / INVALID
        // --------------------------------------

        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          localStorage.removeItem(
            "user"
          );

          localStorage.removeItem(
            "token"
          );

          navigate("/login", {
            replace: true,
          });

          return;
        }

        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, API_URL]);

  // ==========================================
  // CANCEL BOOKING
  // ==========================================

  const cancelBooking = async (
    bookingId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      // --------------------------------------
      // CANCEL BOOKING
      // --------------------------------------

      await axios.put(
        `${API_URL}/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Booking cancelled successfully."
      );

      // --------------------------------------
      // REFRESH BOOKINGS
      // --------------------------------------

      const response =
        await axios.get(
          `${API_URL}/api/bookings/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data = Array.isArray(
        response.data
      )
        ? response.data
        : response.data?.data || [];

      setBookings(data);
    } catch (error) {
      console.error(
        "CANCEL BOOKING ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to cancel booking."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="loading-page">
        <div className="dashboard-loading">

          <div className="loading-circle">
            P
          </div>

          <h2>
            Loading Dashboard...
          </h2>

          <p>
            Preparing your SmartPark
            experience.
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // USER NOT LOADED
  // ==========================================

  if (!user) {
    return null;
  }

  // ==========================================
  // BOOKING STATISTICS
  // ==========================================

  const activeBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Booked" ||
        booking.status === "Confirmed" ||
        booking.status === "Active"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Cancelled"
    ).length;

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <>
      <Navbar />

      <main className="dashboard-page">

        <div className="dashboard-container">

          {/* =====================================
              HEADER
          ===================================== */}

          <header className="dashboard-header">

            <div className="dashboard-header-content">

              <div className="eyebrow">
                SMARTPARK / USER
              </div>

              <h1>
                Welcome{" "}
                <span>
                  {user.name || "User"}
                </span>
              </h1>

              <p>
                Manage your parking
                reservations from one place.
              </p>

            </div>

            <button
              type="button"
              className="dashboard-find-parking"
              onClick={() =>
                navigate("/map")
              }
            >
              <span>
                Find Parking
              </span>

              <span>
                →
              </span>
            </button>

          </header>

          {/* =====================================
              STATISTICS
          ===================================== */}

          <section className="stats-grid">

            {/* TOTAL BOOKINGS */}

            <div className="stat-card">

              <div className="stat-top">

                <div className="stat-icon">
                  📖
                </div>

                <span className="stat-dot">
                </span>

              </div>

              <h2>
                {bookings.length}
              </h2>

              <p>
                Total Bookings
              </p>

            </div>

            {/* ACTIVE BOOKINGS */}

            <div className="stat-card">

              <div className="stat-top">

                <div className="stat-icon">
                  ✓
                </div>

                <span className="stat-dot">
                </span>

              </div>

              <h2>
                {activeBookings}
              </h2>

              <p>
                Active Bookings
              </p>

            </div>

            {/* CANCELLED BOOKINGS */}

            <div className="stat-card">

              <div className="stat-top">

                <div className="stat-icon">
                  ×
                </div>

                <span className="stat-dot">
                </span>

              </div>

              <h2>
                {cancelledBookings}
              </h2>

              <p>
                Cancelled Bookings
              </p>

            </div>

          </section>

          {/* =====================================
              BOOKINGS SECTION
          ===================================== */}

          <section>

            <div className="section-heading">

              <div>

                <div className="eyebrow">
                  RESERVATIONS
                </div>

                <h2>
                  My Bookings
                </h2>

              </div>

              <span className="booking-count">

                {bookings.length}{" "}

                booking
                {bookings.length !== 1
                  ? "s"
                  : ""}

              </span>

            </div>

            {/* =====================================
                NO BOOKINGS
            ===================================== */}

            {bookings.length === 0 ? (

              <div className="empty-bookings">

                <div className="empty-icon">
                  🅿️
                </div>

                <h3>
                  No bookings yet
                </h3>

                <p>
                  Find a parking space and
                  make your first reservation.
                </p>

                <button
                  type="button"
                  className="gradient-btn"
                  onClick={() =>
                    navigate("/map")
                  }
                >
                  Explore Parking
                </button>

              </div>

            ) : (

              /* ===================================
                 BOOKING LIST
              =================================== */

              <div className="booking-list">

                {bookings.map(
                  (booking) => {

                    const parking =
                      booking.parkingId ||
                      booking.parking ||
                      {};

                    const isCancelled =
                      booking.status ===
                      "Cancelled";

                    return (
                      <article
                        key={booking._id}
                        className={`premium-booking-card ${
                          isCancelled
                            ? "cancelled-booking"
                            : ""
                        }`}
                      >

                        {/* ============================
                            BOOKING INFORMATION
                        ============================ */}

                        <div className="booking-main">

                          <div className="parking-mini-icon">
                            P
                          </div>

                          <div className="booking-info">

                            <div className="booking-title-row">

                              <h3>
                                {parking.name ||
                                  "Parking Location"}
                              </h3>

                              <span
                                className={
                                  isCancelled
                                    ? "status cancelled"
                                    : "status active"
                                }
                              >
                                {booking.status ||
                                  "Booked"}
                              </span>

                            </div>

                            <p className="booking-address">
                              📍{" "}
                              {parking.address ||
                                "Address unavailable"}
                            </p>

                            <div className="booking-details">

                              {booking.vehicleNumber && (
                                <span>
                                  🚗{" "}
                                  {
                                    booking.vehicleNumber
                                  }
                                </span>
                              )}

                              <span>
                                💰 ₹
                                {parking.pricePerHour ||
                                  0}
                                /hr
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* ============================
                            BOOKING ACTIONS
                        ============================ */}

                        <div className="booking-actions">

                          {booking.bookingDate && (
                            <small>
                              {new Date(
                                booking.bookingDate
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </small>
                          )}

                          {!isCancelled && (
                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={() =>
                                cancelBooking(
                                  booking._id
                                )
                              }
                            >
                              Cancel Booking
                            </button>
                          )}

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </section>

        </div>

      </main>
    </>
  );
}

export default Dashboard;
