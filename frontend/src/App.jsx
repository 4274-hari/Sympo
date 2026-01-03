import React, { useEffect } from "react";
import Footer from "./components/Footer/Footer.jsx";
import HeroSection from "./components/Hero/hero-section.jsx";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Highlight from "./components/Highlight/Highlight";
import Event from "./components/Event/Event";
import Contact from "./components/Contact/Contact";
import Prize from "./components/Prize/prize.jsx";

import CategoryPage from "./components/Event/CategoryPage";
import AppBackground from "./components/Background/Background.jsx";
import EventTimeline from "./components/Timeline/eventTimeline.jsx";
import Scanner from "./components/QR Scanner/Scanner.jsx";
import NotFound from "./components/404/NotFound.jsx";
import Organizer from "./components/Organizer/Organizer.jsx";
import Eventlanding from "./components/Event/Eventlanding.jsx";
import RegisterPage from "./components/Register/RegisterBackUp.jsx";


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
        </Routes>
      </AppBackground>
    </>
  );
};

export default App;