import { useMemo } from "react";
import ParkingCard from "./ParkingCard";
import "./ParkingList.css";

function ParkingList({ parkings = [], userLocation }) {

  // Sort parking locations by distance from user's location
  const sortedParkings = useMemo(() => {

    if (!Array.isArray(parkings)) {
      return [];
    }

    // If no user location is available,
    // keep the original parking order.
    if (!userLocation) {
      return parkings;
    }

    const userLat = Number(userLocation.lat);
    const userLng = Number(userLocation.lng);

    if (
      !Number.isFinite(userLat) ||
      !Number.isFinite(userLng)
    ) {
      return parkings;
    }

    // Calculate distance using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {

      const R = 6371; // Earth radius in km

      const dLat =
        ((lat2 - lat1) * Math.PI) / 180;

      const dLon =
        ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) *
          Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c =
        2 * Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      return R * c;
    };

    return parkings
      .map((parking) => {

        const lat = Number(parking.latitude);
        const lng = Number(parking.longitude);

        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng)
        ) {
          return {
            ...parking,
            distance: null,
          };
        }

        const distance = calculateDistance(
          userLat,
          userLng,
          lat,
          lng
        );

        return {
          ...parking,
          distance,
        };

      })
      .sort((a, b) => {

        // Parking locations without coordinates
        // go to the bottom.
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;

        return a.distance - b.distance;
      });

  }, [parkings, userLocation]);

  return (
    <section className="parking-list-section">

      {/* HEADER */}

      <div className="parking-list-header">

        <div>
          <span className="parking-list-label">
            AVAILABLE LOCATIONS
          </span>

          <h2>
            Parking Near You
          </h2>
        </div>

        <span className="parking-list-count">
          {sortedParkings.length}
        </span>

      </div>

      {/* LIST */}

      <div className="parking-list">

        {sortedParkings.length === 0 ? (

          <div className="parking-list-empty">

            <div className="parking-empty-icon">
              P
            </div>

            <h3>
              No parking locations
            </h3>

            <p>
              No parking spaces are currently
              available.
            </p>

          </div>

        ) : (

          sortedParkings.map((parking) => (

            <ParkingCard
              key={parking._id}
              parking={parking}
              distance={
                parking.distance !== null
                  ? parking.distance.toFixed(2)
                  : null
              }
            />

          ))

        )}

      </div>

    </section>
  );
}

export default ParkingList;