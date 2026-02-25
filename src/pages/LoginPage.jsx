import React, { useState } from "react";

const LoginPage = ({ onLogin, onNotify }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        onNotify && onNotify(data.error || "Login failed", "error");
        return;
      }

      // Save token and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", data.userId); 

      onNotify && onNotify("Login successful ✔", "success");
      onLogin && onLogin(data);
    } catch (err) {
      onNotify && onNotify("Server error ❌", "error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>POS Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primary-btn login-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
