
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Jobs.css";

function Jobs() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [salary, setSalary] = useState("All Salaries");

  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/jobs");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setRecruiterJobs(data);
      } catch (error) {
        setError("Unable to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const defaultJobs = [
    {
      id: 1,
      title: "Java Developer",
      company: "Tech Solutions",
      location: "Hyderabad",
      salary: "₹4–6 LPA",
      skills: "Java, Spring Boot, MySQL"
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Web Innovations",
      location: "Bangalore",
      salary: "₹3–5 LPA",
      skills: "HTML, CSS, JavaScript, React"
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "Digital Systems",
      location: "Chennai",
      salary: "₹5–7 LPA",
      skills: "Java, React, MySQL"
    }
  ];

  const allJobs = [...defaultJobs, ...recruiterJobs];

  const locations = [
    "All Locations",
    ...new Set(
      allJobs
        .map((job) => job.location)
        .filter(Boolean)
    )
  ];

  const filteredJobs = allJobs.filter((job) => {
    // Search Filter
    const matchesSearch =
      `${job.title || ""} ${job.company || ""} ${job.location || ""} ${job.skills || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    // Location Filter
    const matchesLocation =
      location === "All Locations" ||
      job.location?.toLowerCase() === location.toLowerCase();

    // Salary Filter (based on starting salary)
    const salaryValue = Number(
      (job.salary || "")
        .replace(/[₹,\s]/g, "")
        .match(/\d+(\.\d+)?/)?.[0] || 0
    );

    const matchesSalary =
      salary === "All Salaries" ||
      (salary === "3-5" && salaryValue >= 3 && salaryValue <= 5) ||
      (salary === "5-7" && salaryValue >= 5 && salaryValue <= 7) ||
      (salary === "7+" && salaryValue >= 7);

    return matchesSearch && matchesLocation && matchesSalary;
  });

  return (
    <>
      <Navbar />

      <section className="jobs-section">
        <div className="jobs-heading">
          <h1>Find Your Dream Job</h1>
          <p>Explore opportunities that match your skills.</p>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by job title, company, location or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "550px",
              padding: "14px",
              marginTop: "25px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "15px"
            }}
          />

          {/* Location Filter */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "550px",
              padding: "14px",
              marginTop: "15px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "15px",
              background: "white"
            }}
          >
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Salary Filter */}
          <select
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "550px",
              padding: "14px",
              marginTop: "15px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "15px",
              background: "white"
            }}
          >
            <option value="All Salaries">All Salaries</option>
            <option value="3-5">₹3–5 LPA</option>
            <option value="5-7">₹5–7 LPA</option>
            <option value="7+">₹7+ LPA</option>
          </select>
        </div>

        <div className="jobs-list">
          {loading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="job-card" key={job.id}>
                <h2>{job.title}</h2>
                <p>{job.company}</p>
                <p>Location: {job.location}</p>
                <p>Salary: {job.salary}</p>
                <p>Skills: {job.skills}</p>

                <Link
                  to={`/jobs/${job.id}`}
                  className="view-details-btn"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p>No jobs found. Try another search.</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Jobs;
