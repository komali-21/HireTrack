
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `http://https://hiretrack-backend-ny1y.onrender.com/api/jobs/${id}`
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
    };

    fetchJob();
  }, [id]);

  return (
    <>
      <Navbar />

      <section style={{ padding: "60px 7%", minHeight: "400px" }}>
        {loading ? (
          <h2>Loading job details...</h2>
        ) : error ? (
          <>
            <h1>Job Not Found</h1>
            <p>{error}</p>
            <Link to="/jobs">Back to Jobs</Link>
          </>
        ) : (
          <>
            <h1>{job.title}</h1>
            <p>{job.company}</p>
            <p>Location: {job.location}</p>
            <p>Salary: {job.salary}</p>

            <h2 style={{ marginTop: "30px" }}>Job Description</h2>
            <p>{job.description || "No job description provided."}</p>

            <h2 style={{ marginTop: "25px" }}>Required Skills</h2>
            <p>{job.skills}</p>

            <h2 style={{ marginTop: "25px" }}>Responsibilities</h2>
            <p>
              {job.responsibilities ||
                "Responsibilities will be discussed during the interview."}
            </p>

            <Link
              to={`/apply/${id}`}
              style={{
                display: "inline-block",
                marginTop: "25px",
                padding: "12px 25px",
                background: "#2563eb",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px"
              }}
            >
              Apply Now
            </Link>
          </>
        )}
      </section>

      <Footer />
    </>
  );
}

export default JobDetails;
