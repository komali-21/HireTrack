
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function ViewApplicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    async function fetchApplications() {
      if (!user || user.role !== "RECRUITER") {
        setError("Please login with a recruiter account.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://hiretrack-backend-ny1y.onrender.com/api/applications/recruiter/${encodeURIComponent(user.email)}`,
          {
            headers: authHeaders()
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch applications");
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(
        `https://hiretrack-backend-ny1y.onrender.com/api/applications/${id}/status?status=${encodeURIComponent(newStatus)}`,
        {
          method: "PUT",
          headers: authHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      const updatedApplication = await response.json();

      setApplications((previous) =>
        previous.map((app) =>
          app.id === id ? updatedApplication : app
        )
      );

      alert("Application status updated!");
    } catch (error) {
      alert("Unable to update application status.");
    }
  };

  const handleDownloadResume = async (app) => {
    try {
      const response = await fetch(
        `https://hiretrack-backend-ny1y.onrender.com/api/applications/${app.id}/resume`,
        {
          headers: authHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Resume download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = app.resumeFileName || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      alert("Unable to download resume.");
    }
  };

  return (
    <>
      <Navbar />

      <section style={pageStyle}>
        <h1 style={{ color: "#1e293b" }}>View Applicants</h1>

        <p style={{ color: "#64748b", marginTop: "10px" }}>
          Review candidate applications and update their status.
        </p>

        <div style={summaryStyle}>
          <h3>Total Applications: {applications.length}</h3>
        </div>

        <div style={{ overflowX: "auto", marginTop: "30px" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#eaf1ff" }}>
                <th style={cellStyle}>Candidate Name</th>
                <th style={cellStyle}>Email</th>
                <th style={cellStyle}>Phone</th>
                <th style={cellStyle}>Job Title</th>
                <th style={cellStyle}>Company</th>
                <th style={cellStyle}>Resume</th>
                <th style={cellStyle}>Applied Date</th>
                <th style={cellStyle}>Reason</th>
                <th style={cellStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td style={cellStyle} colSpan="9">
                    Loading applications...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td style={cellStyle} colSpan="9">
                    {error}
                  </td>
                </tr>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td style={cellStyle}>{app.candidateName}</td>
                    <td style={cellStyle}>{app.candidateEmail}</td>
                    <td style={cellStyle}>{app.phone}</td>
                    <td style={cellStyle}>{app.jobTitle}</td>
                    <td style={cellStyle}>{app.company}</td>

                    <td style={cellStyle}>
                      {app.resumeStoredName ? (
                        <button
                          onClick={() => handleDownloadResume(app)}
                          style={downloadButtonStyle}
                        >
                          Download PDF
                        </button>
                      ) : (
                        "Not uploaded"
                      )}
                    </td>

                    <td style={cellStyle}>
                      {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {app.reason || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      <select
                        value={app.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value)
                        }
                        style={selectStyle}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Selected">Selected</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={cellStyle} colSpan="9">
                    No candidate applications available yet.
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

const pageStyle = {
  padding: "50px 7%",
  minHeight: "550px"
};

const summaryStyle = {
  background: "#eff6ff",
  padding: "20px",
  marginTop: "30px",
  borderRadius: "10px",
  color: "#1e40af"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white"
};

const cellStyle = {
  padding: "15px",
  border: "1px solid #e2e8f0",
  textAlign: "left",
  whiteSpace: "nowrap"
};

const selectStyle = {
  padding: "8px",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  background: "white",
  cursor: "pointer"
};

const downloadButtonStyle = {
  padding: "8px 12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default ViewApplicants;
