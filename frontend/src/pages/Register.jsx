
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CANDIDATE");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Creating your account...");

    try {
      const response = await fetch(
        "https://hiretrack-backend-ny1y.onrender.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name, email, password, role })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! You can now login.");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(typeof data === "string" ? data : "Registration failed");
      }
    } catch (error) {
      setMessage("Unable to connect to server. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h1>Create Your Account</h1>
        <p>Join HireTrack and discover new career opportunities.</p>

        <form
          onSubmit={handleRegister}
          style={{ maxWidth: "400px", margin: "30px auto" }}
        >
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          />

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          >
            <option value="CANDIDATE">Candidate</option>
            <option value="RECRUITER">Recruiter</option>
          </select>

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
            Register
          </button>

          <p>{message}</p>
        </form>
      </section>

      <Footer />
    </>
  );
}

export default Register;
