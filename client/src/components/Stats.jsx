import { useEffect, useState } from "react";
import axios from "axios";
import "./Stats.css";

function Stats() {
  const [stats, setStats] = useState({
    totalParkings: 0,
    totalSlots: 0,
    availableSlots: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    axios
      .get("VITE_API_URL=https://smartpark-tvls.onrender.com/api/dashboard")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className="stats">

      <div className="stat-card">
        <h2>{stats.totalParkings}</h2>
        <p>Parking Locations</p>
      </div>

      <div className="stat-card">
        <h2>{stats.totalSlots}</h2>
        <p>Total Slots</p>
      </div>

      <div className="stat-card">
        <h2>{stats.availableSlots}</h2>
        <p>Available Slots</p>
      </div>

      <div className="stat-card">
        <h2>{stats.totalBookings}</h2>
        <p>Total Bookings</p>
      </div>

    </section>
  );
}

export default Stats;