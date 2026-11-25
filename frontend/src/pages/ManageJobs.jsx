
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    if (!user || user.role !== "RECRUITER") {
      setError("Please login with a recruiter account.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/jobs/recruiter/${encodeURIComponent(user.email)}`,
        {
          headers: authHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load jobs");
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteJob(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/jobs/${id}`,
        {
          method: "DELETE",
          headers: authHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job.id !== id)
      );

      alert("Job deleted successfully!");
    } catch (error) {
      alert("Unable to delete job. Please try again.");
    }
  }

  return (
    <>
      <Navbar />

      <section style={pageStyle}>
        <h1 style={{ color: "#1e293b" }}>Manage Jobs</h1>

        <p style={{ color: "#64748b", marginTop: "10px" }}>
          View and manage your published job postings.
        </p>

        <Link to="/post-job" style={addButtonStyle}>
          + Post New Job
        </Link>

        <div style={jobGridStyle}>
          {loading ? (
            <h3>Loading jobs...</h3>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} style={jobCardStyle}>
                <h2 style={{ color: "#1e293b" }}>{job.title}</h2>

                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Skills:</strong> {job.skills}</p>

                <button
                  onClick={() => deleteJob(job.id)}
                  style={deleteButtonStyle}
                >
                  Delete Job
                </button>
              </div>
            ))
          ) : (
            <div style={emptyStyle}>
              <h3>No Jobs Posted Yet</h3>
              <p>Your job postings will appear here.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

const pageStyle = {
  padding: "50px 7%",
  minHeight: "550px"
};

const jobGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
  marginTop: "35px"
};

const jobCardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  lineHeight: "2"
};

const addButtonStyle = {
  display: "inline-block",
  marginTop: "25px",
  padding: "12px 20px",
  background: "#2563eb",
  color: "white",
  textDecoration: "none",
  borderRadius: "6px"
};

const deleteButtonStyle = {
  marginTop: "15px",
  padding: "10px 18px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const emptyStyle = {
  background: "white",
  padding: "30px",
  textAlign: "center",
  borderRadius: "10px",
  color: "#64748b"
};

export default ManageJobs;
