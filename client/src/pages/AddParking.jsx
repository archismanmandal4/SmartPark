
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./AddParking.css";

function AddParking() {
  const navigate = useNavigate();

  const [parking, setParking] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    totalSlots: "",
    pricePerHour: "",
    vehicleType: "Car",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setParking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT PARKING
  // ==========================================

  const submitHandler = async (e) => {
    e.preventDefault();

    // ==========================================
    // CHECK LOGIN
    // ==========================================

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as a parking owner first.");
      navigate("/login");
      return;
    }

    // ==========================================
    // CHECK OWNER ROLE
    // ==========================================

    let user = null;

    try {
      user = JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.error("USER DATA ERROR:", error);
    }

    if (!user || user.role !== "owner") {
      alert(
        "Only parking owners can add parking locations."
      );
      navigate("/");
      return;
    }

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!parking.name.trim()) {
      alert("Please enter the parking name.");
      return;
    }

    if (!parking.address.trim()) {
      alert("Please enter the parking address.");
      return;
    }

    if (!parking.latitude) {
      alert("Please enter latitude.");
      return;
    }

    if (!parking.longitude) {
      alert("Please enter longitude.");
      return;
    }

    if (!parking.totalSlots) {
      alert("Please enter total parking slots.");
      return;
    }

    if (!parking.pricePerHour) {
      alert("Please enter price per hour.");
      return;
    }

    // ==========================================
    // CONVERT NUMBERS
    // ==========================================

    const latitude = Number(parking.latitude);
    const longitude = Number(parking.longitude);
    const totalSlots = Number(parking.totalSlots);
    const pricePerHour = Number(parking.pricePerHour);

    // ==========================================
    // NUMERIC VALIDATION
    // ==========================================

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      Number.isNaN(totalSlots) ||
      Number.isNaN(pricePerHour)
    ) {
      alert("Please enter valid numeric values.");
      return;
    }

    if (latitude < -90 || latitude > 90) {
      alert(
        "Latitude must be between -90 and 90."
      );
      return;
    }

    if (longitude < -180 || longitude > 180) {
      alert(
        "Longitude must be between -180 and 180."
      );
      return;
    }

    if (totalSlots <= 0) {
      alert(
        "Total parking slots must be greater than 0."
      );
      return;
    }

    if (pricePerHour < 0) {
      alert("Price cannot be negative.");
      return;
    }

    // ==========================================
    // API REQUEST
    // ==========================================

    try {
      setLoading(true);

      const API_URL =
        import.meta.env.VITE_API_URL ||
        "https://smartpark-tvls.onrender.com";

      console.log(
        "================================="
      );

      console.log("SMARTPARK ADD PARKING");

      console.log(
        "API URL:",
        API_URL
      );

      console.log(
        "ADDING PARKING..."
      );

      // ========================================
      // REQUEST DATA
      // ========================================

      const parkingData = {
        name: parking.name.trim(),

        address: parking.address.trim(),

        latitude: latitude,

        longitude: longitude,

        totalSlots: totalSlots,

        occupiedSlots: 0,

        pricePerHour: pricePerHour,

        vehicleType: parking.vehicleType,
      };

      console.log(
        "PARKING DATA:",
        parkingData
      );

      // ========================================
      // SEND REQUEST
      // ========================================

      const response = await axios.post(
        `${API_URL}/api/parking`,
        parkingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          timeout: 30000,
        }
      );

      console.log(
        "PARKING CREATED:",
        response.data
      );

      console.log(
        "================================="
      );

      // ==========================================
      // SUCCESS
      // ==========================================

      alert(
        "Parking location added successfully!"
      );

      // Clear form

      setParking({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        totalSlots: "",
        pricePerHour: "",
        vehicleType: "Car",
      });

      // ==========================================
      // GO TO MAP
      // ==========================================

      navigate("/map");

    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "ADD PARKING ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      console.error(
        "================================="
      );

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      if (serverMessage) {
        alert(serverMessage);
      } else if (error.response?.status === 401) {
        alert(
          "Your login session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      } else if (error.response?.status === 403) {
        alert(
          "You do not have permission to add parking."
        );
      } else if (error.response?.status === 500) {
        alert(
          "Server error while adding parking. Please check the backend logs."
        );
      } else {
        alert(
          "Failed to add parking location. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <Navbar />

      <div className="add-parking-page">

        {/* ==========================================
            BACKGROUND
        ========================================== */}

        <div className="add-parking-glow glow-left"></div>

        <div className="add-parking-glow glow-right"></div>


        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="add-parking-header">

          <div className="add-parking-eyebrow">
            SMARTPARK / OWNER
          </div>

          <h1>
            Add a <span>parking location.</span>
          </h1>

          <p>
            Register your parking facility and make
            available spaces visible to SmartPark users.
          </p>

        </div>


        {/* ==========================================
            FORM
        ========================================== */}

        <form
          className="add-parking-card"
          onSubmit={submitHandler}
        >


          {/* ========================================
              PARKING INFORMATION
          ======================================== */}

          <div className="form-section">

            <div className="form-section-heading">

              <div className="section-number">
                01
              </div>

              <div>

                <h2>
                  Parking Information
                </h2>

                <p>
                  Enter the basic details of your
                  parking facility.
                </p>

              </div>

            </div>


            <div className="form-grid">


              {/* PARKING NAME */}

              <div className="form-field full-width">

                <label>
                  Parking Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={parking.name}
                  onChange={handleChange}
                  placeholder="e.g. City Centre Parking"
                  disabled={loading}
                />

              </div>


              {/* ADDRESS */}

              <div className="form-field full-width">

                <label>
                  Address
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="address"
                  value={parking.address}
                  onChange={handleChange}
                  placeholder="Enter the complete parking address"
                  disabled={loading}
                />

              </div>


              {/* VEHICLE TYPE */}

              <div className="form-field">

                <label>
                  Vehicle Type
                </label>

                <select
                  name="vehicleType"
                  value={parking.vehicleType}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="Car">
                    Car
                  </option>

                  <option value="Bike">
                    Bike
                  </option>

                  <option value="Car & Bike">
                    Car & Bike
                  </option>

                </select>

              </div>


              {/* PRICE */}

              <div className="form-field">

                <label>
                  Price per Hour
                  <span>*</span>
                </label>

                <div className="input-with-prefix">

                  <span>₹</span>

                  <input
                    type="number"
                    name="pricePerHour"
                    value={parking.pricePerHour}
                    onChange={handleChange}
                    placeholder="100"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ========================================
              LOCATION
          ======================================== */}

          <div className="form-section">

            <div className="form-section-heading">

              <div className="section-number">
                02
              </div>

              <div>

                <h2>
                  Location Coordinates
                </h2>

                <p>
                  These coordinates are used to place
                  your parking location on the map.
                </p>

              </div>

            </div>


            <div className="coordinates-info">

              <div className="coordinate-icon">
                +
              </div>

              <div>

                <strong>
                  Map positioning
                </strong>

                <p>
                  Use accurate latitude and longitude
                  values so users can find your parking
                  facility correctly.
                </p>

              </div>

            </div>


            <div className="form-grid">


              {/* LATITUDE */}

              <div className="form-field">

                <label>
                  Latitude
                  <span>*</span>
                </label>

                <input
                  type="number"
                  name="latitude"
                  value={parking.latitude}
                  onChange={handleChange}
                  placeholder="22.5726"
                  step="any"
                  disabled={loading}
                />

                <small>
                  Example: 22.5726
                </small>

              </div>


              {/* LONGITUDE */}

              <div className="form-field">

                <label>
                  Longitude
                  <span>*</span>
                </label>

                <input
                  type="number"
                  name="longitude"
                  value={parking.longitude}
                  onChange={handleChange}
                  placeholder="88.3639"
                  step="any"
                  disabled={loading}
                />

                <small>
                  Example: 88.3639
                </small>

              </div>

            </div>

          </div>


          {/* ========================================
              CAPACITY
          ======================================== */}

          <div className="form-section">

            <div className="form-section-heading">

              <div className="section-number">
                03
              </div>

              <div>

                <h2>
                  Parking Capacity
                </h2>

                <p>
                  Define how many vehicles your facility
                  can accommodate.
                </p>

              </div>

            </div>


            <div className="capacity-box">

              <div className="capacity-icon">
                P
              </div>

              <div className="capacity-content">

                <label>
                  Total Parking Slots
                  <span>*</span>
                </label>

                <input
                  type="number"
                  name="totalSlots"
                  value={parking.totalSlots}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  min="1"
                  disabled={loading}
                />

                <p>
                  All slots will initially be marked as
                  available.
                </p>

              </div>

            </div>

          </div>


          {/* ========================================
              ACTIONS
          ======================================== */}

          <div className="form-actions">

            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/owner-dashboard")
              }
              disabled={loading}
            >
              ← Back
            </button>


            <button
              type="submit"
              className="add-parking-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>

                  Adding Location...
                </>
              ) : (
                <>
                  Add Parking Location

                  <span>
                    →
                  </span>
                </>
              )}

            </button>

          </div>

        </form>


        {/* ==========================================
            FOOTER NOTE
        ========================================== */}

        <div className="add-parking-footer">

          <span className="footer-dot"></span>

          Your parking information will be used
          to provide live availability to SmartPark users.

        </div>

      </div>
    </>
  );
}


// ==========================================
// EXPORT
// ==========================================

export default AddParking;
