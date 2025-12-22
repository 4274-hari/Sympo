import React, { useEffect, useState } from "react"

const EVENT_TIME = Date.now() + 38 * 24 * 60 * 60 * 1000

function getTimeLeft() {
  const total = Math.max(0, EVENT_TIME - Date.now())

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}

function FlipCard({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[160px] h-[160px] rounded-2xl overflow-hidden
        bg-white/10 backdrop-blur-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_30px_rgba(0,0,0,0.6)]">

        {/* Top */}
        <div className="absolute top-0 h-1/2 w-full bg-gradient-to-b from-white/25 to-white/5" />

        {/* Bottom */}
        <div className="absolute bottom-0 h-1/2 w-full bg-black/15" />

        {/* Divider */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/20" />

        {/* Number */}
        <span className="absolute inset-0 flex items-center justify-center
          text-white text-6xl font-semibold font-mono">
          {String(value).padStart(2, "0")}
        </span>
      </div>

      <span className="mt-3 text-xs tracking-[0.25em] text-yellow-400 font-mono">
        {label}
      </span>
    </div>
  )
}

export default function FlipClock() {
  const [time, setTime] = useState(getTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-h-full w-[700px ]   flex   justify-center
      bg-[radial-gradient(circle_at_top,_#000000,_#000)]">

      <div className="flex flex-col mt-[300px] ml-40 items-center  ">
        <h1 className="mb-10 text-white text-lg tracking-[0.3em] font-mono">
          COMING SOON ....
        </h1>

        <div className="flex gap-6">
          <FlipCard value={time.days} label="DAYS" />
          <FlipCard value={time.hours} label="HOURS" />
          <FlipCard value={time.minutes} label="MINUTES" />
          <FlipCard value={time.seconds} label="SECONDS" />
        </div>
        <img src="/robot2.webp" alt="robot image " width={400} height={400} />
      </div>
    

    </div>
  )
}
