import React, { useEffect, useState } from 'react'

const Title = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ---------------- SCROLL CONFIG ---------------- */

  const scaleEnd = 500        // scale stops here
  const releaseEnd = 1400     // text fully goes up & fades

  /* ---------------- PROGRESS VALUES ---------------- */

  const scaleProgress = Math.min(scrollY / scaleEnd, 1)

  const extraScroll = Math.max(scrollY - scaleEnd, 0)
  const releaseProgress = Math.min(
    extraScroll / (releaseEnd - scaleEnd),
    1
  )

  /* ---------------- SCALE LOGIC ---------------- */

  const minScale = 3
  const maxScale = 7
  const scale =
    minScale + (maxScale - minScale) * scaleProgress

  /* ---------------- POSITION LOGIC ---------------- */

  const offsetX = 30 * (1 - scaleProgress)

  const offsetY =
    scaleProgress < 1
      ? -10 * scaleProgress
      : -10 + extraScroll * 0.1   // ✅ ONE CHANGE (scroll-like movement)

  /* ---------------- BLEND EFFECT ---------------- */

  const textOpacity = 1 - releaseProgress
  const imageOpacity = 1 - scaleProgress * 2

  /* ---------------- JSX ---------------- */

  return (
    <div className="w-screen min-h-[200vh] text-white bg-black">
      
      {/* CENTER TITLE */}
      <div
        className="fixed left-1/2 top-[55%] flex flex-col items-center gap-6 pointer-events-none"
        style={{
          transform: `
            translate(
              calc(-50% + ${offsetX}vw),
              calc(-50% - ${offsetY}vh)
            )
          `
        }}
      >
        <h1
          className="font-semibold font-['Metal_Mania',cursive]   text-center  
      tracking-[0.35em]"
          style={{
            transform: `scale(${scale})`,
            opacity: textOpacity,
            transition:
              'transform 0.2s linear, opacity 0.2s linear',
             
          }}
        >
          COGNEBULA 2k26
        </h1>

        <img
          src="/favicon.png"
          alt="logo"
          className="w-80 h-80"
          style={{
            opacity: imageOpacity,
            transition: 'opacity 0.2s linear',
          }}
        />
      </div>

      {/* CONTENT AFTER BLEND */}
      <section
        className="pt-[140vh] px-10 max-w-4xl mx-auto text-white"
        style={{
          transform: `translateY(${10 * (0 - releaseProgress)}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        <p className="text-white">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Soluta explicabo labore sunt mollitia. Vitae fugiat repellat,
          alias aliquam culpa animi illo minus, tempora voluptates ipsa
          magnam id optio quidem voluptatem.
        </p>
      </section>
    </div>
  )
}

export default Title
