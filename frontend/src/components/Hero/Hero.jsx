import React from "react";
import FlipClock from "./Clock/flipclock.jsx";
import Title from "./Title.jsx";

const Hero = () => {
   
    return(
      
           <div className="flex flex-row justify-evenly  ">
            <FlipClock />
            <Title />
           </div>
       
    )
}

export default Hero;