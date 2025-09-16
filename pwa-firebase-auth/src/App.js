import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import AdminDashboard from "./components/AdminDashboard";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Usuario normal */}
        <Route
          path="/home"
          element={
            <RoleRoute requiredRole="user">
              <Home />
            </RoleRoute>
          }
        />

        <Route
          path="/carrito"
          element={
            <RoleRoute requiredRole="user">
              <Cart />
            </RoleRoute>
          }
        />

        <Route
          path="/pago/:orderId"
          element={
            <RoleRoute requiredRole="user">
              <Payment />
            </RoleRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RoleRoute requiredRole="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
