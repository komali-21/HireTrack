
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function AdminRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
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

  fetch("http://https://hiretrack-backend-ny1y.onrender.com/api/admin/recruiters", {
    headers: authHeaders()
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to load recruiters");
      }
      return response.json();
    })
    .then((data) => {
      setRecruiters(data);
      setLoading(false);
    })
    .catch(() => {
      setError("Unable to connect to server. Please try again.");
      setLoading(false);
    });
}, []);


  return (
    <>
      <Navbar />

      <section style={pageStyle}>
        <h1 style={{ color: "#1e293b" }}>Manage Recruiters</h1>

        <p style={{ color: "#64748b", marginTop: "10px" }}>
          View recruiters and their job posting details.
        </p>

        {loading ? (
          <p style={messageStyle}>Loading recruiters...</p>
        ) : error ? (
          <p style={{ ...messageStyle, color: "#dc2626" }}>{error}</p>
        ) : recruiters.length > 0 ? (
          <div style={gridStyle}>
            {recruiters.map((recruiter) => (
              <div key={recruiter.id} style={cardStyle}>
                <h2>{recruiter.name}</h2>

                <p style={detailStyle}>
                  <strong>Email:</strong> {recruiter.email}
                </p>

                <p style={detailStyle}>
                  <strong>Posted Jobs:</strong> {recruiter.jobCount}
                </p>

                <p style={detailStyle}>
                  <strong>Companies:</strong>{" "}
                  {recruiter.companies.length > 0
                    ? recruiter.companies.join(", ")
                    : "No companies yet"}
                </p>

                <p style={{ color: "#16a34a", marginTop: "12px" }}>
                  Recruiter Account
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyStyle}>
            No recruiters found.
          </div>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "30px"
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const detailStyle = {
  marginTop: "10px",
  color: "#475569"
};

const messageStyle = {
  marginTop: "30px",
  color: "#64748b"
};

const emptyStyle = {
  marginTop: "30px",
  padding: "30px",
  background: "white",
  borderRadius: "10px",
  textAlign: "center",
  color: "#64748b"
};

export default AdminRecruiters;
