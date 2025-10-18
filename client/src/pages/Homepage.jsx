import React from "react";
import "./homepage.css";
import Navbar from "../components/Navbar.jsx";
import UploadReport from "./UploadReport.jsx";  // <-- Corrected name

const Homepage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <section className="home-section" id="home">
        <h2>Welcome to HealthMate</h2>
        <p>
          Your Smart Health Companion for Reports, AI Summaries, and Vitals
          Tracking 💙
        </p>
        <button>Get Started</button>
      </section>

      {/* ✅ Upload section added below */}
      <section className="upload-section">
        <h3>Upload Your Medical Report</h3>
        <UploadReport />
      </section>
    </div>
  );
};

export default Homepage;