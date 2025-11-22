import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import MoveHistory from "./pages/MoveHistory";
import ReceiptsPage from "./pages/ReceiptsPage";
import ReceiptDetails from "./pages/ReceiptDetails";
import DeliveryPage from "./pages/DeliveryPage";
import DeliveryDetails from "./pages/DeliveryDetails";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/stock" element={isAuthenticated ? <Stock /> : <Navigate to="/login" />} />
        <Route path="/move-history" element={isAuthenticated ? <MoveHistory /> : <Navigate to="/login" />} />
        <Route path="/receipts" element={isAuthenticated ? <ReceiptsPage /> : <Navigate to="/login" />} />
        <Route path="/receipt/:id" element={isAuthenticated ? <ReceiptDetails /> : <Navigate to="/login" />} />
        <Route path="/deliveries" element={isAuthenticated ? <DeliveryPage /> : <Navigate to="/login" />} />
        <Route path="/delivery/:id" element={isAuthenticated ? <DeliveryDetails /> : <Navigate to="/login" />} />
        <Route path="/products" element={isAuthenticated ? <ProductsPage /> : <Navigate to="/login" />} />
        <Route path="/product/:id" element={isAuthenticated ? <ProductDetails /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
