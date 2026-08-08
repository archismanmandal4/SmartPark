import { useNavigate } from "react-router-dom";
import "./ParkingCard.css";

function ParkingCard({ parking, distance }) {
  const navigate = useNavigate();

  // Prevent crash if parking data hasn't loaded yet
  if (!parking) {
    return null;
  }

  const availableSlots =
    parking.totalSlots - parking.occupiedSlots;

  return (
    <div className="parking-card">

      {/* Header */}
      <div className="card-header">

        <h3>{parking.name}</h3>

        <span
          className={`status ${
            availableSlots > 0 ? "available" : "full"
          }`}
        >
          {availableSlots > 0
            ? "Available"
            : "Full"}
        </span>

      </div>

      {/* Address */}
      <p>
        📍 {parking.address}
      </p>

      <br />

      {/* Features */}
      <div className="chips">

        <span className="chip">
           {parking.vehicleType || "Car/Bike"}
        </span>

        <span className="chip">
           {distance ? `${distance} km` : "--"}
        </span>

        <span className="chip">
           ₹{parking.pricePerHour}/hr
        </span>

      </div>

      {/* Slots */}
      <div className="slots">

        <div>
          <strong>{parking.totalSlots}</strong>
          <p>Total</p>
        </div>

        <div>
          <strong>{availableSlots}</strong>
          <p>Available</p>
        </div>

        <div>
          <strong>{parking.occupiedSlots}</strong>
          <p>Occupied</p>
        </div>

      </div>

      {/* Button */}
      <button
        className="book-btn"
        disabled={availableSlots === 0}
        onClick={() =>
          navigate(`/booking/${parking._id}`)
        }
      >
        {availableSlots > 0
          ? "Book Now "
          : "Parking Full"}
      </button>

    </div>
  );
}

export default ParkingCard;