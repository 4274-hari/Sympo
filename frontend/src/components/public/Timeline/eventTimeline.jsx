import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Terminal, Zap, Code, Coffee, Users } from "lucide-react"

const events = [
  {
    id: 1,
    time: "TBA",
    title: "Check-in Time",
    description: "Registration & Welcome",
    icon: <Users className="w-5 h-5 text-purple-400" />,
    type: "main",
  },
  {
    id: 2,
    time: "TBA",
    title: "Inauguration",
    description: "Grand Opening Ceremony",
    icon: <Zap className="w-5 h-5 text-purple-400" />,
    type: "main",
},
{
    id: 3,
    time: "TBA",
    title: "Event Commencement",
    description: "Tech & Non-Tech Tracks",
    icon: <Zap className="w-5 h-5 text-purple-400" />,
    tracks: [
      // { name: "Tech: AI Ethics", icon: <Terminal className="w-4 h-4" /> },
      // { name: "Non-Tech: Creative Design", icon: <Zap className="w-4 h-4" /> },
    ],
    type: "parallel",
  },
  {
    id: 4,
    time: "TBA",
    title: "Workshop",
    description: "Mind blowing AI Topics",
    icon: <Code className="w-5 h-5 text-purple-400" />,
    type: "workshop",
  },
  {
    id: 5,
    time: "TBA",
    title: "Lunch Break",
    description: "Networking & Refreshments",
    icon: <Coffee className="w-5 h-5 text-purple-400" />,
    type: "break",
  },
  {
    id: 6,
    time: "TBA",
    title: "Closing Ceremony",
    description: "Awards & Wrap-up",
    icon: <Zap className="w-5 h-5 text-purple-400" />,
    type: "main",
  },
]

export default function EventTimeline() {
  const containerRef = useRef(null)
  const [showAllMobile, setShowAllMobile] = useState(false)
  const MOBILE_LIMIT = 5
  const ITEMS_PER_ROW = 3
  const ROW_HEIGHT = 220 // vertical space per row (node + card)
  const rows = Math.ceil(events.length / ITEMS_PER_ROW)
  const timelineHeight = rows * ROW_HEIGHT

  const mobileEvents = showAllMobile
  ? events
  : events.slice(0, MOBILE_LIMIT)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  })

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const getPosition = (idx) => {
    const row = Math.floor(idx / ITEMS_PER_ROW)
    const col = idx % ITEMS_PER_ROW

    const xPositions = [100, 500, 900] // snake columns
    const y = row * ROW_HEIGHT + 80    // vertical spacing

    // Reverse direction every row (snake effect)
    const x =
        row % 2 === 0
        ? xPositions[col]
        : xPositions[ITEMS_PER_ROW - 1 - col]

    return { left: `${x}px`, top: `${y}px` }
  }

  return (
    <section ref={containerRef} className="relative px-6 overflow-hidden" id="schedules">
      <div className="max-w-6xl mx-auto relative">
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-[#CEA2FD] font-orbitron mb-4 text-center"
          >
            Symposium Roadmap
          </motion.h2>
          <p className="text-purple-400/60 font-orbitron text-sm tracking-widest uppercase italic text-center">
            "Timeline"
          </p>
        </div>

        <div
            className="hidden lg:block relative w-full mt-20"
            style={{ height: timelineHeight }}
            >
          <svg
            viewBox={`0 0 1000 ${timelineHeight}`}
            className="w-full h-full"
            preserveAspectRatio="none"
            fill="none"
            >
            {/* Background Path */}
            <path
              d="M 100,100 H 900 C 950,100 950,300 900,300 H 100 C 50,300 50,500 100,500 H 900"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <motion.path
              d="M 100,100 H 900 C 950,100 950,300 900,300 H 100 C 50,300 50,500 100,500 H 900"
              stroke="#A865B5" // Using 'Sunset Purple' from your palette
              strokeWidth="4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          {/* Event Nodes - Absolute Positioned along the snake */}
          {events.map((event, idx) => {
            const pos = getPosition(idx);

            return <TimelineNode key={event.id} event={event} style={pos} idx={idx} progress={scrollYProgress} total={events.length} />
          })}
        </div>

        <div className="lg:hidden space-y-12">
          {mobileEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative pl-8 border-l border-purple-500/30"
            >
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,101,181,0.5)]" />
              <div className="p-4 glass rounded-lg border border-white/10">
                <span className="text-purple-400 font-orbitron text-xs mb-2 block">{event.time}</span>
                <h3 className="text-white font-bold mb-1">{event.title}</h3>
                <p className="text-white/40 text-sm">{event.description}</p>
              </div>
            </motion.div>
          ))}
          {events.length > MOBILE_LIMIT && (
            <div className="flex justify-center mt-8 lg:hidden">
                <button
                onClick={() => setShowAllMobile((prev) => !prev)}
                className="px-6 py-2 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 text-sm font-orbitron hover:bg-purple-600/30 transition"
                >
                {showAllMobile ? "View Less" : "View More"}
                </button>
            </div>
            )}
        </div>
      </div>
    </section>
  )
}

function TimelineNode({ event, style, idx, progress, total }) {
  const ITEMS_PER_ROW = 3
  const TOTAL_ROWS = Math.ceil(total / ITEMS_PER_ROW)

  const row = Math.floor(idx / ITEMS_PER_ROW)
  const col = idx % ITEMS_PER_ROW

  // Each row gets equal scroll space
  const rowStart = row / TOTAL_ROWS

  // Small stagger inside row
  const colOffset = col * 0.01

  const threshold = rowStart + colOffset

  const opacity = useTransform(
    progress,
    [threshold, threshold + 0.2],
    [0, 1]
  )

  const scale = useTransform(
    progress,
    [threshold, threshold + 0.2],
    [0.6, 1]
  )

  return (
    <motion.div
      style={{ ...style, opacity, scale }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
    >
      {/* Node */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full glass border border-purple-500/50 flex items-center justify-center">
          {event.icon}
        </div>

        <div
          className={`absolute w-64 ${
            col === 1 ? "top-16" : "bottom-16"
          } left-1/2 -translate-x-1/2 text-center`}
        >
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
            <div className="text-xs text-purple-400 font-orbitron mb-1 font-bold">
              {event.time}
            </div>
            <h4 className="text-white font-bold mb-1">
              {event.title}
            </h4>
            <p className="text-[11px] text-white/40">
              {event.description}
            </p>

            {event.type === "parallel" && event.tracks.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
                {event.tracks?.map((track, i) => (
                  <div key={i} className="text-[10px] text-white/60 uppercase">
                    • {track.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
