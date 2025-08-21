import { useState } from "react";

import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-6 justify-between items-center bg-gradient-to-r from-green-200 to-green-400 text-black">
      <img src={logo} alt="hoobank" className="w-[124px] h-[32px]" />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 hover:text-gray-100 hover:transform hover:translateY-[-3px] hover:scale-105 hover:shadow-lg hover:border-2 hover:border-green-900 rounded-lg px-4 py-2 ${
              active === nav.title ? "text-black bg-white bg-opacity-20 border-2 border-green-800 rounded-lg" : "text-gray-700"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-6"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`} className="block w-full h-full">{nav.title}</a>
          </li>
        ))}
      </ul>

      <button className="py-3 px-6 ml-8 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-lg font-semibold transition-all duration-300 ease-in-out hover:from-teal-600 hover:to-teal-700 hover:transform hover:translateY-[-2px] hover:scale-105 hover:shadow-xl hover:border-2 hover:border-green-800 bounce-in delay-700">
        Get Started
      </button>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 backdrop-blur-lg bg-black/20 border border-white/10 absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl shadow-xl`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
