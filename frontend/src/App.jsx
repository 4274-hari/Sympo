import React, { useEffect } from "react";
import Footer from "./components/Phase_1/Footer/Footer.jsx";
import HeroSection from "./components/phase_1/Hero/hero-section.jsx";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../src/components/Phase_1/Navbar/Navbar.jsx"
import Highlight from "./components/Phase_1/Highlight/Highlight";
import Event from "./components/Phase_1/Event/Event";
import Contact from "./components/Phase_1/Contact/Contact";
import Prize from "./components/Prize/prize.jsx";

import CategoryPage from "./components/Event/CategoryPage";
import AppBackground from "./components/Background/Background.jsx";
import EventTimeline from "./components/Phase_1/Timeline/eventTimeline.jsx";
import Scanner from "./components/Phase_1/QR Scanner/Scanner.jsx";
import NotFound from "./components/Phase_1/404/NotFound.jsx";
import Organizer from "./components/Phase_1/Organizer/Organizer.jsx";
import Eventlanding from "./components/Event/Eventlanding.jsx";
import RegisterPage from "./components/Phase_1/Register/RegisterBackUp.jsx";
import UploadAndExtractUID from "./components/Phase_1/OCR.jsx";



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

          {/* 🎯 EVENT LANDING PAGE */}
          <Route path="/events/:category" element={<CategoryPage />} />
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
          <Route
            path="/scanner@1029"
            element={<Scanner />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
          <Route
            path="/1"
            element={<UploadAndExtractUID />}
          />
        </Routes>
      </AppBackground>
    </>
  );
};

export default App;