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

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* FRONT PAGE */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >

          {/* Overview */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* Clients */}
          <Route
            path="clients"
            element={<Clients />}
          />

          <Route
            path="clients/:id"
            element={<ClientProfile />}
          />

          {/* Scheduling */}
          <Route
            path="availability"
            element={<Availability />}
          />

          <Route
            path="booking"
            element={<Booking />}
          />

          {/* Payments */}
          <Route
            path="payments"
            element={<Payments />}
          />

          <Route
            path="packages"
            element={<Packages />}
          />

          {/* Clinical */}
          <Route
            path="notes"
            element={<Notes />}
          />

          {/* Communication */}
          <Route
            path="chat"
            element={<Chat />}
          />

          {/* Analytics */}
          <Route
            path="analytics"
            element={<Analytics />}
          />

        </Route>

        {/* OLD URLS → DASHBOARD */}
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