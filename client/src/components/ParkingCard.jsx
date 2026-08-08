
import { useNavigate } from "react-router-dom";
import "./ParkingCard.css";

function ParkingCard({ parking, distance }) {
  const navigate = useNavigate();

  // Prevent crash if parking data is missing
  if (!parking) {
    return null;
  }

  // Safely convert slot values to numbers
  const totalSlots = Number(parking.totalSlots) || 0;
  const occupiedSlots = Number(parking.occupiedSlots) || 0;

  const availableSlots = Math.max(
    0,
    totalSlots - occupiedSlots
  );

  const isAvailable = availableSlots > 0;

  return (
    <div className="parking-card">

      {/* ===============================
          HEADER
      ================================ */}

      <div className="card-header">

        <h3>
          {parking.name || "Parking Location"}
        </h3>

        <span
          className={`status ${
            isAvailable ? "available" : "full"
          }`}
        >
          {isAvailable ? "Available" : "Full"}
        </span>

      </div>


      {/* ===============================
          ADDRESS
      ================================ */}

      <p>
        📍 {parking.address || "Address unavailable"}
      </p>


      {/* ===============================
          FEATURES
      ================================ */}

      <div className="chips">

        <span className="chip">
           {parking.vehicleType || "Car/Bike"}
        </span>

        <span className="chip">
          📍{" "}
          {distance !== null &&
          distance !== undefined
            ? `${distance} km`
            : "--"}
        </span>

        <span className="chip">
          ₹{Number(parking.pricePerHour) || 0}/hr
        </span>

      </div>


      {/* ===============================
          SLOT INFORMATION
      ================================ */}

      <div className="slots">

        <div>
          <strong>{totalSlots}</strong>
          <p>Total</p>
        </div>

        <div>
          <strong>{availableSlots}</strong>
          <p>Available</p>
        </div>

        <div>
          <strong>{occupiedSlots}</strong>
          <p>Occupied</p>
        </div>

      </div>


      {/* ===============================
          BOOK BUTTON
      ================================ */}

      <button
        className="book-btn"
        disabled={!isAvailable}
        onClick={() => {
          if (isAvailable) {
            navigate(`/booking/${parking._id}`);
          }
        }}
      >
        {isAvailable ? "Book Now →" : "Parking Full"}
      </button>

    </div>
  );
}

export default ParkingCard;
