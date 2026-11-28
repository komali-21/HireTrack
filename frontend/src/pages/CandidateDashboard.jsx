
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    const savedProfile = JSON.parse(
      localStorage.getItem("hiretrackProfile") || "null"
    );

    setProfile(savedProfile);

    async function fetchApplications() {
      if (!user || user.role !== "CANDIDATE") {
        setError("Please login with a candidate account.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://https://hiretrack-backend-ny1y.onrender.com/api/applications/candidate/${encodeURIComponent(user.email)}`,
          {
            headers: authHeaders()
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data);
      } catch (error) {
        setError("Unable to load applications.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const latestResume =
    applications.length > 0
      ? applications[applications.length - 1].resumeFileName
      : null;

  return (
    <>
      <Navbar />

      <section style={{ padding: "50px 7%", minHeight: "500px" }}>
        <h1 style={{ color: "#1e293b" }}>
          Welcome, {profile?.name || "Candidate"}!
        </h1>

        <p style={{ color: "#64748b", marginTop: "10px" }}>
          Manage your profile and job applications here.
        </p>

        {profile && (
          <div style={profileStyle}>
            <h2>My Professional Profile</h2>
            <p><strong>Education:</strong> {profile.education}</p>
            <p><strong>Skills:</strong> {profile.skills}</p>
            <p><strong>Experience:</strong> {profile.experience}</p>
            <Link to="/candidate-profile" style={linkStyle}>
              Edit Profile →
            </Link>
          </div>
        )}

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h3>My Profile</h3>
            <p>Manage your personal and professional details.</p>
            <Link to="/candidate-profile" style={linkStyle}>
              Edit Profile →
            </Link>
          </div>

          <div style={cardStyle}>
            <h3>My Resume</h3>
            <p>
              {latestResume
                ? `Latest Resume: ${latestResume}`
                : "No resume submitted yet."}
            </p>
          </div>

          <div style={cardStyle}>
            <h3>My Applications</h3>
            <p>Total Applications: {applications.length}</p>
          </div>

          <div style={cardStyle}>
            <h3>Recommended Jobs</h3>
            <p>Explore jobs that match your skills.</p>
            <Link to="/jobs" style={linkStyle}>
              Find Jobs →
            </Link>
          </div>
        </div>

        <h2 style={{ marginTop: "45px", color: "#1e293b" }}>
          My Applications
        </h2>

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#eaf1ff" }}>
                <th style={cellStyle}>Job Title</th>
                <th style={cellStyle}>Company</th>
                <th style={cellStyle}>Applied Date</th>
                <th style={cellStyle}>Resume</th>
                <th style={cellStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td style={cellStyle} colSpan="5">
                    Loading applications...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td style={cellStyle} colSpan="5">
                    {error}
                  </td>
                </tr>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td style={cellStyle}>{app.jobTitle}</td>
                    <td style={cellStyle}>{app.company}</td>
                    <td style={cellStyle}>
                      {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td style={cellStyle}>
                      {app.resumeFileName || "Not uploaded"}
                    </td>
                    <td style={cellStyle}>
                      <span style={{ color: "#d97706", fontWeight: "bold" }}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={cellStyle} colSpan="5">
                    No applications submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </>
  );
}

const profileStyle = {
  background: "#eff6ff",
  padding: "25px",
  borderRadius: "10px",
  marginTop: "30px",
  lineHeight: "2"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "35px"
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const cellStyle = {
  padding: "15px",
  border: "1px solid #e2e8f0",
  textAlign: "left"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white"
};

const linkStyle = {
  display: "inline-block",
  marginTop: "15px",
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "bold"
};

export default CandidateDashboard;
