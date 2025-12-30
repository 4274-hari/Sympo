import React, { useEffect, useRef, useState } from "react";
import Footer from "./components/Footer/Footer.jsx";
import Sponsor from "./components/Sponsor/sponsor.jsx";
import HeroSection from "./components/Hero/hero-section.jsx";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Highlight from "./components/Highlight/Highlight";
import Event from "./components/Event/Event";
import Contact from "./components/Contact/Contact";
import Eventland from "./components/Event/Eventlanding";
import Prize from "./components/Prize/prize.jsx";

import CategoryPage from "./components/Event/CategoryPage";
import AppBackground from "./components/Background/Background.jsx";
import EventTimeline from "./components/Timeline/eventTimeline.jsx";
import Scanner from "./components/QR Scanner/Scanner.jsx";
import NotFound from "./components/404/notfound.jsx";
import RegisterGate from "./components/Register/RegisterGateWay.jsx";


const App = () => { 
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
                <Contact />
                {/* <Sponsor /> */}
                <Footer />
              </>
            }
          />

          {/* 🎯 EVENT LANDING PAGE */}
          <Route path="/events/:category" element={<CategoryPage />} />
          <Route
            path="/event/:category/:id"
            element={<Eventland />}
          />
            <Route
            path="/register"
            element={<RegisterGate />}
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