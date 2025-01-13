import React, { useState } from "react";
import axios from "../axiosConfig"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });
      setMessage("Login successful!");
      console.log(response.data);


      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/dashboard"; // Redirect to the dashboard
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("Invalid email or password.");
      } else {
        setMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Don’t have an account? <a href="/register">Register here</a>
      </p>
      <p>
        Already logged in? <a href="/dashboard">Go to Dashboard</a>
      </p>
    </div>
  );
};

export default Login;
