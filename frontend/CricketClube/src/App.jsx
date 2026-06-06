import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import ProtectedRoute from "./homeSec/Protectedroute";

import HomePage from "./homeSec/HomePage";
import Register from "./homeSec/register";
import AdminPage from "./adminSec/AdminPage";
import CreateTeam from "./adminSec/menu/CreateTeam";
import Addplayers from "./adminSec/menu/AddPlayers";
import Control from "./adminSec/menu/Control";
import Match from "./adminSec/menu/Match";
import MatchPlayers from "./adminSec/menu/MatchPlayers";
import Analysis from "./adminSec/menu/Analysis";
import MatchAnalysis from "./adminSec/menu/MatchAnalysis";
import ResetPassword from "./homeSec/Resetpassword";
import PlayerProfile from "./adminSec/menu/PlayerProfile";

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Protected routes — all guarded by one ProtectedLayout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/CreateTeam" element={<CreateTeam />} />
          <Route path="/Addplayers" element={<Addplayers />} />
          <Route path="/Control" element={<Control />} />
          <Route path="/Match" element={<Match />} />
          <Route path="/MatchPlayers" element={<MatchPlayers />} />
          <Route path="/Analysis" element={<Analysis />} />
          <Route path="/MatchAnalysis" element={<MatchAnalysis />} />
          <Route path="/PlayerProfile/:playerId" element={<PlayerProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;