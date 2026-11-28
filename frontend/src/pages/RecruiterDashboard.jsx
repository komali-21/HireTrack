
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  
useEffect(() => {
  async function fetchDashboardData() {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user || user.role !== "RECRUITER") {
      setLoading(false);
      return;
    }

    try {
      const [jobsResponse, applicationsResponse] =
        await Promise.all([
          fetch(
            `https://hiretrack-backend-ny1y.onrender.com/api/jobs/recruiter/${encodeURIComponent(user.email)}`,
            {
              headers: authHeaders()
            }
          ),
          fetch(
            `https://hiretrack-backend-ny1y.onrender.com/api/applications/recruiter/${encodeURIComponent(user.email)}`,
            {
              headers: authHeaders()
            }
          )
        ]);

      if (!jobsResponse.ok || !applicationsResponse.ok) {
        throw new Error("Failed to load dashboard");
      }

      const jobsData = await jobsResponse.json();
      const applicationsData = await applicationsResponse.json();

      setJobs(jobsData);
      setApplications(applicationsData);
    } catch (error) {
      alert("Unable to load recruiter dashboard.");
    } finally {
      setLoading(false);
    }
  }

  fetchDashboardData();
}, []);


  return (
    <>
      <Navbar />

      <section style={pageStyle}>
        <h1 style={{ color: "#1e293b" }}>
          Recruiter Dashboard
        </h1>

        <p style={{ color: "#64748b", marginTop: "10px" }}>
          Manage your job postings and candidate applications.
        </p>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h3>Total Jobs Posted</h3>
            <h2 style={numberStyle}>
              {loading ? "..." : jobs.length}
            </h2>
          </div>

          <div style={cardStyle}>
            <h3>Total Applicants</h3>
            <h2 style={numberStyle}>
              {loading ? "..." : applications.length}
            </h2>
          </div>

          <div style={cardStyle}>
            <h3>Active Jobs</h3>
            <h2 style={numberStyle}>
              {loading ? "..." : jobs.length}
            </h2>
          </div>
        </div>

        <h2 style={headingStyle}>Recruiter Activities</h2>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h3>Post a New Job</h3>
            <p>Create and publish new job openings.</p>
            <Link to="/post-job" style={linkStyle}>
              Post Job →
            </Link>
          </div>

          <div style={cardStyle}>
            <h3>Manage Jobs</h3>
            <p>View, edit and manage your job postings.</p>
            <Link to="/manage-jobs" style={linkStyle}>
              Manage Jobs →
            </Link>
          </div>

          <div style={cardStyle}>
            <h3>View Applicants</h3>
            <p>Review candidate applications and resumes.</p>
            <Link to="/view-applicants" style={linkStyle}>
              View Applicants →
            </Link>
          </div>

          <div style={cardStyle}>
            <h3>Update Application Status</h3>
            <p>Shortlist, reject or select candidates.</p>
            <Link to="/view-applicants" style={linkStyle}>
              Update Status →
            </Link>
          </div>
        </div>

        <h2 style={headingStyle}>Recent Job Postings</h2>

        <div style={gridStyle}>
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length > 0 ? (
            [...jobs].reverse().slice(0, 3).map((job) => (
              <div key={job.id} style={cardStyle}>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <p>{job.location}</p>
                <p>{job.salary}</p>
              </div>
            ))
          ) : (
            <div style={emptyStyle}>
              No job postings available yet.
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

const numberStyle = {
  color: "#2563eb",
  fontSize: "30px",
  marginTop: "15px"
};

const headingStyle = {
  marginTop: "45px",
  color: "#1e293b"
};

const emptyStyle = {
  background: "white",
  padding: "30px",
  textAlign: "center",
  borderRadius: "10px",
  color: "#64748b"
};

const linkStyle = {
  display: "inline-block",
  marginTop: "15px",
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "bold"
};

export default RecruiterDashboard;
