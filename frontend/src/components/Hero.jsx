
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <h1>
        Discover Your Next
        <span> Career Opportunity</span>
      </h1>

      <p>
        Connect with top companies and find jobs that match
        your skills and career goals.
      </p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Job title or skills"
        />

        <input
          type="text"
          placeholder="Location"
        />

        <button>Search Jobs</button>
      </div>
    </section>
  );
}

export default Hero;
