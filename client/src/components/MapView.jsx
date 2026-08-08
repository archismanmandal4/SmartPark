
import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import axios from "axios";
import { getDistance } from "geolib";

import "leaflet/dist/leaflet.css";
import "./MapView.css";

// ==========================================
// API URL
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartpark-tvls.onrender.com";

// ...

const res = await axios.get(
  `${API_URL}/api/parking`
);

// ==========================================
// USER ICON
// ==========================================

const userIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/149/149071.png",

  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// ==========================================
// PARKING ICON
// ==========================================

const parkingIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/854/854878.png",

  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// ==========================================
// RECENTER MAP
// ==========================================

function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    map.flyTo(
      [location.lat, location.lng],
      15,
      {
        duration: 1.2,
      }
    );
  }, [location, map]);

  return null;
}

// ==========================================
// MAP VIEW
// ==========================================

function MapView({ onParkingSorted }) {
  const [location, setLocation] = useState(null);

  const [parkings, setParkings] = useState([]);

  const [loadingParkings, setLoadingParkings] =
    useState(true);

  const [locating, setLocating] = useState(false);

  const [parkingError, setParkingError] =
    useState("");

  // ==========================================
  // GET USER LOCATION
  // ==========================================

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        lat: 22.5726,
        lng: 88.3639,
      });

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },

      (error) => {
        console.error(
          "INITIAL LOCATION ERROR:",
          error
        );

        // Default Kolkata location
        setLocation({
          lat: 22.5726,
          lng: 88.3639,
        });
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // ==========================================
  // FETCH PARKINGS
  // ==========================================

  useEffect(() => {
    const fetchParking = async () => {
      try {
        setLoadingParkings(true);
        setParkingError("");

        console.log(
          "FETCHING PARKINGS FROM:",
          `${API_URL}/api/parking`
        );

        const response = await axios.get(
          `${API_URL}/api/parking`
        );

        console.log(
          "PARKING API RESPONSE:",
          response.data
        );

        const parkingData = Array.isArray(
          response.data
        )
          ? response.data
          : response.data?.data || [];

        // ========================================
        // VALID PARKINGS
        // ========================================

        const validParkings =
          parkingData.filter((parking) => {
            const latitude = Number(
              parking.latitude
            );

            const longitude = Number(
              parking.longitude
            );

            return (
              Number.isFinite(latitude) &&
              Number.isFinite(longitude)
            );
          });

        // ========================================
        // SORT BY DISTANCE
        // ========================================

        let sortedParkings = validParkings;

        if (location) {
          const userLat = Number(
            location.lat
          );

          const userLng = Number(
            location.lng
          );

          sortedParkings =
            validParkings
              .map((parking) => {
                const parkingLat = Number(
                  parking.latitude
                );

                const parkingLng = Number(
                  parking.longitude
                );

                const distanceMeters =
                  getDistance(
                    {
                      latitude: userLat,
                      longitude: userLng,
                    },
                    {
                      latitude: parkingLat,
                      longitude: parkingLng,
                    }
                  );

                return {
                  ...parking,
                  distance:
                    distanceMeters / 1000,
                };
              })
              .sort(
                (a, b) =>
                  a.distance - b.distance
              );
        } else {
          sortedParkings =
            validParkings.map(
              (parking) => ({
                ...parking,
                distance: null,
              })
            );
        }

        console.log(
          "SORTED PARKINGS:",
          sortedParkings
        );

        setParkings(sortedParkings);

        // Send data to ParkingMap
        if (onParkingSorted) {
          onParkingSorted(
            sortedParkings
          );
        }
      } catch (error) {
        console.error(
          "PARKING FETCH ERROR:",
          error
        );

        console.error(
          "ERROR RESPONSE:",
          error.response?.data
        );

        setParkingError(
          error.response?.data?.message ||
            "Unable to load parking locations."
        );

        setParkings([]);

        if (onParkingSorted) {
          onParkingSorted([]);
        }
      } finally {
        setLoadingParkings(false);
      }
    };

    fetchParking();
  }, [location, onParkingSorted]);

  // ==========================================
  // LOCATE ME
  // ==========================================

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser."
      );

      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log(
          "NEW LIVE LOCATION:",
          newLocation
        );

        setLocation(newLocation);

        setLocating(false);
      },

      (error) => {
        console.error(
          "LOCATION ERROR:",
          error
        );

        setLocating(false);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          alert(
            "Location permission was denied. Please allow location access."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          alert(
            "Your current location could not be determined."
          );
        } else if (
          error.code ===
          error.TIMEOUT
        ) {
          alert(
            "Location request timed out. Please try again."
          );
        } else {
          alert(
            "Unable to determine your location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ==========================================
  // MAP LOADING
  // ==========================================

  if (!location) {
    return (
      <div className="map-loading">
        <div className="map-loading-spinner">
          P
        </div>

        <h3>Loading Map...</h3>

        <p>
          Detecting your location...
        </p>
      </div>
    );
  }

  // ==========================================
  // MAP
  // ==========================================

  return (
    <div className="map-view-wrapper">

      <MapContainer
        center={[
          location.lat,
          location.lng,
        ]}
        zoom={13}
        className="smartpark-map"
      >

        {/* MAP TILES */}

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* RECENTER */}

        <RecenterMap
          location={location}
        />

        {/* USER LOCATION */}

        <Marker
          position={[
            location.lat,
            location.lng,
          ]}
          icon={userIcon}
        >
          <Popup>
            <strong>
              You are here
            </strong>

            <br />

            Your current location
          </Popup>
        </Marker>

        {/* PARKING MARKERS */}

        {parkings.map((parking) => {
          const totalSlots =
            Number(
              parking.totalSlots
            ) || 0;

          const occupiedSlots =
            Number(
              parking.occupiedSlots
            ) || 0;

          const availableSlots =
            Math.max(
              0,
              totalSlots -
                occupiedSlots
            );

          return (
            <Marker
              key={parking._id}
              position={[
                Number(
                  parking.latitude
                ),
                Number(
                  parking.longitude
                ),
              ]}
              icon={parkingIcon}
            >
              <Popup>

                <h3>
                  {parking.name ||
                    "Parking Location"}
                </h3>

                <p>
                  📍{" "}
                  {parking.address ||
                    "Address unavailable"}
                </p>

                <p>
                  Available:{" "}
                  {availableSlots}
                </p>

                <p>
                  ₹
                  {Number(
                    parking.pricePerHour
                  ) || 0}
                  /hour
                </p>

                {parking.distance !==
                  null &&
                  parking.distance !==
                    undefined && (
                    <p>
                      {
                        parking.distance.toFixed(
                          2
                        )
                      }{" "}
                      km away
                    </p>
                  )}

              </Popup>
            </Marker>
          );
        })}

      </MapContainer>

      {/* =====================================
          PARKING LOADING MESSAGE
      ====================================== */}

      {loadingParkings && (
        <div className="map-parking-loading">
          Loading nearby parking...
        </div>
      )}

      {/* =====================================
          PARKING ERROR
      ====================================== */}

      {!loadingParkings &&
        parkingError && (
          <div className="map-parking-error">
            {parkingError}
          </div>
        )}

      {/* =====================================
          LOCATE ME BUTTON
      ====================================== */}

      <button
        className={`locate-me-button ${
          locating ? "locating" : ""
        }`}
        onClick={handleLocateMe}
        disabled={locating}
        title="Find my current location"
      >

        <span className="locate-me-icon">
          {locating ? "◌" : "◎"}
        </span>

        <span>
          {locating
            ? "Locating..."
            : "Locate Me"}
        </span>

      </button>

    </div>
  );
}

export default MapView;
