import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import ParticlesBackground from "./components/Particle/Particle";
import Hero from "./components/Hero/Hero.jsx";
import Highlight from "./components/Highlight/Highlight.jsx";
import Event from "./components/Event/Event.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Eventland from "./components/Event/Eventlanding.jsx";

const App = () => {
  const [eventType, setEventType] = useState(null);
  console.log("Ajith",eventType);

  return (
    <>
      <ParticlesBackground />

      <div className="relative z-10 flex flex-col">
        {/* 🔴 CONDITION */}
        {eventType ? (
          <Eventland eventType={eventType} setEventType={setEventType} />
        ) : (
          <>
            <Navbar />
            <Hero />
            <Event setEventType={setEventType} />
            <Highlight />
            <Contact />
          </>
        )}

      </div>
    </>
  );
};

export default App;
