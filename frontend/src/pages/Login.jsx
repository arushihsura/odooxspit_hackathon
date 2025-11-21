import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AuthStyles.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/auth/login", { email, password });
      setMsg(res.data.error || "Login successful");
      if (res.data.token) localStorage.setItem("token", res.data.token);
    } catch (err) {
      setMsg(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
          <div className="msg">{msg}</div>
        </form>
        <div className="auth-alt">
          Need an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
