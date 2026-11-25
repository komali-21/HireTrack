
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  
const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("hiretrackProfile");

  navigate("/login");
  window.location.reload();
};


  return (
    <nav className="navbar">
      <h2 className="logo">HireTrack</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/jobs">Find Jobs</Link>
        <Link to="/about">About</Link>
        <Link to="/candidate-dashboard">Dashboard</Link>
        <Link to="/recruiter-dashboard">Recruiter</Link>
        <Link to="/admin-dashboard">Admin</Link>
      </div>

      <div className="nav-buttons">
        {user ? (
          <button
            onClick={handleLogout}
            className="login-btn"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
