
import "../styles/FeaturedJobs.css";

function FeaturedJobs() {
  const jobs = [
    {
      title: "Java Developer",
      company: "Tech Solutions",
      location: "Hyderabad",
      type: "Full Time",
      salary: "₹4–6 LPA"
    },
    {
      title: "Frontend Developer",
      company: "Web Innovations",
      location: "Bangalore",
      type: "Full Time",
      salary: "₹3–5 LPA"
    },
    {
      title: "Full Stack Developer",
      company: "Digital Systems",
      location: "Chennai",
      type: "Full Time",
      salary: "₹5–7 LPA"
    }
  ];

  return (
    <section className="featured-jobs">
      <h2>Featured Jobs</h2>
      <p>Explore opportunities that match your career goals.</p>

      <div className="jobs-container">
        {jobs.map((job, index) => (
          <div className="job-card" key={index}>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <span>{job.type}</span>
            <h4>{job.salary}</h4>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedJobs;
