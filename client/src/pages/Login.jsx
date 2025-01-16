import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  
import axios from "../axiosConfig";  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/dashboard"; 
      }
    } catch (error) {
      console.error("Login failed:", error.response || error.message);
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



