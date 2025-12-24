import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./stormbreaker.module.css";

import stormbreaker from "../../assets/break.png";
import thanos from "../../assets/thanos.png";

gsap.registerPlugin(ScrollTrigger);

export default function StormbreakerCinematic() {
  const containerRef = useRef(null);
  const axeRef = useRef(null);
  const thanosRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Axe movement
      gsap.fromTo(
        axeRef.current,
        {
          x: -150,
          y: -150,
          rotate: -45,
          opacity: 0,
        },
        {
          x: "70vw",
          y: "60vh",
          rotate: 720,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        }
      );

      // Thanos shake on hit
      gsap.to(thanosRef.current, {
        x: -15,
        repeat: 6,
        yoyo: true,
        duration: 0.06,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.cinematic}>
      <img ref={axeRef} src={stormbreaker} className={styles.axe} />
      <img ref={thanosRef} src={thanos} className={styles.thanos} />
    </div>
  );
}
