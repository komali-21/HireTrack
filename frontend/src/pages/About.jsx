
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  const features = [
    {
      icon: "🔍",
      title: "Smart Job Search",
      description:
        "Explore job opportunities based on skills, interests, job roles and locations."
    },
    {
      icon: "📊",
      title: "Application Tracking",
      description:
        "Track your job applications and monitor their progress from one dashboard."
    },
    {
      icon: "👥",
      title: "Recruiter Management",
      description:
        "Help recruiters publish job openings and manage candidate applications."
    },
    {
      icon: "🎯",
      title: "Skill-Based Matching",
      description:
        "Connect candidate skills with relevant job requirements to support better job discovery."
    },
    {
      icon: "📁",
      title: "Candidate Profiles",
      description:
        "Maintain professional profiles with educational details, skills and career information."
    },
    {
      icon: "⚙️",
      title: "Admin Management",
      description:
        "Provide administrators with tools to monitor jobs, candidates and recruitment activities."
    }
  ];

  return (
    <>
      <Navbar />

      <section style={heroStyle}>
        <span style={tagStyle}>SMART RECRUITMENT PLATFORM</span>

        <h1 style={heroTitle}>
          About <span style={{ color: "#2563eb" }}>HireTrack</span>
        </h1>

        <p style={heroDescription}>
          Simplifying recruitment. Connecting talent.
          Creating career opportunities.
        </p>
      </section>

      <section style={aboutStyle}>
        <div style={aboutContent}>
          <h2 style={headingStyle}>Who We Are</h2>

          <p style={paragraphStyle}>
            HireTrack is a smart recruitment portal designed to
            connect job seekers with suitable career opportunities
            and help recruiters manage the hiring process efficiently.
          </p>

          <p style={paragraphStyle}>
            Our platform brings candidates, recruiters and
            administrators together in one place. Candidates can
            explore jobs, build profiles and track applications,
            while recruiters can post vacancies and manage applicants.
          </p>

          <p style={paragraphStyle}>
            HireTrack aims to make the recruitment journey more
            organized, accessible and efficient through technology.
          </p>
        </div>
      </section>

      <section style={missionSection}>
        <div style={missionCard}>
          <h2 style={headingStyle}>Our Mission</h2>
          <p style={paragraphStyle}>
            To simplify the job search and recruitment experience
            by creating a reliable platform where talent and
            opportunities come together.
          </p>
        </div>

        <div style={missionCard}>
          <h2 style={headingStyle}>Our Vision</h2>
          <p style={paragraphStyle}>
            To build a smarter recruitment ecosystem that supports
            candidates, empowers recruiters and improves the
            overall hiring experience.
          </p>
        </div>
      </section>

      <section style={featuresSection}>
        <h2 style={sectionTitle}>What HireTrack Offers</h2>

        <p style={sectionDescription}>
          Explore the features designed to make recruitment easier
          for everyone.
        </p>

        <div style={featureGrid}>
          {features.map((feature) => (
            <div key={feature.title} style={featureCard}>
              <div style={iconStyle}>{feature.icon}</div>

              <h3 style={featureTitle}>{feature.title}</h3>

              <p style={featureDescription}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={workflowSection}>
        <h2 style={sectionTitle}>How HireTrack Works</h2>

        <div style={workflowGrid}>
          <div style={workflowCard}>
            <span style={numberStyle}>01</span>
            <h3>For Candidates</h3>
            <p>
              Create a profile, explore job opportunities,
              apply for suitable positions and track application status.
            </p>
          </div>

          <div style={workflowCard}>
            <span style={numberStyle}>02</span>
            <h3>For Recruiters</h3>
            <p>
              Post job openings, manage job listings,
              review applications and update candidate status.
            </p>
          </div>

          <div style={workflowCard}>
            <span style={numberStyle}>03</span>
            <h3>For Administrators</h3>
            <p>
              Monitor recruitment activities and manage
              job postings, candidate information and companies.
            </p>
          </div>
        </div>
      </section>

      <section style={ctaSection}>
        <h2>Ready to Explore New Opportunities?</h2>

        <p>
          Start your career journey with HireTrack.
        </p>

        <a href="/jobs" style={ctaButton}>
          Explore Jobs →
        </a>
      </section>

      <Footer />
    </>
  );
}

const heroStyle = {
  padding: "90px 7%",
  textAlign: "center",
  background: "#f1f5ff"
};

const tagStyle = {
  color: "#2563eb",
  fontWeight: "bold",
  fontSize: "13px",
  letterSpacing: "2px"
};

const heroTitle = {
  fontSize: "clamp(36px, 5vw, 52px)",
  color: "#1e293b",
  marginTop: "20px"
};

const heroDescription = {
  color: "#64748b",
  fontSize: "18px",
  marginTop: "15px",
  lineHeight: "1.7"
};

const aboutStyle = {
  padding: "65px 7%",
  background: "white"
};

const aboutContent = {
  maxWidth: "850px",
  margin: "auto"
};

const headingStyle = {
  color: "#1e293b",
  fontSize: "28px",
  marginBottom: "20px"
};

const paragraphStyle = {
  color: "#64748b",
  lineHeight: "1.9",
  fontSize: "16px",
  marginBottom: "15px"
};

const missionSection = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "25px",
  padding: "40px 7%",
  background: "#f8fafc"
};

const missionCard = {
  padding: "35px",
  background: "white",
  borderRadius: "12px",
  border: "1px solid #e2e8f0"
};

const featuresSection = {
  padding: "70px 7%",
  textAlign: "center",
  background: "white"
};

const sectionTitle = {
  fontSize: "30px",
  color: "#1e293b"
};

const sectionDescription = {
  color: "#64748b",
  marginTop: "12px",
  marginBottom: "35px",
  lineHeight: "1.7"
};

const featureGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "22px",
  textAlign: "left"
};

const featureCard = {
  padding: "28px",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  background: "white",
  boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
};

const iconStyle = {
  fontSize: "32px",
  marginBottom: "15px"
};

const featureTitle = {
  color: "#1e293b",
  marginBottom: "12px"
};

const featureDescription = {
  color: "#64748b",
  lineHeight: "1.7",
  fontSize: "14px"
};

const workflowSection = {
  padding: "70px 7%",
  background: "#f8fafc",
  textAlign: "center"
};

const workflowGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "22px",
  marginTop: "35px",
  textAlign: "left"
};

const workflowCard = {
  padding: "30px",
  background: "white",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  lineHeight: "1.8"
};

const numberStyle = {
  color: "#2563eb",
  fontSize: "25px",
  fontWeight: "bold"
};

const ctaSection = {
  padding: "65px 7%",
  textAlign: "center",
  background: "#eff6ff"
};

const ctaButton = {
  display: "inline-block",
  marginTop: "22px",
  padding: "13px 25px",
  background: "#2563eb",
  color: "white",
  textDecoration: "none",
  borderRadius: "7px",
  fontWeight: "bold"
};

export default About;
