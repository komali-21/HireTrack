
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
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

    fetch("https://hiretrack-backend-ny1y.onrender.com/api/admin/jobs", {
      headers: authHeaders()
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load jobs");
        }
        return response.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://hiretrack-backend-ny1y.onrender.com/api/admin/jobs/${id}`,
        {
          method: "DELETE",
          headers: authHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Job deletion failed");
      }

      setJobs((previous) =>
        previous.filter((job) => job.id !== id)
      );

      alert("Job deleted successfully!");
    } catch (error) {
      alert("Unable to delete job.");
    }
  };

  return (
    <>
      <Navbar />

      <section style={pageStyle}>
        <h1 style={{ color: "#1e293b" }}>Manage Job Postings</h1>

        <p style={{ color: "#64748b", marginTop: "10px" }}>
          View and manage all jobs posted by recruiters.
        </p>

        {loading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : jobs.length > 0 ? (
          <div style={gridStyle}>
            {jobs.map((job) => (
              <div key={job.id} style={cardStyle}>
                <h3>{job.title}</h3>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Skills:</strong> {job.skills}</p>

                <button
                  onClick={() => deleteJob(job.id)}
                  style={buttonStyle}
                >
                  Delete Job
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyStyle}>
            No recruiter job postings available.
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
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "20px",
  marginTop: "30px"
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  lineHeight: "1.8"
};

const buttonStyle = {
  marginTop: "15px",
  padding: "10px 18px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const emptyStyle = {
  marginTop: "30px",
  padding: "30px",
  background: "white",
  textAlign: "center",
  borderRadius: "10px",
  color: "#64748b"
};

export default AdminJobs;
