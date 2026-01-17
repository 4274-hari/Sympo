import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// ==============================================================
//                              Public
// ==============================================================
import Footer from "./components/public/Footer/Footer.jsx";
import HeroSection from "./components/public/Hero/hero-section.jsx";
import Navbar from "./components/public/Navbar/Navbar";
import Highlight from "./components/public/Highlight/Highlight";
import Event from "./components/public/Event/Event";
import Contact from "./components/public/Contact/Contact";
import Prize from "./components/public/Prize/prize.jsx";
import Organizer from "./components/public/Organizer/Organizer.jsx";
import Eventlanding from "./components/public/Event/Eventlanding.jsx";
import RegisterPage from "./components/public/Register/RegisterBackUp.jsx";
import EventTimeline from "./components/public/Timeline/eventTimeline.jsx";
import CategoryPage from "./components/public/Event/CategoryPage";

// ==============================================================
//                              Common
// ==============================================================
import AppBackground from "./components/common/Background/Background.jsx";
import NotFound from "./components/common/404/NotFound.jsx";

// ==============================================================
//                              Admin
// ==============================================================
import Scanner from "./components/admin/QR Scanner/Scanner.jsx";
import RoleLogin from "./components/auth/Login/Login.jsx";
import Dashboard from "./components/admin/General Dash/Dashboard.jsx";
import CheckInStatus from "./components/admin/Check In/CheckInStatus.jsx";
import Participants from "./components/admin/Participant Dashboard/Participants.jsx";


const App = () => { 

  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [location]);
  
  return (
    <>
      <AppBackground>
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HeroSection />
                <Event />
                <EventTimeline />
                <Highlight />
                <Organizer />
                <Contact />
                <Footer />
              </>
            }
          />
          <Route 
            path="/events/:category" 
            element={<CategoryPage />}
          />
          <Route
            path="/event/:category/:id"
            element={<Eventlanding />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/prize"
            element={<Prize />}
          />
          {/* Admin */}
          <Route
            path="/scanner@1029"
            element={<Scanner />}
          />
          <Route
            path="/login"
            element={<RoleLogin />}
          />
          <Route
            path="/admin/general/events"
            element={<Dashboard />}
          />
          <Route
            path="/coordinator/dashboard"
            element={<Participants />}
          />
          {/* Common */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </AppBackground>
    </>
  );
};

export default App;