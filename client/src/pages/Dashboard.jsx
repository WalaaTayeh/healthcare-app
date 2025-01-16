// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Dashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState("");
//   const navigate = useNavigate(); // Use navigate for redirection

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/"); // Redirect if no token is found
//           return;
//         }
//         const response = await axios.get("/api/user-data", {
//           headers: {
//             Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
//           },
//         });
//         setUserData(response.data);
//       } catch (error) {
//         setError("Failed to load user data. Please log in again.");
//       }
//     };

//     fetchUserData();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/"); // Redirect to login after logout
//   };

//   if (error) {
//     return (
//       <div>
//         <h1>Error</h1>
//         <p>{error}</p>
//         <button onClick={() => navigate("/")}>Go to Login</button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       {userData ? (
//         <div>
//           <p>Welcome, {userData.name}!</p>
//           <p>Email: {userData.email}</p>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React from "react";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your Dashboard!</p>
    </div>
  );
};

export default Dashboard;


