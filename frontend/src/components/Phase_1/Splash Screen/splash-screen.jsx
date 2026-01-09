import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import logo from "../../Assets/cognebula_logo.png"

const LottieAnimation = () => (
  <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none scale-110">
    <iframe
      src="https://lottie.host/embed/84478160-c65a-470a-8664-88404a377759/8K59X4X9uW.json"
      className="w-full h-full border-0"
      title="AI Robot Animation"
    />
  </div>
)

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [glitchText, setGlitchText] = useState("COGNEBULA")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 6000) // Slightly longer to appreciate the AI robot

    const glitchInterval = setInterval(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
      const newText = "COGNEBULA"
        .split("")
        .map((char, i) => (Math.random() > 0.9 ? chars[Math.floor(Math.random() * chars.length)] : char))
        .join("")
      setGlitchText(newText)
      setTimeout(() => setGlitchText("COGNEBULA"), 50)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(glitchInterval)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.2, filter: "blur(30px) brightness(2)" }}
          transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* AI Robot/Neural Layer */}
          <LottieAnimation />

          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-purple-500/5 to-transparent h-[100px] w-full animate-scanline" />

          {/* Kinetic Energy Particles (Enhanced) */}
          <div className="absolute inset-0 z-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: "50%", y: "50%", opacity: 0, scale: 0 }}
                animate={{
                  x: [`${50}%`, `${50 + (Math.random() - 0.5) * 150}%`],
                  y: [`${50}%`, `${50 + (Math.random() - 0.5) * 150}%`],
                  opacity: [0, 1, 0],
                  scale: [0, Math.random() * 2 + 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
                className="absolute w-[2px] h-[2px] bg-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "anticipate" }}
              className="relative mb-8"
            >
              {/* Fractal Energy Rings */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: i % 2 === 0 ? 360 : -360,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    rotate: { duration: 8 + i * 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                  }}
                  className="absolute inset-[-40px] rounded-full border border-purple-500/30"
                  style={{
                    padding: `${i * 15}px`,
                    borderWidth: i === 0 ? "2px" : "1px",
                    borderStyle: i % 2 === 0 ? "solid" : "dashed",
                    boxShadow: i === 0 ? "0 0 40px rgba(168,85,247,0.2)" : "none",
                  }}
                />
              ))}

              <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-purple-400/60 p-1 bg-black group">
                <img
                  src={logo}
                  alt="Cognebula Wolf Logo"
                  fill
                  className="object-cover scale-110 group-hover:scale-125 transition-transform duration-1000"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent mix-blend-overlay" />
              </div>
            </motion.div>

            <div className="relative text-center">
              <motion.div
                initial={{ opacity: 0, letterSpacing: "1em" }}
                animate={{ opacity: 1, letterSpacing: "0.4em" }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="relative"
              >
                <h1 className="text-5xl md:text-8xl font-black text-white uppercase font-sans drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  {glitchText}
                </h1>
                {/* Chromatic Aberration Layers */}
                <h1 className="absolute inset-0 text-5xl md:text-8xl font-black text-red-500/30 uppercase font-sans animate-glitch-1 pointer-events-none">
                  {glitchText}
                </h1>
                <h1 className="absolute inset-0 text-5xl md:text-8xl font-black text-cyan-500/30 uppercase font-sans animate-glitch-2 pointer-events-none">
                  {glitchText}
                </h1>
              </motion.div>
            </div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1.5 }}
              className="h-[1px] w-[200px] mt-4 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-6 text-purple-200 font-medium tracking-[0.5em] text-[10px] md:text-sm uppercase italic"
            >
              "Where Intelligence Meets the Cosmos"
            </motion.p>
          </div>

          <div className="absolute bottom-10 left-10 flex flex-col gap-2">
            <div className="h-1 w-32 bg-purple-900/50 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 5.5, ease: "linear" }}
                className="h-full w-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
              />
            </div>
            <span className="text-[8px] font-mono text-purple-500/50 uppercase tracking-widest">
              Loading Neural Core...
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
