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
// MAPVIEW
// ==========================================

function MapView({ onParkingSorted }) {
  const [location, setLocation] = useState(null);

  const [parkings, setParkings] = useState([]);

  const [locating, setLocating] = useState(false);

  // ==========================================
  // GET INITIAL USER LOCATION
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

      () => {
        // Default Kolkata

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
  // FETCH PARKING + SORT BY USER LOCATION
  // ==========================================

  useEffect(() => {
    if (!location) return;

    const fetchParking = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/parking"
        );

        const parkingData = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        // ======================================
        // REMOVE INVALID COORDINATES
        // ======================================

        const validParkings = parkingData.filter(
          (park) => {
            const lat = Number(park.latitude);
            const lng = Number(park.longitude);

            return (
              Number.isFinite(lat) &&
              Number.isFinite(lng)
            );
          }
        );

        // ======================================
        // CALCULATE DISTANCE FROM USER
        // ======================================

        const sortedParkings = validParkings
          .map((park) => {
            const parkingLat =
              Number(park.latitude);

            const parkingLng =
              Number(park.longitude);

            const distanceInMeters =
              getDistance(
                {
                  latitude: Number(
                    location.lat
                  ),

                  longitude: Number(
                    location.lng
                  ),
                },

                {
                  latitude: parkingLat,
                  longitude: parkingLng,
                }
              );

            return {
              ...park,

              distance:
                distanceInMeters / 1000,
            };
          })

          // ====================================
          // NEAREST FIRST
          // ====================================

          .sort(
            (a, b) =>
              a.distance - b.distance
          );

        console.log(
          "USER LOCATION:",
          location
        );

        console.log(
          "SORTED PARKINGS:",
          sortedParkings
        );

        setParkings(sortedParkings);

        // Send sorted parking list
        // to ParkingMap.jsx
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

        // This triggers the sorting
        // useEffect again.
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
            "Location permission was denied. Please allow location access and try again."
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
  // LOADING
  // ==========================================

  if (!location) {
    return (
      <div className="map-loading">
        Loading Map...
      </div>
    );
  }

  // ==========================================
  // MAP
  // ==========================================

  return (
    <div className="smartpark-map-wrapper">

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

        {/* RECENTER MAP */}

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

        {parkings.map((park) => (
          <Marker
            key={park._id}
            position={[
              Number(park.latitude),
              Number(park.longitude),
            ]}
            icon={parkingIcon}
          >
            <Popup>

              <h3>
                {park.name}
              </h3>

              <p>
                {park.address}
              </p>

              <p>
                Available:{" "}
                {Number(
                  park.totalSlots || 0
                ) -
                  Number(
                    park.occupiedSlots || 0
                  )}
              </p>

              <p>
                ₹
                {park.pricePerHour}
                /hour
              </p>

              <p>
                {park.distance.toFixed(2)}
                {" "}km away
              </p>

            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* =====================================
          LOCATE ME BUTTON
      ===================================== */}

      <button
        className={`locate-me-button ${
          locating
            ? "locating"
            : ""
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