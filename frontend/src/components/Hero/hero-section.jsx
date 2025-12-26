import React, { useEffect, useState } from "react"
import { CountdownTimer } from "./Clock/countdown-timer"
import { Instagram } from "lucide-react"
import Comet from './Comet';
import styles from "../Navbar/navbar.module.css";
import { RandomizedTextEffect } from "../../utils/TextEffect/TextEffect";
export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [instaHoverPosition, setInstaHoverPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    setTimeout(() => setIsLoaded(true), 100)

    // const handleMouseMove = (e) => {
    //   setMousePosition({ x: e.clientX, y: e.clientY })
    // }

    // window.addEventListener("mousemove", handleMouseMove)
    // return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleInstaTextHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distX = (e.clientX - centerX) / 10
    const distY = (e.clientY - centerY) / 10

    setInstaHoverPosition({ x: -distX, y: -distY })
  }

  const handleInstaTextLeave = () => {
    setInstaHoverPosition({ x: 0, y: 0 })
  }

  return (
    <section className="relative min-h-screen overflow-hidden  flex flex-col items-center justify-between px-4 py-8 md:px-8 lg:px-16">
      {/* Background effects */}
      {/* <Comet/> */}
      <div className="absolute inset-0">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-black via-[#301934] to-[#1a0a1f]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#4B0082]/20 via-transparent to-[#663399]/10" /> */}

        {/* Mouse cursor glow effect */}
        {mounted && (
          <div
            className="absolute w-[400px] h-[400px] rounded-full pointer-events-none transition-all duration-300 ease-out"
            style={{
              // left: `${mousePosition.x}px`,
              // top: `${mousePosition.y}px`,
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(137, 104, 205, 0.15) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        )}

        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#4B0082] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#663399] rounded-full blur-[140px] opacity-25 animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(206, 162, 253, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(206, 162, 253, 0.1) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        /> */}

        {/* AI-themed data particles that react to mouse */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {mounted &&
            Array.from({ length: 50 }).map((_, i) => {
              const baseX = Math.random() * 100
              const baseY = Math.random() * 100
              const distX = (mousePosition.x / window.innerWidth) * 100 - baseX
              const distY = (mousePosition.y / window.innerHeight) * 100 - baseY
              const distance = Math.sqrt(distX * distX + distY * distY)
              const isNear = distance < 20

              return (
                <div
                  key={i}
                  className="absolute transition-all duration-500 ease-out"
                  style={{
                    width: i % 5 === 0 ? "6px" : "4px",
                    height: i % 5 === 0 ? "6px" : "4px",
                    left: `${baseX}%`,
                    top: `${baseY}%`,
                    transform: isNear
                      ? `translate(${distX * 2}px, ${distY * 2}px) scale(1.5)`
                      : "translate(0, 0) scale(1)",
                  }}
                >
                  <div
                    className="w-full h-full rounded-full transition-all duration-500"
                    style={{
                      background: i % 3 === 0 ? "#CEA2FD" : i % 3 === 1 ? "#8968CD" : "#663399",
                      opacity: isNear ? 0.9 : Math.random() * 0.4 + 0.2,
                      boxShadow: isNear
                        ? `0 0 20px ${i % 3 === 0 ? "#CEA2FD" : "#8968CD"}`
                        : `0 0 10px ${i % 3 === 0 ? "#CEA2FD" : "#8968CD"}`,
                      animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 5}s`,
                    }}
                  />
                </div>
              )
            })}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center w-full mt-32">
          {/* Left: Text Content */}
          <div
            className={`flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 md:space-y-6 transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-3 md:space-y-4">
              <h1 className=" relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none font-mono">
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#663399] via-[#CEA2FD] to-[#8968CD] animate-glow typing-text">
                  <RandomizedTextEffect text="COGNEBULA" />
                </span>
                  <div className={styles.hangAnchor} aria-hidden="true">
                            {/* <div className={styles.fishHook} />   */}
                           {/*} <div className={styles.holeRim} />  */}
                            {/* SVG keychain: ring -> chain -> connector -> medallion (with center image) */}
                            <svg
                              className={styles.keychain}
                              viewBox="0 0 80 180"
                              role="img"
                              aria-label="Decorative keychain"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <defs>
                                <linearGradient id="goldGrad" x1="0" x2="1" y1="0" y2="1">
                                  <stop offset="0%" stopColor="#4b3264" />
                                  <stop offset="50%" stopColor="#4b3264" />
                                  <stop offset="100%" stopColor="#4b3264" />
                                </linearGradient>
                                <radialGradient id="medalShade" cx="50%" cy="35%" r="65%">
                                  <stop offset="0%" stopColor="#4b3264" stopOpacity="0.55"/>
                                  <stop offset="40%" stopColor="#4b3264" stopOpacity="0.95"/>
                                  <stop offset="100%" stopColor="#4b3264" stopOpacity="0.95"/>
                                </radialGradient>
                                <filter id="chainShadow" x="-50%" y="-50%" width="200%" height="200%">
                                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.35"/>
                                </filter>
                              </defs>
                
                              {/* top split ring (looks like the keyring) */}
                              <g transform="translate(40,12)">
                                <circle cx="0" cy="0" r="10" fill="none" stroke="#4b3264" strokeWidth="3.5" />
                                <circle cx="0" cy="0" r="7.5" fill="none" stroke="#613c86ff" strokeWidth="1.2" />
                                <circle cx="0" cy="0" r="2.5" fill="none" stroke="#613c86ff" strokeWidth="1.2" />
                              </g>

                              
                
                              {/* short chain links */}
                              <g transform="translate(40,28)" stroke="#4b3264" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#chainShadow)">
                                <ellipse cx="0" cy="12" rx="5.5" ry="8" transform="rotate(-15)" />
                  <ellipse cx="0" cy="34" rx="5.5" ry="8" transform="rotate(10)" />
                  <rect x="-3" y="48" width="6" height="10" rx="1.5" fill="#4b3264" stroke="none" />
                              </g>
                
                              {/* connecting plate */}
                              <g transform="translate(40,86)">
                                <rect x="-6" y="-2" width="12" height="12" rx="2" fill="#4b3264" />
                              </g>
                
                              {/* round medallion / disc (with center image clipped) */}
                              <g transform="translate(40,120)">
                                <defs>
                                  <clipPath id="medalClip">
                                    <circle cx="0" cy="0" r="28" />
                                  </clipPath>
                                </defs>
                
                                {/* outer metal disc */}
                                <circle
                                  cx="0"
                                  cy="0"
                                  r="36"
                                  fill="url(#medalShade)"
                                  stroke="#8f6bcf"
                                  strokeWidth="2.5"
                                />
                
                                {/* image inside center (place your file in public/keychain-center.png) */}
                                <image
                                  href="/favicon.ico"
                                  x="-28"
                                  y="-28"
                                  width="56"
                                  height="56"
                                  clipPath="url(#medalClip)"
                                  preserveAspectRatio="xMidYMid slice"
                                />
                
                                {/* inner border ring */}
                                <circle
                                  cx="0"
                                  cy="0"
                                  r="28"
                                  fill="none"
                                  stroke="#8f6bcf"
                                  strokeWidth="1.5"
                                />
                
                                {/* subtle engraved markings (keeps original decorative feel) */}
                                {/* <g transform="scale(0.9)">
                                  <circle cx="0" cy="0" r="22" fill="none" stroke="#8a5b00" strokeWidth="1.1" />
                                  <circle cx="0" cy="0" r="10" fill="none" stroke="#8a5b00" strokeWidth="1" />
                                  {Array.from({ length: 8 }).map((_, i) => {
                                    const angle = (i * Math.PI * 2) / 8;
                                    const x1 = Math.cos(angle) * 10;
                                    const y1 = Math.sin(angle) * 10;
                                    const x2 = Math.cos(angle) * 22;
                                    const y2 = Math.sin(angle) * 22;
                                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8a5b00" strokeWidth="1" strokeLinecap="round" />;
                                  })}
                                </g> */}
                
                                {/* small center dot */}
                                {/* <circle cx="0" cy="0" r="2.5" fill="#8a5b00" /> */}
                              </g>
                            </svg>
                          </div>
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-4">
                <div className="h-[2px] w-8 md:w-12 bg-gradient-to-r from-transparent to-[#CEA2FD]" />
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#CEA2FD] font-mono">
                  <RandomizedTextEffect text="2026" />
                </span>
                <div className="h-[2px] w-8 md:w-12 bg-gradient-to-l from-transparent to-[#CEA2FD]" />
              </div>
            </div>

            <p className="text-[#CEA2FD] text-lg sm:text-xl md:text-2xl font-light tracking-wider italic">
              Where Intelligence Meets the Cosmos
            </p>

            <div className="space-y-3 md:space-y-4 max-w-lg">
              <p className="text-[#B6B5D8] text-sm sm:text-base md:text-lg font-light tracking-wide leading-relaxed">
                Department of Artificial Intelligence & Data Science
              </p>

              <div className="inline-flex items-center gap-2 md:gap-3 glass-card px-4 py-2 md:px-6 md:py-3 rounded-full group hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-[#CEA2FD]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-[#CEA2FD] text-sm sm:text-base md:text-lg font-semibold tracking-wider">
                  February 7, 2026
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 md:pt-4 justify-center lg:justify-start">
                <div className="w-2 h-2 rounded-full bg-[#CEA2FD] animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-[#8968CD] animate-pulse" style={{ animationDelay: "0.5s" }} />
                <div className="w-2 h-2 rounded-full bg-[#663399] animate-pulse" style={{ animationDelay: "1s" }} />
              </div>
            </div>
          </div>

          {/* Right: Countdown Timer */}
          <div
            className={`flex items-center justify-center lg:justify-end transition-all duration-1000 delay-500 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <CountdownTimer targetDate="2026-02-07T00:00:00" />
          </div>
        </div>
      </div>

      {/* Buttons at the bottom */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8 md:mt-12">
        {/* Instagram Button */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 glass-card rounded-full hover:scale-105 transition-all duration-300 group border border-[#663399]/30 hover:border-[#CEA2FD]/60"
        >
          <Instagram className="w-5 h-5 md:w-6 md:h-6 text-[#CEA2FD] group-hover:rotate-12 transition-transform duration-300" />
          <span
            onMouseMove={handleInstaTextHover}
            onMouseLeave={handleInstaTextLeave}
            className="text-[#CEA2FD] font-bold text-sm md:text-lg tracking-wider inline-block transition-all duration-200 ease-out"
            style={{
              transform: `translate(${instaHoverPosition.x}px, ${instaHoverPosition.y}px)`,
            }}
          >
            COGNEBULA
          </span>
          <svg
            className="w-3 h-3 md:w-4 md:h-4 text-[#CEA2FD] opacity-60 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>

        {/* Register Button */}
        <a
          href="#register"
          className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#4B0082] to-[#663399] text-white font-bold text-base md:text-lg rounded-full shadow-[0_0_40px_rgba(137,104,205,0.6)] hover:shadow-[0_0_60px_rgba(137,104,205,0.9)] hover:scale-110 transition-all duration-300 
         animate-float"
        >
          REGISTER NOW!
        </a>
      </div>
        
    </section>
  )
}
