import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar stays at the top and should be sticky */}
      <Navbar />

      {/* Main content area where Outlet renders */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer stays at the bottom */}
      <Footer />
    </div>
  );
}

export default MainLayout;
