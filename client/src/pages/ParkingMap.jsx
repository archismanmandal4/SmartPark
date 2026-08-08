import { useState } from "react";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import ParkingCard from "../components/ParkingCard";

import "./ParkingMap.css";

function ParkingMap() {
  const [parkings, setParkings] = useState([]);

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <div className="parking-map-page">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="parking-map-header">

          <div>

            <div className="parking-map-eyebrow">
              SMARTPARK / PARKING
            </div>

            <h1>
              Find your <span>parking space.</span>
            </h1>

            <p>
              Discover available parking locations,
              compare spaces and choose where you want
              to park.
            </p>

          </div>

          <div className="parking-live-status">

            <span className="parking-live-dot"></span>

            Live Availability

          </div>

        </div>


        {/* ==========================================
            MAP AREA
        ========================================== */}

        <div className="parking-map-layout">

          {/* ========================================
              PARKING LIST
          ======================================== */}

          <aside className="parking-sidebar">

            <div className="sidebar-header">

              <div>

                <span className="sidebar-label">
                  AVAILABLE LOCATIONS
                </span>

                <h2>
                  Parking Near You
                </h2>

              </div>

              <span className="parking-count">
                {parkings.length}
              </span>

            </div>


            <div className="parking-list">

              {parkings.length === 0 ? (

                <div className="no-parking">

                  <div className="no-parking-icon">
                    P
                  </div>

                  <h3>
                    Loading parking...
                  </h3>

                  <p>
                    Finding parking locations
                    near you.
                  </p>

                </div>

              ) : (

                parkings.map((parking) => (

                  <ParkingCard
                    key={parking._id}
                    parking={parking}
                    distance={
                      parking.distance.toFixed(2)
                    }
                  />

                ))

              )}

            </div>

          </aside>


          {/* ========================================
              MAP
          ======================================== */}

          <main className="map-container">

            <MapView
              onParkingSorted={setParkings}
            />

          </main>

        </div>

      </div>
    </>
  );
}

export default ParkingMap;