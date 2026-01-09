import React, { useEffect, useState } from "react"

export function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }

      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) {
    return null
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Countdown title */}
      <div className="text-center lg:text-left">
        <p className="text-[#B6B5D8] text-sm uppercase tracking-[0.3em] font-semibold mb-2">Event Starts In</p>
        {/* <div className="relative h-[2px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r
              from-transparent
              via-[#CEA2FD]
              to-transparent
              bg-[length:400%_100%]
              animate-[beamFlow_2.5s_linear_infinite]"
          />
        </div> */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#CEA2FD] to-transparent" />
      </div>

      <div className="flex justify-center lg:justify-start gap-3">
        {timeUnits.map((unit, index) => (
          <div
            key={unit.label}
            className="relative group"
            style={{
              animation: `slideUp 0.6s ease-out ${index * 100}ms backwards`,
            }}
          >
            {/* Card glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4B0082]/20 to-[#663399]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Main card */}
            <div className="relative glass-card p-3 md:p-5 rounded-2xl min-w-[80px] sm:min-w-[95px] md:min-w-[120px] group-hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center gap-2">
                {/* Number */}
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-[#CEA2FD] via-[#8968CD] to-[#663399] tabular-nums leading-none relative">
                  {String(unit.value).padStart(2, "0")}
                  <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 bg-gradient-to-b from-[#CEA2FD] to-[#663399]" />
                </div>

                {/* Label */}
                <div className="text-[10px] sm:text-xs md:text-sm text-[#B6B5D8] uppercase tracking-[0.2em] font-semibold">
                  {unit.label}
                </div>
              </div>

              {/* Animated bottom accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-[#CEA2FD] to-[#8968CD] group-hover:w-3/4 transition-all duration-500" />

              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#CEA2FD]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#CEA2FD]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#CEA2FD]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#CEA2FD]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
      {/* </CHANGE> */}

      {/* Progress bar */}
      <div className="relative h-1 bg-[#301934]/50 rounded-full overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r
      from-transparent
      via-[#8264b0]
      to-transparent
      bg-[length:150%_100%]
      animate-[beamFlow_3s_linear_infinite]"
  />
</div>

    </div>
  )
}