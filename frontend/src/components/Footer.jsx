
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h2>HireTrack</h2>
          <p>
            Connecting talented people with the right opportunities.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/jobs">Find Jobs</a>
          <a href="/about">About Us</a>
        </div>

        <div>
          <h3>Contact</h3>
          <p>Email: support@hiretrack.com</p>
          <p>India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 HireTrack. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
