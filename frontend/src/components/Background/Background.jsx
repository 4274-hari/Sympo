import React, { useEffect, useMemo, useState } from "react"

export default function AppBackground({ children }) {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // 🔒 Generate particles ONCE
  const particles = useMemo(
    () =>
      Array.from({ length: 500 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: i % 5 === 0 ? 6 : 4,
        color:
          i % 3 === 0 ? "#CEA2FD" : i % 3 === 1 ? "#8968CD" : "#663399",
        duration: 1 + Math.random() * 10,
        delay: Math.random() * 5,
      })),
    []
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#301934] to-[#1a0a1f]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#4B0082]/20 via-transparent to-[#663399]/10" />

        {/* Glow blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#4B0082] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#663399] rounded-full blur-[140px] opacity-25 animate-pulse" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(206,162,253,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(206,162,253,0.1) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        {/* Cursor Glow */}
        {mounted && (
          <div
            className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(137,104,205,0.15) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        )}

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {mounted &&
            particles.map((p) => {
              const dx =
                (mousePosition.x / window.innerWidth) * 100 - p.x
              const dy =
                (mousePosition.y / window.innerHeight) * 100 - p.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              const isNear = distance < 20

              return (
                <div
                  key={p.id}
                  className="absolute transition-all duration-300"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.size,
                    height: p.size,
                    transform: isNear
                      ? `translate(${dx * 2}px, ${dy * 2}px) scale(1.5)`
                      : "translate(0,0)",
                  }}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: p.color,
                      opacity: isNear ? 0.9 : 0.4,
                      boxShadow: `0 0 ${isNear ? 20 : 10}px ${p.color}`,
                      animation: `float ${p.duration}s ease-in-out infinite`,
                      animationDelay: `${p.delay}s`,
                    }}
                  />
                </div>
              )
            })}
        </div>
      </div>

      {/* 🧱 CONTENT */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}