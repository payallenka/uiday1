import React from "react";

const Button = ({ styles }) => (
  <button type="button" className={`py-4 px-6 font-poppins font-medium text-[18px] text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-[10px] outline-none transition-all duration-300 ease-in-out hover:transform hover:translateY-[-2px] hover:scale-105 hover:shadow-lg hover:border-2 hover:border-green-900 ${styles}`}>
    Get Started
  </button>
);

export default Button;
