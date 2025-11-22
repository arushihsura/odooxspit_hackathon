import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Landing from "./pages/Landing";
import { injectGlobalStyles } from './styles/colors';
import Stock from "./pages/Stock";
import MoveHistory from "./pages/MoveHistory";

function App() {
  injectGlobalStyles();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/history" element={<MoveHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;