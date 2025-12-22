import React from "react";
import FlipClock from "./Clock/Clock"
import Title from "./Title.jsx";

const Hero = () => {
   
    return(
      
           <div className="flex flex-row justify-around">
            <FlipClock />
            <Title/>
           </div>
       
    )
}

export default Hero;