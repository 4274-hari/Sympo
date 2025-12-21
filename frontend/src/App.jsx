import React from 'react'
import Navbar from './components/Navbar/Navbar';
import ParticlesBackground from './components/Particle/Particle';
import Hero from './components/Hero/Hero.jsx';
import Highlight from './components/Highlight/Highlight.jsx';
import Event from './components/Event/Event.jsx';
import Contact from './components/Contact/Contact.jsx';

const App = () => {
  return (
    <>  
      <ParticlesBackground />
      <div className="relative z-10 flex flex-col">
        <Navbar />
        <Hero />
        <Event/>
        <Contact/>
        <Highlight/>
      </div>
    </>
  )
}

export default App;