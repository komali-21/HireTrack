
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);
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

  fetch("https://hiretrack-backend-ny1y.onrender.com/api/users/candidates", {
    headers: authHeaders()
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load candidates");
      }
      return response.json();
    })
    .then((data) => {
      setCandidates(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
}, []);


  return (
    <>
      <Navbar />

      <section style={pageStyle}>
        <h1 style={{ color: "#1e293b" }}>Manage Candidates</h1>

        <p style={{ color: "#64748b", marginTop: "10px" }}>
          View and manage registered candidate information.
        </p>

        <h3 style={{ marginTop: "25px", color: "#2563eb" }}>
          Total Candidates: {candidates.length}
        </h3>

        {loading ? (
          <p style={{ marginTop: "30px" }}>Loading candidates...</p>
        ) : error ? (
          <p style={{ color: "red", marginTop: "30px" }}>{error}</p>
        ) : candidates.length > 0 ? (
          <div style={gridStyle}>
            {candidates.map((candidate) => (
              <div key={candidate.id} style={cardStyle}>
                <h2>{candidate.name || "Candidate"}</h2>

                <p><strong>Email:</strong> {candidate.email}</p>
                <p><strong>Phone:</strong> {candidate.phone || "Not provided"}</p>
                <p><strong>Education:</strong> {candidate.education || "Not provided"}</p>
                <p><strong>Skills:</strong> {candidate.skills || "Not provided"}</p>
                <p><strong>Experience:</strong> {candidate.experience || "Not provided"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyStyle}>
            No registered candidates found.
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
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
  marginTop: "25px"
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  lineHeight: "1.8",
  overflowWrap: "anywhere"
};

const emptyStyle = {
  marginTop: "30px",
  padding: "30px",
  background: "white",
  borderRadius: "10px",
  textAlign: "center",
  color: "#64748b"
};

export default AdminCandidates;
