import React, { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import ParticlesBackground from "./components/Particle/Particle";
import Hero from "./components/Hero/Hero.jsx";
import Highlight from "./components/Highlight/Highlight.jsx";
import Event from "./components/Event/Event.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Eventland from "./components/Event/Eventlanding.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Sponsor from "./components/Sponsor/sponsor.jsx";
import Top_bar from "./components/Navbar/Top_bar.jsx";
import BackgroundVideo from "./components/Background/Background.jsx";
import HeroSection from "./components/Hero/hero-section.jsx";

const App = () => {
  const [eventType, setEventType] = useState(null);

  return (
    <>
      {/* <ParticlesBackground /> */}
      {/* <BackgroundVideo /> */}

      <div className="relative z-10 flex flex-col">
        {eventType ? (
          <Eventland eventType={eventType} setEventType={setEventType} />
        ) : (
          <>
            <Navbar />
            {/* <Top_bar/> */}
            {/* <Hero /> */}
            <HeroSection />
            <Event setEventType={setEventType} />
            
            {/* Section to pause at */}
            <Highlight id="scroll-focus" />

            <Contact />
            <Sponsor />
            <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default App;
