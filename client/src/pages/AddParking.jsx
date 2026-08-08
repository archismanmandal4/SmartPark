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
  // SUBMIT
  // ==========================================

  const submitHandler = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !parking.name ||
      !parking.address ||
      !parking.latitude ||
      !parking.longitude ||
      !parking.totalSlots ||
      !parking.pricePerHour
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const latitude = Number(parking.latitude);
    const longitude = Number(parking.longitude);
    const totalSlots = Number(parking.totalSlots);
    const pricePerHour = Number(parking.pricePerHour);

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
      alert("Latitude must be between -90 and 90.");
      return;
    }

    if (longitude < -180 || longitude > 180) {
      alert("Longitude must be between -180 and 180.");
      return;
    }

    if (totalSlots <= 0) {
      alert("Total slots must be greater than 0.");
      return;
    }

    if (pricePerHour < 0) {
      alert("Price cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/parking",
        {
          name: parking.name.trim(),

          address: parking.address.trim(),

          latitude: latitude,

          longitude: longitude,

          totalSlots: totalSlots,

          // Newly added parking starts with
          // all slots available.
          occupiedSlots: 0,

          pricePerHour: pricePerHour,

          vehicleType: parking.vehicleType,
        },
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      console.log("PARKING CREATED:", response.data);

      alert("Parking location added successfully!");

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

      // Go to parking map
      navigate("/map");
    } catch (error) {
      console.error("ADD PARKING ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add parking location."
      );
    } finally {
      setLoading(false);
    }
  };

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
            FORM CARD
        ========================================== */}

        <form
          className="add-parking-card"
          onSubmit={submitHandler}
        >

          {/* ========================================
              BASIC INFORMATION
          ======================================== */}

          <div className="form-section">

            <div className="form-section-heading">

              <div className="section-number">
                01
              </div>

              <div>
                <h2>Parking Information</h2>

                <p>
                  Enter the basic details of your
                  parking facility.
                </p>
              </div>

            </div>


            <div className="form-grid">

              {/* NAME */}

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
                <h2>Location Coordinates</h2>

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
                <h2>Parking Capacity</h2>

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
              onClick={() => navigate("/owner-dashboard")}
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
                  <span>→</span>
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

export default AddParking;