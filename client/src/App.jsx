
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddParking from "./pages/AddParking";
import ParkingMap from "./pages/ParkingMap";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* PARKING MAP */}
        <Route
          path="/map"
          element={<ParkingMap />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* OWNER DASHBOARD */}
        <Route
          path="/owner-dashboard"
          element={<OwnerDashboard />}
        />

        {/* ADD PARKING */}
        <Route
          path="/add-parking"
          element={<AddParking />}
        />

        {/* BOOKING */}
        <Route
          path="/booking/:id"
          element={<Booking />}
        />

        {/* MY BOOKINGS */}
        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Home />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
