import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import Booking from "./pages/Booking";
import Availability from "./pages/Availability";
import Notes from "./pages/Notes";
import Chat from "./pages/Chat";
import Analytics from "./pages/Analytics";
import Packages from "./pages/Packages";
import Payments from "./pages/Payments";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* Root */}
        <Route
          path="/"
          element={
            <Navigate
              to={token ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="clients"
            element={<Clients />}
          />

          <Route
            path="clients/:id"
            element={<ClientProfile />}
          />

          <Route
            path="availability"
            element={<Availability />}
          />

          <Route
            path="booking"
            element={<Booking />}
          />

          <Route
            path="payments"
            element={<Payments />}
          />

          <Route
            path="packages"
            element={<Packages />}
          />

          <Route
            path="notes"
            element={<Notes />}
          />

          <Route
            path="chat"
            element={<Chat />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />
        </Route>

        {/* Redirect old routes */}
        <Route
          path="/clients"
          element={
            <Navigate
              to="/dashboard/clients"
              replace
            />
          }
        />

        <Route
          path="/packages"
          element={
            <Navigate
              to="/dashboard/packages"
              replace
            />
          }
        />

        <Route
          path="/booking"
          element={
            <Navigate
              to="/dashboard/booking"
              replace
            />
          }
        />

        <Route
          path="/availability"
          element={
            <Navigate
              to="/dashboard/availability"
              replace
            />
          }
        />

        <Route
          path="/notes"
          element={
            <Navigate
              to="/dashboard/notes"
              replace
            />
          }
        />

        <Route
          path="/chat"
          element={
            <Navigate
              to="/dashboard/chat"
              replace
            />
          }
        />

        <Route
          path="/analytics"
          element={
            <Navigate
              to="/dashboard/analytics"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;