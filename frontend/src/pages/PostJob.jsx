
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function PostJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    skills: "",
    description: ""
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setJob({
      ...job,
      [e.target.name]: e.target.value
    });
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(false);

    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (!user || user.role !== "RECRUITER") {
        alert("Please login with a recruiter account.");
        return;
      }

      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/jobs",
        {
          method: "POST",
          headers: authHeaders({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify(job)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to publish job");
      }

      setSaved(true);

      setJob({
        title: "",
        company: "",
        location: "",
        salary: "",
        skills: "",
        description: ""
      });

    } catch (error) {
      alert("Unable to publish job. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <section style={pageStyle}>
        <h1 style={{ textAlign: "center", color: "#1e293b" }}>
          Post a New Job
        </h1>

        <p style={{ textAlign: "center", color: "#64748b", marginTop: "10px" }}>
          Find the right candidates for your company.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input name="title" value={job.title} onChange={handleChange}
            placeholder="Job Title" required style={inputStyle} />

          <input name="company" value={job.company} onChange={handleChange}
            placeholder="Company Name" required style={inputStyle} />

          <input name="location" value={job.location} onChange={handleChange}
            placeholder="Job Location" required style={inputStyle} />

          <input name="salary" value={job.salary} onChange={handleChange}
            placeholder="Salary (e.g. ₹4-6 LPA)" required style={inputStyle} />

          <textarea name="skills" value={job.skills} onChange={handleChange}
            placeholder="Required Skills (e.g. Java, React, MySQL)"
            rows="3" required style={inputStyle} />

          <textarea name="description" value={job.description}
            onChange={handleChange} placeholder="Job Description"
            rows="5" required style={inputStyle} />

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Publishing..." : "Publish Job"}
          </button>

          {saved && (
            <p style={successStyle}>Job posted successfully!</p>
          )}
        </form>

        <button onClick={() => navigate("/recruiter-dashboard")}
          style={backButtonStyle}>
          Back to Recruiter Dashboard
        </button>
      </section>

      <Footer />
    </>
  );
}

const pageStyle = {
  padding: "50px 20px",
  minHeight: "550px"
};

const formStyle = {
  maxWidth: "550px",
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
  cursor: "pointer",
  fontSize: "16px"
};

const successStyle = {
  color: "green",
  textAlign: "center",
  marginTop: "15px"
};

const backButtonStyle = {
  display: "block",
  margin: "20px auto",
  padding: "12px 20px",
  background: "#e2e8f0",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default PostJob;
