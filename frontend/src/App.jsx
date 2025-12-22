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

const STOP_AT = 600;         // scroll stop position in px
const PAUSE_DURATION = 500; // pause duration in ms

const App = () => {
  const [eventType, setEventType] = useState(null);
  const isPausingRef = useRef(false);
  const lastScrollYRef = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (isPausingRef.current) return;

      const currentY = window.scrollY;

      // Check if we just crossed STOP_AT
      if (
        (lastScrollYRef.current < STOP_AT && currentY >= STOP_AT) || // scrolling down
        (lastScrollYRef.current > STOP_AT && currentY <= STOP_AT)    // scrolling up
      ) {
        isPausingRef.current = true;

        // Snap to stop position
        window.scrollTo({ top: STOP_AT, behavior: "auto" });

        // Optional: add animation / visual feedback
        const section = document.getElementById("scroll-focus");
        if (section) {
          section.classList.add("scale-100", "opacity-100");
          setTimeout(() => {
            section.classList.remove("scale-100", "opacity-100");
          }, PAUSE_DURATION);
        }

        // Pause scroll temporarily
        document.body.style.overflow = "hidden";

        setTimeout(() => {
          document.body.style.overflow = "";
          isPausingRef.current = false;
        }, PAUSE_DURATION);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <ParticlesBackground />

      <div className="relative z-10 flex flex-col">
        {eventType ? (
          <Eventland eventType={eventType} setEventType={setEventType} />
        ) : (
          <>
            <Navbar />
            <Top_bar/>
            <Hero />
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
