import "./App.css";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // 👈 अपना custom theme import करो
import Home from "./components/home/Home";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Job from "./components/Job/Job";
import Browse from "./components/Browse/Browse";
import Company from "./components/Company/Company";
import Profile from "./components/profile/profile";
import JobDescription from "./components/Description/jobDescription";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";
import AppliedJobs from "./components/AppliedJobs";
import PostJob from "./components/PostJob";
import RecruiterDashboard from "./components/RecruiterDashboard";
import Dashboard from "./components/Dashboard";
import { api } from "./api/api";
import { setUser } from "./redux/authSlice";
import ProjectAssistant from "./components/ProjectAssistant";

function ProtectedRoute({ roles, children }) {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const [checking, setChecking] = useState(!user);

  useEffect(() => {
    if (user) {
      setChecking(false);
      return undefined;
    }

    let active = true;
    api
      .get("/api/verify")
      .then((response) => {
        if (active) dispatch(setUser(response.data.user));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [dispatch, user]);

  if (checking)
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Checking your session...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role))
    return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename="/">
        <ProjectAssistant />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/job" element={<Job />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/companies" element={<Company />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applied-jobs"
            element={
              <ProtectedRoute roles={["Student"]}>
                <AppliedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute roles={["Recruiter"]}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute roles={["Recruiter"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["Student", "Recruiter"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/description/:id" element={<JobDescription />} />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
                <h1 className="text-6xl font-bold text-blue-600">404</h1>
                <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
                <p className="mt-2 text-gray-600">
                  Oops! The page you are looking for doesn’t exist.
                </p>
                <Link
                  to="/"
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Go Back Home
                </Link>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
