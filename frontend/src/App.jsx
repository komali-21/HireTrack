import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import JobDetails from "./pages/JobDetails";
import Apply from "./pages/Apply";
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplicants from "./pages/ViewApplicants";
import AdminDashboard from "./pages/AdminDashboard";
import AdminJobs from "./pages/AdminJobs";
import AdminCandidates from "./pages/AdminCandidates";
import AdminRecruiters from "./pages/AdminRecruiters";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/apply/:id" element={<Apply />} />

        {/* Candidate Routes */}
        <Route
          path="/candidate-dashboard"
          element={<CandidateDashboard />}
        />
        <Route
          path="/candidate-profile"
          element={<CandidateProfile />}
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter-dashboard"
          element={<RecruiterDashboard />}
        />
        <Route
          path="/post-job"
          element={<PostJob />}
        />
        <Route path="/manage-jobs" element={<ManageJobs />} />
        <Route path="/view-applicants" element={<ViewApplicants />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-jobs" element={<AdminJobs />} />
        <Route path="/admin-candidates" element={<AdminCandidates />} />
        <Route path="/admin-recruiters" element={<AdminRecruiters />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;