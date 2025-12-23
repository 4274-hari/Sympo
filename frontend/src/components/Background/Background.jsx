import React from "react";

export default function BackgroundVideo() {
  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/Background/bg1.mp4" type="video/mp4" />
      </video>

      {/* Optional dark overlay */}
      <div className="fixed inset-0 bg-black/40 -z-10" />
    </>
  );
}