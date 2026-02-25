import React, { useState, useCallback, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Notification from "./components/Notification";
import HomePage from "./pages/HomePage";
import PaymentPage from "./pages/PaymentPage";
import InventoryPage from "./pages/InventoryPage";
import InsightsPage from "./pages/InsightsPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const [activePage, setActivePage] = useState("home");
  const [toast, setToast] = useState({ message: "", type: "info" });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const [paymentData, setPaymentData] = useState(null);

  const showNotification = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  const closeToast = () => {
    setToast({ message: "", type: toast.type });
  };

  // Check localStorage on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    if (token && name && role) {
      setIsAuthenticated(true);
      setUserName(name);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUserName(userData?.name || localStorage.getItem("name") || "");
    setUserRole(userData?.role || localStorage.getItem("role") || "");
    setActivePage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserName("");
    setUserRole("");
    setActivePage("home");
    showNotification("Logged out", "info");
  };

  const handleGoToPayment = (items, discount) => {
    setPaymentData({
      cartItems: items,
      discount,
      timestamp: new Date().toISOString(),
    });
    setActivePage("payment");
  };

  let content = null;
  if (!isAuthenticated) {
    content = (
      <LoginPage
        onLogin={handleLogin}
        onNotify={showNotification}
      />
    );
  } else {
    if (activePage === "home") {
      content = (
        <HomePage
          onNotify={showNotification}
          onGoToPayment={handleGoToPayment}
        />
      );
    } else if (activePage === "payment") {
      content = (
        <PaymentPage
          data={paymentData}
          onNotify={showNotification}
        />
      );
    } else if (activePage === "inventory") {
      content = <InventoryPage />;
    } else if (activePage === "insights") {
      content = <InsightsPage />;
    }
  }

  return (
    <div className="app-container">
      {isAuthenticated && (
        <Sidebar
          activePage={activePage}
          onChangePage={setActivePage}
          onLogout={handleLogout}
          userName={userName}
          userRole={userRole}
        />
      )}

      <main className="main-content">{content}</main>

      <Notification
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
    </div>
  );
};

export default App;
