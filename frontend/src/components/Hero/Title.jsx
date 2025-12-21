import React, { useEffect, useState } from 'react'

const Title = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    // console.log(window.scrollY);
    
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const maxScroll = 800
  const progress = Math.min(scrollY / maxScroll,1)
 
  
  const offsetX = 30 * (1 - progress)
  const offsetY = 10 * progress
  const imageOpacity = 1 - progress * 2


  const minScale = 3     
  const maxScale = 8      
  const scale = minScale + (maxScale - minScale) * progress 
  console.log(scale );
  

  return (
    <div className="w-screen min-h-[200vh]  text-white">
   
      <div
        className="fixed left-1/2 top-1/2 flex flex-col items-center gap-6"
        style={{
          transform: `
            translate(
              calc(-50% + ${offsetX}vw),
              calc(-50% + ${offsetY}vh)
            )
          `
        }}
      >
        <h1
          className="font-bold font-['cursive'] tracking-wider text-center"
          style={{
            transform: `scale(${scale})`,
            transition: 'transform 0.1s linear',
          }}
        >
          COGNEBULA 2k26
        </h1>

        <img
          src="/favicon.png"
          alt="logo"
          className="w-80 h-80 transition-opacity duration-300"
          style={{ opacity: imageOpacity }}
        />
      </div>

      <section
  className="pt-[160vh] px-10 max-w-4xl mx-auto"
  style={{
    transform: `translateY(${10 * (1- progress)}px)`,
    opacity: progress,
    transition: 'transform 0.1s linear, opacity 0.1s linear'
  }}
>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta explicabo labore sunt mollitia. Vitae fugiat repellat, alias aliquam culpa animi illo minus, tempora voluptates ipsa magnam id optio quidem voluptatem.
 <p> </p>
</section>
    </div>
  )
}

export default Title;