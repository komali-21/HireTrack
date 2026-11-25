
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function Apply() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/jobs/${id}`
        );

        if (!response.ok) {
          throw new Error("Job not found");
        }

        const data = await response.json();
        setJob(data);
      } catch (error) {
        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user || user.role !== "CANDIDATE") {
      alert("Please login with a candidate account.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const resumeFile = formData.get("resume");

    if (!resumeFile || resumeFile.size === 0) {
      alert("Please select your resume PDF.");
      return;
    }

    if (
      resumeFile.type !== "application/pdf" &&
      !resumeFile.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Only PDF files are allowed.");
      return;
    }

    const application = {
      candidateName: formData.get("name"),
      phone: formData.get("phone"),
      reason: formData.get("reason")
    };

    const uploadData = new FormData();

    uploadData.append(
      "application",
      new Blob(
        [JSON.stringify(application)],
        { type: "application/json" }
      )
    );

    uploadData.append("resume", resumeFile);

    try {
      setUploading(true);

      const response = await fetch(
        `http://localhost:8080/api/applications/${id}`,
        {
          method: "POST",
          headers: authHeaders(),
          body: uploadData
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || "Application submission failed"
        );
      }

      setSubmitted(true);

    } catch (error) {
      alert(
        error.message ||
        "Unable to submit application. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Navbar />

      <section style={{ padding: "60px 20px", minHeight: "500px" }}>
        {loading ? (
          <h2 style={{ textAlign: "center" }}>
            Loading job details...
          </h2>
        ) : error ? (
          <div style={{ textAlign: "center" }}>
            <h1>Job Not Found</h1>
            <p>{error}</p>
            <Link to="/jobs">Back to Jobs</Link>
          </div>
        ) : job ? (
          <>
            <h1 style={{ textAlign: "center" }}>
              Apply for Job
            </h1>

            <h2
              style={{
                textAlign: "center",
                color: "#2563eb",
                marginTop: "15px"
              }}
            >
              {job.title}
            </h2>

            <p style={{ textAlign: "center", marginTop: "8px" }}>
              {job.company}
            </p>

            {submitted ? (
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <h2 style={{ color: "green" }}>
                  Application Submitted!
                </h2>

                <p>
                  Your application for {job.title} was saved successfully.
                </p>

                <p>Your resume PDF was uploaded successfully.</p>

                <Link to="/candidate-dashboard">
                  View Dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={formStyle}>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  style={inputStyle}
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={
                    JSON.parse(
                      localStorage.getItem("user") || "null"
                    )?.email || ""
                  }
                  readOnly
                  style={inputStyle}
                />

                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  required
                  style={inputStyle}
                />

                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: "bold"
                  }}
                >
                  Upload Resume (PDF)
                </label>

                <input
                  name="resume"
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  style={inputStyle}
                />

                <textarea
                  name="reason"
                  placeholder="Why should we hire you?"
                  required
                  rows="5"
                  style={inputStyle}
                />

                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    ...buttonStyle,
                    opacity: uploading ? 0.7 : 1,
                    cursor: uploading ? "not-allowed" : "pointer"
                  }}
                >
                  {uploading ? "Uploading..." : "Submit Application"}
                </button>
              </form>
            )}
          </>
        ) : null}
      </section>

      <Footer />
    </>
  );
}

const formStyle = {
  maxWidth: "500px",
  margin: "30px auto",
  padding: "30px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "15px",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  fontSize: "15px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Apply;
