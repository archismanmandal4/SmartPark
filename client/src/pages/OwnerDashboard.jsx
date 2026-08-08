
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDistance } from "geolib";

import Navbar from "../components/Navbar";
import "./OwnerDashboard.css";

function OwnerDashboard() {
  const navigate = useNavigate();

  // ==========================================
  // USER + TOKEN
  // ==========================================

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("USER PARSE ERROR:", error);
    user = null;
  }

  const token = localStorage.getItem("token");

  // ==========================================
  // STATES
  // ==========================================

  const [allParkings, setAllParkings] = useState([]);
  const [ownerParkings, setOwnerParkings] = useState([]);
  const [nearbyParkings, setNearbyParkings] = useState([]);

  const [location, setLocation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ==========================================
  // CHECK OWNER
  // ==========================================

    useEffect(() => {
  if (!user || !token) {
    navigate("/login", { replace: true });
    return;
  }

  if (user.role !== "owner") {
    navigate("/dashboard", { replace: true });
    return;
  }

  loadDashboard();
}, []);

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "`${import.meta.env.VITE_API_URL}/api/...`/api/parking",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      console.log("================================");
      console.log("SMARTPARK OWNER DASHBOARD");
      console.log("LOGGED USER:", user);
      console.log("ALL PARKINGS:", data);
      console.log("================================");

      setAllParkings(data);

      // ========================================
      // FIND PARKINGS BELONGING TO OWNER
      // ========================================

      const myParkings = data.filter((parking) => {
        const parkingOwner = parking.owner;

        const ownerId =
          typeof parkingOwner === "object"
            ? parkingOwner?._id
            : parkingOwner;

        return (
          ownerId &&
          user?._id &&
          ownerId.toString() === user._id.toString()
        );
      });

      console.log("OWNER PARKINGS:", myParkings);

      setOwnerParkings(myParkings);

      // ========================================
      // IF OWNER HAS NO PARKING
      // FIND NEARBY PARKINGS
      // ========================================

      if (myParkings.length === 0) {
        getLiveLocation(data);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(
        "OWNER DASHBOARD ERROR:",
        error
      );

      setLoading(false);
    }
  };

  // ==========================================
  // GET LIVE LOCATION
  // ==========================================

  const getLiveLocation = (parkings) => {
    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by your browser."
      );

      setLocationLoading(false);
      setLoading(false);

      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log(
          "OWNER LIVE LOCATION:",
          currentLocation
        );

        setLocation(currentLocation);

        findNearbyParkings(
          currentLocation,
          parkings
        );

        setLocationLoading(false);
        setLoading(false);
      },

      (error) => {
        console.error(
          "LOCATION ERROR:",
          error
        );

        let message =
          "Unable to get your current location.";

        if (error.code === 1) {
          message =
            "Location permission was denied. Please allow location access.";
        }

        if (error.code === 2) {
          message =
            "Your current location could not be determined.";
        }

        if (error.code === 3) {
          message =
            "Location request timed out. Please try again.";
        }

        setLocationError(message);

        setLocationLoading(false);
        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // ==========================================
  // GET PARKING COORDINATES
  // ==========================================

  const getCoordinates = (parking) => {
    const latitude = Number(parking.latitude);
    const longitude = Number(parking.longitude);

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      return {
        latitude,
        longitude,
      };
    }

    return null;
  };

  // ==========================================
  // FIND PARKINGS WITHIN 5 KM
  // ==========================================

  const findNearbyParkings = (
    currentLocation,
    parkings
  ) => {
    const nearby = [];

    parkings.forEach((parking) => {
      const coordinates =
        getCoordinates(parking);

      if (!coordinates) {
        return;
      }

      const distanceMeters = getDistance(
        {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
        },
        coordinates
      );

      const distanceKm =
        distanceMeters / 1000;

      if (distanceKm <= 5) {
        nearby.push({
          ...parking,
          distance: distanceKm,
        });
      }
    });

    nearby.sort(
      (a, b) =>
        a.distance - b.distance
    );

    console.log(
      "NEARBY PARKINGS:",
      nearby
    );

    setNearbyParkings(nearby);
  };

  // ==========================================
  // REFRESH LOCATION
  // ==========================================

  const refreshLocation = async () => {
    setLocationError("");
    setLocationLoading(true);

    try {
      const response = await axios.get(
        "`${import.meta.env.VITE_API_URL}/api/...`/api/parking",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setAllParkings(data);

      getLiveLocation(data);
    } catch (error) {
      console.error(
        "REFRESH ERROR:",
        error
      );

      setLocationLoading(false);
    }
  };

  // ==========================================
  // OWNER STATS
  // ==========================================

  const totalSlots =
    ownerParkings.reduce(
      (sum, parking) =>
        sum +
        Number(
          parking.totalSlots || 0
        ),
      0
    );

  const occupiedSlots =
    ownerParkings.reduce(
      (sum, parking) =>
        sum +
        Number(
          parking.occupiedSlots || 0
        ),
      0
    );

  const availableSlots = Math.max(
    0,
    totalSlots - occupiedSlots
  );

  // ==========================================
  // NEARBY STATS
  // ==========================================

  const nearbyTotalSlots =
    nearbyParkings.reduce(
      (sum, parking) =>
        sum +
        Number(
          parking.totalSlots || 0
        ),
      0
    );

  const nearbyOccupiedSlots =
    nearbyParkings.reduce(
      (sum, parking) =>
        sum +
        Number(
          parking.occupiedSlots || 0
        ),
      0
    );

  const nearbyAvailableSlots =
    Math.max(
      0,
      nearbyTotalSlots -
        nearbyOccupiedSlots
    );

  // ==========================================
  // LOGIN PROTECTION
  // ==========================================

  if (!user || !token) {
    return null;
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="owner-dashboard-page">
          <div className="owner-loading">
            <div className="owner-loading-spinner">
              P
            </div>

            <h2>
              Loading Owner Dashboard
            </h2>

            <p>
              Finding parking locations
              around you...
            </p>
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // OWNER HAS NO PARKING
  // ==========================================

  if (ownerParkings.length === 0) {
    return (
      <>
        <Navbar />

        <div className="owner-dashboard-page">

          {/* HEADER */}
          <div className="owner-header">

            <div>
              <div className="owner-eyebrow">
                SMARTPARK / OWNER
              </div>

              <h1>
                Owner{" "}
                <span>Dashboard</span>
              </h1>

              <p>
                You don't have a parking
                location yet. Here are the
                nearest parking locations
                around you.
              </p>
            </div>

            <button
              className="add-parking-btn"
              onClick={() =>
                navigate("/add-parking")
              }
            >
              <span>+</span>
              Add Your First Parking
            </button>

          </div>

          {/* LOCATION BANNER */}
          <div className="nearby-owner-banner">

            <div className="nearby-banner-icon">
              ◎
            </div>

            <div className="nearby-banner-content">

              <strong>
                Nearby Parking
              </strong>

              <p>
                Showing registered parking
                locations within 5 km of your
                live location.
              </p>

              {location && (
                <small>
                  📍 Live location detected
                </small>
              )}

            </div>

            <button
              className="refresh-location-btn"
              onClick={refreshLocation}
              disabled={locationLoading}
            >
              {locationLoading
                ? "Locating..."
                : "Refresh"}
            </button>

          </div>

          {/* LOCATION ERROR */}
          {locationError && (
            <div className="location-error">

              <strong>
                📍 Location unavailable
              </strong>

              <p>
                {locationError}
              </p>

              <button
                className="retry-location-btn"
                onClick={refreshLocation}
              >
                Try Again
              </button>

            </div>
          )}

          {/* STATS */}
          <div className="owner-stats">

            <div className="owner-stat-card">
              <span className="stat-label">
                NEARBY PARKINGS
              </span>

              <strong>
                {nearbyParkings.length}
              </strong>

              <p>
                Within 5 km
              </p>
            </div>

            <div className="owner-stat-card">
              <span className="stat-label">
                TOTAL SLOTS
              </span>

              <strong>
                {nearbyTotalSlots}
              </strong>

              <p>
                Nearby capacity
              </p>
            </div>

            <div className="owner-stat-card">
              <span className="stat-label">
                AVAILABLE
              </span>

              <strong className="available-number">
                {nearbyAvailableSlots}
              </strong>

              <p>
                Currently available
              </p>
            </div>

            <div className="owner-stat-card">
              <span className="stat-label">
                OCCUPIED
              </span>

              <strong className="occupied-number">
                {nearbyOccupiedSlots}
              </strong>

              <p>
                Currently occupied
              </p>
            </div>

          </div>

          {/* NEARBY PARKINGS */}
          <div className="owner-section">

            <div className="owner-section-header">

              <div>
                <span className="section-label">
                  YOUR AREA
                </span>

                <h2>
                  Nearby Parking
                </h2>
              </div>

              <span className="location-count">
                5 KM RADIUS
              </span>

            </div>

            {locationLoading ? (
              <div className="owner-empty">

                <div className="owner-loading-spinner">
                  P
                </div>

                <h3>
                  Finding nearby parking...
                </h3>

              </div>
            ) : nearbyParkings.length === 0 ? (
              <div className="owner-empty">

                <div className="empty-parking-icon">
                  P
                </div>

                <h3>
                  No parking found nearby
                </h3>

                <p>
                  No registered parking
                  location was found within
                  5 km of your current
                  location.
                </p>

                <button
                  className="manage-btn"
                  onClick={refreshLocation}
                >
                  Search Again
                </button>

              </div>
            ) : (
              <div className="owner-parking-grid">

                {nearbyParkings.map(
                  (parking) => {

                    const total =
                      Number(
                        parking.totalSlots || 0
                      );

                    const occupied =
                      Number(
                        parking.occupiedSlots ||
                          0
                      );

                    const available =
                      Math.max(
                        0,
                        total - occupied
                      );

                    return (
                      <div
                        key={parking._id}
                        className="owner-parking-card nearby-card"
                      >

                        <div className="parking-card-top">

                          <div className="parking-symbol">
                            P
                          </div>

                          <span className="parking-distance">
                            {parking.distance <
                            1
                              ? `${Math.round(
                                  parking.distance *
                                    1000
                                )} m away`
                              : `${parking.distance.toFixed(
                                  2
                                )} km away`}
                          </span>

                        </div>

                        <h3>
                          {parking.name ||
                            "Parking Location"}
                        </h3>

                        <p className="owner-address">
                          📍{" "}
                          {parking.address ||
                            "Address unavailable"}
                        </p>

                        <div className="slot-summary">

                          <div>
                            <span>
                              AVAILABLE
                            </span>

                            <strong>
                              {available}
                            </strong>
                          </div>

                          <div>
                            <span>
                              OCCUPIED
                            </span>

                            <strong>
                              {occupied}
                            </strong>
                          </div>

                          <div>
                            <span>
                              TOTAL
                            </span>

                            <strong>
                              {total}
                            </strong>
                          </div>

                        </div>

                        <div className="parking-price">
                          ₹
                          {parking.pricePerHour ||
                            0}

                          <span>
                            / hour
                          </span>
                        </div>

                        <button
                          className="manage-btn"
                          onClick={() =>
                            navigate(
                              `/booking/${parking._id}`
                            )
                          }
                        >
                          View Parking →
                        </button>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </div>
      </>
    );
  }

  // ==========================================
  // OWNER HAS PARKING
  // ==========================================

  return (
    <>
      <Navbar />

      <div className="owner-dashboard-page">

        {/* HEADER */}
        <div className="owner-header">

          <div>

            <div className="owner-eyebrow">
              SMARTPARK / OWNER
            </div>

            <h1>
              Owner{" "}
              <span>Dashboard</span>
            </h1>

            <p>
              Manage your parking locations
              and monitor availability.
            </p>

          </div>

          <button
            className="add-parking-btn"
            onClick={() =>
              navigate("/add-parking")
            }
          >
            <span>+</span>
            Add Parking
          </button>

        </div>

        {/* OWNER STATS */}
        <div className="owner-stats">

          <div className="owner-stat-card">

            <span className="stat-label">
              PARKING LOCATIONS
            </span>

            <strong>
              {ownerParkings.length}
            </strong>

            <p>
              Your locations
            </p>

          </div>

          <div className="owner-stat-card">

            <span className="stat-label">
              TOTAL SLOTS
            </span>

            <strong>
              {totalSlots}
            </strong>

            <p>
              Total capacity
            </p>

          </div>

          <div className="owner-stat-card">

            <span className="stat-label">
              AVAILABLE
            </span>

            <strong className="available-number">
              {availableSlots}
            </strong>

            <p>
              Currently available
            </p>

          </div>

          <div className="owner-stat-card">

            <span className="stat-label">
              OCCUPIED
            </span>

            <strong className="occupied-number">
              {occupiedSlots}
            </strong>

            <p>
              Currently occupied
            </p>

          </div>

        </div>

        {/* OWNER PARKINGS */}
        <div className="owner-section">

          <div className="owner-section-header">

            <div>

              <span className="section-label">
                YOUR LOCATIONS
              </span>

              <h2>
                Parking Spaces
              </h2>

            </div>

            <span className="location-count">
              {ownerParkings.length}
            </span>

          </div>

          <div className="owner-parking-grid">

            {ownerParkings.map(
              (parking) => {

                const total =
                  Number(
                    parking.totalSlots || 0
                  );

                const occupied =
                  Number(
                    parking.occupiedSlots ||
                      0
                  );

                const available =
                  Math.max(
                    0,
                    total - occupied
                  );

                const percentage =
                  total > 0
                    ? Math.round(
                        (available /
                          total) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={parking._id}
                    className="owner-parking-card"
                  >

                    <div className="parking-card-top">

                      <div className="parking-symbol">
                        P
                      </div>

                      <span
                        className={
                          available > 0
                            ? "parking-status available"
                            : "parking-status full"
                        }
                      >
                        {available > 0
                          ? "ACTIVE"
                          : "FULL"}
                      </span>

                    </div>

                    <h3>
                      {parking.name ||
                        "Parking Location"}
                    </h3>

                    <p className="owner-address">
                      📍{" "}
                      {parking.address ||
                        "Address unavailable"}
                    </p>

                    <div className="slot-summary">

                      <div>
                        <span>
                          AVAILABLE
                        </span>

                        <strong>
                          {available}
                        </strong>
                      </div>

                      <div>
                        <span>
                          OCCUPIED
                        </span>

                        <strong>
                          {occupied}
                        </strong>
                      </div>

                      <div>
                        <span>
                          TOTAL
                        </span>

                        <strong>
                          {total}
                        </strong>
                      </div>

                    </div>

                    <div className="availability-bar">
                      <div
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p className="availability-text">
                      {percentage}% slots
                      available
                    </p>

                    <div className="owner-card-actions">

                      <button
                        className="manage-btn"
                        onClick={() =>
                          navigate(
                            `/owner/parking/${parking._id}`
                          )
                        }
                      >
                        Manage Parking
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(
                            `/owner/parking/edit/${parking._id}`
                          )
                        }
                      >
                        Edit
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default OwnerDashboard;
