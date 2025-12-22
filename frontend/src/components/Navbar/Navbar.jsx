import React from "react";
import logo from "../../Assets/NEWLOGO.png";
import styles from "./navbar.module.css"

const Navbar = () => {
  return (
    <section id="navbar" className="fixed top-0 left-0 w-full z-50">
      <nav
        className={`${styles.blurEffect} mx-6 mt-4
          flex justify-between items-center
          px-6 py-4
          rounded-2xl
          bg-[#9c2fa9]
        //   backdrop-blur-xl
        //   border border-black/30
        //   shadow-lg shadow-black/10
        //   transition-all duration-300`}
      >
        {/* Logo */}
        <a
          href="/"
          className="flex flex-row items-center justify-center select-none"
        >
          <img
            src={logo}
            alt="VEC Logo"
            className="w-[3.5rem] md:w-[4.6rem] h-auto object-contain"
          />

          <div className="text-center leading-tight mt-1">
            <span className="font-rome text-[0.5rem] md:text-[1rem] text-[#4B1E1E] dark:text-white block">
              VELAMMAL
            </span>
            <span className="font-rome text-[0.3rem] md:text-[0.65rem] text-gray-800 dark:text-gray-200 block tracking-wide">
              ENGINEERING COLLEGE
            </span>
            <span className="font-rome text-[0.2rem] md:text-[0.45rem] text-gray-700 dark:text-gray-300 italic block">
              The Wheel of Knowledge rolls on!
            </span>
            <span className="font-rome text-[0.2rem] md:text-[0.45rem] text-gray-700 dark:text-gray-300 italic block">
              (An Autonomous Institution)
            </span>
          </div>
        </a>

        {/* Nav Items */}
        <ul className="flex gap-10 items-center font-orbitron">
          {["Home", "About", "Events", "Schedules", "Contact"].map((nav, i) => (
            <li
              key={i}
              className="
                relative
                text-xl font-medium
                cursor-pointer
                transition-all duration-300
                after:content-['']
                after:absolute after:left-0 after:-bottom-1
                after:h-[2px] after:w-0
                after:bg-white
                after:transition-all after:duration-300
                hover:after:w-full
                text-[#ffffff]
                font-orbitron
              "
            >
              {nav}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default Navbar;
