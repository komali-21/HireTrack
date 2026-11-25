 
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
    recentJobs: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
useEffect(() => {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!user || user.role !== "ADMIN") {
    setError("Please login with an admin account.");
    setLoading(false);
    return;
  }

  fetch("http://localhost:8080/api/admin/dashboard", {
    headers: authHeaders()
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load dashboard data");
      }
      return response.json();
    })
    .then((data) => {
      setDashboard(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
}, []);


  const stats = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      color: "#2563eb"
    },
    {
      title: "Total Jobs",
      value: dashboard.totalJobs,
      color: "#16a34a"
    },
    {
      title: "Applications",
      value: dashboard.totalApplications,
      color: "#d97706"
    },
    {
      title: "Companies",
      value: dashboard.totalCompanies,
      color: "#9333ea"
    }
  ];

  return (
    <>
      <Navbar />

      <section style={pageStyle}>
        <h1 style={{ color: "#1e293b" }}>Admin Dashboard</h1>

        <p style={{ color: "#64748b", marginTop: "10px" }}>
          Monitor and manage the HireTrack recruitment platform.
        </p>

        {loading && <p>Loading dashboard...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <div style={gridStyle}>
              {stats.map((stat) => (
                <div key={stat.title} style={cardStyle}>
                  <h3 style={{ color: "#64748b" }}>{stat.title}</h3>
                  <h2 style={{
                    color: stat.color,
                    fontSize: "32px",
                    marginTop: "15px"
                  }}>
                    {stat.value}
                  </h2>
                </div>
              ))}
            </div>

            <h2 style={headingStyle}>Admin Activities</h2>

            <div style={gridStyle}>
              <div style={cardStyle}>
                <h3>Manage Candidates</h3>
                <p>View and manage candidate information.</p>
                <Link to="/admin-candidates" style={linkStyle}>
                  Manage Candidates →
                </Link>
              </div>

              <div style={cardStyle}>
                <h3>Manage Recruiters</h3>
                <p>Review and manage recruiter accounts.</p>
                <Link to="/admin-recruiters" style={linkStyle}>
                  Manage Recruiters →
                </Link>
              </div>

              <div style={cardStyle}>
                <h3>Manage Job Postings</h3>
                <p>Monitor job postings created by recruiters.</p>
                <Link to="/admin-jobs" style={linkStyle}>
                  Manage Jobs →
                </Link>
              </div>
            </div>

            <h2 style={headingStyle}>Recent Job Postings</h2>

            <div style={gridStyle}>
              {dashboard.recentJobs.length > 0 ? (
                dashboard.recentJobs.map((job) => (
                  <div key={job.id} style={cardStyle}>
                    <h3>{job.title}</h3>
                    <p>{job.company}</p>
                    <p>Location: {job.location}</p>
                    <p>Salary: {job.salary}</p>
                  </div>
                ))
              ) : (
                <div style={emptyStyle}>
                  No job postings available yet.
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <Footer />
    </>
  );
}

const pageStyle = {
  padding: "50px 7%",
  minHeight: "550px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "25px"
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  lineHeight: "1.8"
};

const headingStyle = {
  marginTop: "45px",
  color: "#1e293b"
};

const linkStyle = {
  display: "inline-block",
  marginTop: "15px",
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "bold"
};

const emptyStyle = {
  background: "white",
  padding: "30px",
  textAlign: "center",
  borderRadius: "10px",
  color: "#64748b"
};

export default AdminDashboard;
