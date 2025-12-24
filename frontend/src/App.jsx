import React, { useEffect, useRef, useState } from "react";
import Footer from "./components/Footer/Footer.jsx";
import Sponsor from "./components/Sponsor/sponsor.jsx";
import Top_bar from "./components/Navbar/Top_bar.jsx";
import BackgroundVideo from "./components/Background/Background.jsx";
import HeroSection from "./components/Hero/hero-section.jsx";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import ParticlesBackground from "./components/Particle/Particle";
import Hero from "./components/Hero/Hero";
import Highlight from "./components/Highlight/Highlight";
import Event from "./components/Event/Event";
import Contact from "./components/Contact/Contact";
import Eventland from "./components/Event/Eventlanding";
import Register from "./components/Register/Register";
import Prize from "./components/Prize/prize.jsx";

import CategoryPage from "./components/Event/CategoryPage";


const App = () => { 
  return (
    <>
      {/* <ParticlesBackground /> */}
      {/* <BackgroundVideo /> */}

      <div className="relative z-10   ">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
             
                {/* <Hero /> */}
                <HeroSection />
                <Event />
                <Highlight />
                <Prize />
                <Contact />
                <Sponsor />
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
            element={<Register />}
          />
          <Route
            path="/prize"
            element={<Prize />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;