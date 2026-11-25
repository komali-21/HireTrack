
import "../styles/Features.css";

function Features() {
  return (
    <section className="features">
      <h2>Why Choose HireTrack?</h2>
      <p className="features-description">
        Everything you need to make your job search easier.
      </p>

      <div className="features-container">
        <div className="feature-card">
          <h3>Smart Job Matching</h3>
          <p>
            Discover job opportunities that match your skills
            and career interests.
          </p>
        </div>

        <div className="feature-card">
          <h3>Application Tracking</h3>
          <p>
            Track your applications and stay updated on
            your recruitment progress.
          </p>
        </div>

        <div className="feature-card">
          <h3>Top Companies</h3>
          <p>
            Explore job opportunities and connect with
            different companies.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;
