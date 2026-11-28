
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await fetch(
        "https://hiretrack-backend-ny1y.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));

localStorage.setItem("token", data.token);

        if (data.role === "CANDIDATE") {
          navigate("/candidate-dashboard");
        } else if (data.role === "RECRUITER") {
          navigate("/recruiter-dashboard");
        } else if (data.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          setMessage("Unknown user role");
        }
      } else {
        setMessage(typeof data === "string" ? data : "Login failed");
      }
    } catch (error) {
      setMessage("Unable to connect to server. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h1>Welcome Back!</h1>
        <p>Login to your HireTrack account.</p>

        <form
          onSubmit={handleLogin}
          style={{ maxWidth: "400px", margin: "30px auto" }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Login
          </button>

          <p>{message}</p>
        </form>
      </section>

      <Footer />
    </>
  );
}

export default Login;
