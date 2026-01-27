import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Education from "./pages/education";
import Awareness from "./pages/awareness";
import Competitions from "./pages/competition";
import TeamsPage from "./pages/team";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import CreateBlog from "./pages/CreateBlog";
import MyBlogs from "./pages/MyBlogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import AdminPage from "./pages/Admin";
import BlogModeration from "./pages/BlogModeration";
import EventManager from "./pages/EventManager";

/* Layout controller */
const AppLayout = ({ isLoggedIn, onLogin, onLogout }) => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!isAuthPage && (
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/team" element={<TeamsPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />

        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/my-blogs" element={<MyBlogs />} />

        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile onLogout={onLogout} />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />

        <Route path="/education" element={<Education />} />
        <Route path="/awareness" element={<Awareness />} />
        <Route path="/competitions" element={<Competitions />} />

        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/blogs" element={<BlogModeration />} />
        <Route path="/admin/events" element={<EventManager />} />
      </Routes>

      {!isAuthPage && <Footer />}
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync once on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <AppLayout
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Router>
  );
}

export default App;
