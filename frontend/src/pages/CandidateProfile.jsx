
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authHeaders } from "../services/api";

function CandidateProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [profile, setProfile] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    education: "",
    skills: "",
    experience: ""
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:8080/api/users/profile/${encodeURIComponent(user.email)}`,
      {
        headers: authHeaders()
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load profile");
        }
        return response.json();
      })
      .then((data) => {
        setProfile({
          name: data.name || "",
          email: data.email || user.email,
          phone: data.phone || "",
          education: data.education || "",
          skills: data.skills || "",
          experience: data.experience || ""
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function handleChange(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
    setSaved(false);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/profile/${encodeURIComponent(user.email)}`,
        {
          method: "PUT",
          headers: authHeaders({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify(profile)
        }
      );

      if (!response.ok) {
        throw new Error("Profile could not be saved");
      }

      const data = await response.json();

      setProfile({
        name: data.name || "",
        email: data.email || user.email,
        phone: data.phone || "",
        education: data.education || "",
        skills: data.skills || "",
        experience: data.experience || ""
      });

      localStorage.setItem("hiretrackProfile", JSON.stringify(data));
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Navbar />

      <section style={{ padding: "50px 20px", minHeight: "500px" }}>
        <h1 style={{ textAlign: "center", color: "#1e293b" }}>
          Candidate Profile
        </h1>

        <p style={{ textAlign: "center", color: "#64748b", marginTop: "10px" }}>
          Create and manage your professional profile.
        </p>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading profile...</p>
        ) : (
          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              style={inputStyle}
            />

            <input
              name="email"
              type="email"
              value={profile.email}
              readOnly
              style={{ ...inputStyle, background: "#f1f5f9" }}
            />

            <input
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              style={inputStyle}
            />

            <input
              name="education"
              value={profile.education}
              onChange={handleChange}
              placeholder="Education (e.g. B.Tech IT)"
              required
              style={inputStyle}
            />

            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="Skills (e.g. Java, React, MySQL)"
              rows="3"
              required
              style={inputStyle}
            />

            <select
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="0-1 Years">0-1 Years</option>
              <option value="1-2 Years">1-2 Years</option>
              <option value="2+ Years">2+ Years</option>
            </select>

            <button type="submit" style={buttonStyle}>
              Save Profile
            </button>

            {saved && (
              <p style={{ color: "green", textAlign: "center", marginTop: "15px" }}>
                Profile saved successfully!
              </p>
            )}

            {error && (
              <p style={{ color: "red", textAlign: "center", marginTop: "15px" }}>
                {error}
              </p>
            )}
          </form>
        )}
      </section>

      <Footer />
    </>
  );
}

const formStyle = {
  maxWidth: "500px",
  margin: "30px auto",
  padding: "30px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "15px",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  fontSize: "15px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default CandidateProfile;
