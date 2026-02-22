// App.js
import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
// import routes from "../routes/main";
import routes from "./routes/main";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  return <RouterProvider router={routes} />;
}

export default App;
