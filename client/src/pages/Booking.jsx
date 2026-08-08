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

  // ==========================================
  // FETCH PARKING
  // ==========================================

  useEffect(() => {
    axios
      .get(`VITE_API_URL=https://smartpark-tvls.onrender.com/api/parking/${id}`)
      .then((res) => {
        setParking(res.data);
      })
      .catch((err) => {
        console.log("PARKING FETCH ERROR:", err);
      });
  }, [id]);

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
        "VITE_API_URL=https://smartpark-tvls.onrender.com/api/bookings",
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

      alert(res.data.message);

      navigate("/dashboard");
    } catch (error) {
      console.log("BOOKING ERROR:", error);

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

  if (!parking) {
    return (
      <>
        <Navbar />

        <div className="booking-loading-page">
          <div className="booking-loader"></div>

          <h2>Loading parking details</h2>

          <p>
            Please wait while we prepare your
            reservation.
          </p>
        </div>
      </>
    );
  }

  // ==========================================
  // AVAILABLE SLOTS
  // ==========================================

  const availableSlots =
    Number(parking.totalSlots || 0) -
    Number(parking.occupiedSlots || 0);

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <Navbar />

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
              <span>parking space.</span>
            </h1>

            <p>
              Secure your parking spot before you
              arrive.
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
                  {parking.name}
                </h2>

              </div>

            </div>


            {/* ADDRESS */}

            <div className="booking-address">

              <span className="address-icon">
                P
              </span>

              <span>
                {parking.address}
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
                  ₹{parking.pricePerHour}
                  <small>/hour</small>
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
                  <small> slots</small>
                </strong>

              </div>


              <div className="booking-info-box">

                <span>
                  TOTAL CAPACITY
                </span>

                <strong>
                  {parking.totalSlots}
                  <small> slots</small>
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
                  Enter the registration number of
                  your vehicle.
                </small>

              </div>


              {/* =================================
                  CONFIRM BUTTON
              ================================= */}

              <button
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
            className="back-to-map-btn"
            onClick={() => navigate("/map")}
          >
            ← Back to Parking Map
          </button>

        </div>

      </div>
    </>
  );
}

export default Booking;