import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./MyBookings.css";


function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  // ==========================================
  // FETCH BOOKINGS
  // ==========================================

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "VITE_API_URL=https://smartpark-tvls.onrender.com/api/bookings/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(
        Array.isArray(res.data)
          ? res.data
          : res.data.data || []
      );
    } catch (error) {
      console.error(
        "BOOKINGS ERROR:",
        error
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD BOOKINGS
  // ==========================================

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==========================================
  // CANCEL BOOKING
  // ==========================================

  const cancelBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");

      setCancelling(id);

      await axios.put(
        `VITE_API_URL=https://smartpark-tvls.onrender.com/api/bookings/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking cancelled successfully.");

      await fetchBookings();
    } catch (error) {
      console.error(
        "CANCEL BOOKING ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancelling(null);
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    if (!status) return "";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // ==========================================
  // STATUS MESSAGE
  // ==========================================

  const getStatusTitle = (status) => {
    if (status === "Booked") {
      return "Reservation Active";
    }

    if (status === "Cancelled") {
      return "Reservation Cancelled";
    }

    return "Reservation Status";
  };

  const getStatusMessage = (status) => {
    if (status === "Booked") {
      return "Your parking reservation is currently active.";
    }

    if (status === "Cancelled") {
      return "This parking reservation has been cancelled.";
    }

    return "Check your reservation details.";
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      {/* ======================================
          NAVBAR
      ====================================== */}

      <Navbar />

      {/* ======================================
          MAIN PAGE
      ====================================== */}

      <div className="my-bookings-page">

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="bookings-header">

          <div>

            <div className="bookings-eyebrow">
              SMARTPARK / BOOKINGS
            </div>

            <h1>
              My <span>Bookings</span>
            </h1>

            <p>
              Manage your parking reservations
              and keep track of your parking
              history.
            </p>

          </div>


          {/* LIVE STATUS */}

          <div className="booking-live-status">

            <span></span>

            Parking Reservations

          </div>

        </div>


        {/* ====================================
            CONTENT
        ==================================== */}

        <div className="bookings-container">

          {/* SECTION HEADER */}

          <div className="bookings-section-header">

            <div>

              <span className="section-label">
                RESERVATION HISTORY
              </span>

              <h2>
                Your Parking Spaces
              </h2>

            </div>


            {/* BOOKING COUNT */}

            <div className="booking-total">

              {bookings.length}

              <span>
                Bookings
              </span>

            </div>

          </div>


          {/* ==================================
              LOADING
          ================================== */}

          {loading && (

            <div className="booking-empty-state">

              <div className="loading-spinner"></div>

              <h3>
                Loading your bookings...
              </h3>

              <p>
                Please wait while we retrieve
                your reservations.
              </p>

            </div>

          )}


          {/* ==================================
              NO BOOKINGS
          ================================== */}

          {!loading &&
            bookings.length === 0 && (

              <div className="booking-empty-state">

                <div className="empty-icon">
                  P
                </div>

                <h3>
                  No bookings yet
                </h3>

                <p>
                  You haven't reserved a
                  parking space yet.
                </p>

              </div>

            )}


          {/* ==================================
              BOOKINGS
          ================================== */}

          {!loading &&
            bookings.length > 0 && (

              <div className="booking-grid">

                {bookings.map((booking) => {

                  const parking =
                    booking.parkingId;

                  const availableSlots =
                    parking
                      ? parking.totalSlots -
                        parking.occupiedSlots
                      : null;

                  return (

                    <div
                      key={booking._id}
                      className="premium-booking-card"
                    >

                      {/* ======================
                          CARD TOP
                      ====================== */}

                      <div className="booking-card-top">

                        <div className="booking-location-icon">
                          P
                        </div>


                        <div
                          className={`booking-status ${getStatusClass(
                            booking.status
                          )}`}
                        >

                          <span
                            className={`status-dot ${getStatusClass(
                              booking.status
                            )}`}
                          ></span>

                          {booking.status ||
                            "Unknown"}

                        </div>

                      </div>


                      {/* ======================
                          PARKING INFORMATION
                      ====================== */}

                      <div className="booking-main-info">

                        <h2>
                          {parking?.name ||
                            "Parking Location"}
                        </h2>

                        <p className="booking-address">
                          {parking?.address ||
                            "Parking address unavailable"}
                        </p>

                      </div>


                      {/* ======================
                          DETAILS
                      ====================== */}

                      <div className="booking-details">

                        {/* VEHICLE */}

                        <div className="booking-detail">

                          <span className="detail-label">
                            VEHICLE
                          </span>

                          <strong>
                            {booking.vehicleNumber ||
                              "N/A"}
                          </strong>

                        </div>


                        {/* RATE */}

                        <div className="booking-detail">

                          <span className="detail-label">
                            RATE
                          </span>

                          <strong>
                            ₹
                            {parking?.pricePerHour ||
                              0}

                            <small>
                              /hour
                            </small>
                          </strong>

                        </div>


                        {/* BOOKING ID */}

                        <div className="booking-detail">

                          <span className="detail-label">
                            BOOKING ID
                          </span>

                          <strong className="booking-id">

                            #
                            {booking._id
                              ? booking._id
                                  .slice(-6)
                                  .toUpperCase()
                              : "N/A"}

                          </strong>

                        </div>

                      </div>


                      {/* ======================
                          EXTRA INFORMATION
                      ====================== */}

                      <div className="booking-details">

                        {/* PARKING AVAILABILITY */}

                        <div className="booking-detail">

                          <span className="detail-label">
                            AVAILABLE
                          </span>

                          <strong>
                            {availableSlots !== null
                              ? availableSlots
                              : "N/A"}
                          </strong>

                        </div>


                        {/* TOTAL SLOTS */}

                        <div className="booking-detail">

                          <span className="detail-label">
                            TOTAL SLOTS
                          </span>

                          <strong>
                            {parking?.totalSlots ||
                              "N/A"}
                          </strong>

                        </div>


                        {/* BOOKING STATUS */}

                        <div className="booking-detail">

                          <span className="detail-label">
                            STATUS
                          </span>

                          <strong>
                            {booking.status ||
                              "N/A"}
                          </strong>

                        </div>

                      </div>


                      {/* ======================
                          STATUS MESSAGE
                      ====================== */}

                      <div className="booking-status-box">

                        <span className="status-line"></span>

                        <div>

                          <strong>
                            {getStatusTitle(
                              booking.status
                            )}
                          </strong>

                          <p>
                            {getStatusMessage(
                              booking.status
                            )}
                          </p>

                        </div>

                      </div>


                      {/* ======================
                          CANCEL BUTTON
                      ====================== */}

                      {booking.status === "Booked" && (

                        <button
                          className="cancel-booking-btn"
                          onClick={() =>
                            cancelBooking(
                              booking._id
                            )
                          }
                          disabled={
                            cancelling ===
                            booking._id
                          }
                        >

                          <span>
                            {cancelling ===
                            booking._id
                              ? "..."
                              : "×"}
                          </span>

                          {cancelling ===
                          booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}

                        </button>

                      )}

                    </div>

                  );
                })}

              </div>

            )}

        </div>

      </div>
    </>
  );
}

export default MyBookings;