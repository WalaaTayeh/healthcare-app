


import React, { useState } from "react";
import axios from "../axiosConfig"; // Import Axios instance

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/register", { email, password });
      setMessage("Registration successful!");
      console.log(response.data);
    } catch (error) {
        if (error.response && error.response.status === 409) {
          setMessage("User already exists.");
        } else {
          setMessage("An error occurred. Please try again.");
        }
      }
      
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <p>
  Already have an account? <a href="/">Login here</a>
</p>

    </div>
  );
};

export default Register;


