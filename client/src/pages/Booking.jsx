
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./Booking.css";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parking, setParking] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // ==========================================
  // API URL
  // ==========================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  // ==========================================
  // FETCH PARKING DETAILS
  // ==========================================

  useEffect(() => {
    const fetchParking = async () => {
      try {
        setFetchError("");

        console.log(
          "FETCHING PARKING:",
          `${API_URL}/api/parking/${id}`
        );

        const res = await axios.get(
          `${API_URL}/api/parking/${id}`
        );

        console.log(
          "PARKING RESPONSE:",
          res.data
        );

        const parkingData =
          res.data?.data || res.data;

        setParking(parkingData);
      } catch (error) {
        console.error(
          "PARKING FETCH ERROR:",
          error
        );

        setFetchError(
          error.response?.data?.message ||
            "Unable to load parking details."
        );
      }
    };

    if (id) {
      fetchParking();
    }
  }, [id, API_URL]);

  // ==========================================
  // BOOK PARKING
  // ==========================================

  const bookParking = async () => {
    if (!vehicleNumber.trim()) {
      alert("Enter vehicle number");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/bookings`,
        {
          parkingId: id,
          vehicleNumber: vehicleNumber.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        res.data?.message ||
          "Booking successful!"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "BOOKING ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!parking && !fetchError) {
    return (
      <div className="booking-loading-page">
        <div className="booking-loader"></div>

        <h2>
          Loading parking details
        </h2>

        <p>
          Please wait while we prepare your
          reservation.
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (fetchError) {
    return (
      <div className="booking-loading-page">
        <h2>
          Unable to load parking
        </h2>

        <p>
          {fetchError}
        </p>

        <button
          className="back-to-map-btn"
          onClick={() => navigate("/map")}
        >
          ← Back to Parking Map
        </button>
      </div>
    );
  }

  // ==========================================
  // AVAILABLE SLOTS
  // ==========================================

  const totalSlots =
    Number(parking?.totalSlots || 0);

  const occupiedSlots =
    Number(parking?.occupiedSlots || 0);

  const availableSlots = Math.max(
    totalSlots - occupiedSlots,
    0
  );

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="booking-page">

      <div className="booking-container">

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="booking-header">

          <div className="booking-eyebrow">
            SMARTPARK / RESERVATION
          </div>

          <h1>
            Reserve your{" "}
            <span>
              parking space.
            </span>
          </h1>

          <p>
            Secure your parking spot before
            you arrive.
          </p>

        </div>

        {/* ====================================
            BOOKING CARD
        ==================================== */}

        <div className="booking-form-card">

          {/* PARKING HEADER */}

          <div className="booking-parking-header">

            <div className="parking-icon">
              P
            </div>

            <div>

              <span className="parking-label">
                PARKING LOCATION
              </span>

              <h2>
                {parking?.name ||
                  "Parking Location"}
              </h2>

            </div>

          </div>

          {/* ADDRESS */}

          <div className="booking-address">

            <span className="address-icon">
              P
            </span>

            <span>
              {parking?.address ||
                "Address unavailable"}
            </span>

          </div>

          {/* =================================
              PARKING DETAILS
          ================================= */}

          <div className="booking-info-grid">

            <div className="booking-info-box">

              <span>
                HOURLY RATE
              </span>

              <strong>
                ₹{parking?.pricePerHour || 0}
                <small>
                  /hour
                </small>
              </strong>

            </div>

            <div className="booking-info-box">

              <span>
                AVAILABLE
              </span>

              <strong
                className={
                  availableSlots > 0
                    ? "slots-available"
                    : "slots-full"
                }
              >
                {availableSlots}
                <small>
                  {" "}slots
                </small>
              </strong>

            </div>

            <div className="booking-info-box">

              <span>
                TOTAL CAPACITY
              </span>

              <strong>
                {totalSlots}
                <small>
                  {" "}slots
                </small>
              </strong>

            </div>

          </div>

          {/* =================================
              FORM
          ================================= */}

          <div className="booking-divider"></div>

          <div className="booking-form">

            <div className="booking-field">

              <label>
                VEHICLE NUMBER
              </label>

              <input
                type="text"
                placeholder="e.g. WB12AB1234"
                value={vehicleNumber}
                onChange={(e) =>
                  setVehicleNumber(
                    e.target.value.toUpperCase()
                  )
                }
                disabled={loading}
              />

              <small>
                Enter the registration number
                of your vehicle.
              </small>

            </div>

            {/* =================================
                CONFIRM BUTTON
            ================================= */}

            <button
              type="button"
              className="confirm-booking-btn"
              onClick={bookParking}
              disabled={
                loading ||
                availableSlots <= 0
              }
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Processing Reservation...
                </>
              ) : availableSlots <= 0 ? (
                "Parking Full"
              ) : (
                <>
                  Confirm Reservation

                  <span className="button-arrow">
                    →
                  </span>
                </>
              )}

            </button>

            <p className="booking-security">
              Your reservation is securely linked
              to your account.
            </p>

          </div>

        </div>

        {/* ====================================
            BACK BUTTON
        ==================================== */}

        <button
          type="button"
          className="back-to-map-btn"
          onClick={() =>
            navigate("/map")
          }
        >
          ← Back to Parking Map
        </button>

      </div>

    </div>
  );
}

export default Booking;
