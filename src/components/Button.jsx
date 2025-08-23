import React from "react";


const Button = ({ styles, children, ...props }) => (
  <button
    type="button"
    className={`py-4 px-6 font-poppins font-medium text-[18px] text-[#fff] bg-neutral-800 hover:bg-neutral-700 rounded-[10px] outline-none transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg border border-neutral-700 ${styles}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
