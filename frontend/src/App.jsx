import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Education from "./pages/education";
import Awareness from "./pages/awareness";
import Competitions from "./pages/competition";
import TeamsPage from "./pages/team";
import Blog from "./pages/Blog";
import Profile from "./pages/ProfilePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";
function App() {
  // 🔥 REACTIVE AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔁 Sync with localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // 🔐 Called after login
  const handleLogin = () => {
    localStorage.setItem("token", "always-logged-in");
    setIsLoggedIn(true);
  };

  // 🔓 Called on logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<TeamsPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route path="/register" element={<Register />} />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Profile onLogout={handleLogout} />}
        />

        {/* OTHER PAGES */}
        <Route path="/#education" element={<Education />} />
        <Route path="/#awareness" element={<Awareness />} />
        <Route path="/#competitions" element={<Competitions />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
