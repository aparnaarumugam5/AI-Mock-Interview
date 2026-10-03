// 
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "https://ai-mock-interview-backend-yekh.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save logged-in user details
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);

      alert("Login Successful ✅");

      navigate("/resume");

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error.message || "Login failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        <h1>🔐 Login</h1>

        <form onSubmit={login}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>

      </div>

    </div>
  );
}

export default Login;