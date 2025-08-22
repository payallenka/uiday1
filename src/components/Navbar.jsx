import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";

import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <nav className="w-full flex py-6 justify-between items-center bg-gradient-to-r from-green-200 to-green-400 text-black">
      <img src={logo} alt="hoobank" className="w-[124px] h-[32px]" />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 hover:text-white hover:shadow-lg hover:border-2 hover:border-green-900 rounded-lg px-4 py-2 ${
              active === nav.title ? "text-black bg-white bg-opacity-20 border-2 border-green-800 rounded-lg" : "text-gray-700"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-6"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`} className="block w-full h-full">{nav.title}</a>
          </li>
        ))}
      </ul>

      {!loading && (
        <div className="flex items-center gap-3">
          {user ? (
            // Logged in user buttons
            <>
              <Link to="/dashboard">
                <button className="py-2 px-4 bg-white bg-opacity-20 text-gray-800 rounded-lg font-semibold transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 hover:text-white hover:shadow-lg hover:border-2 hover:border-green-900 border border-green-700">
                  Profile
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="py-2 px-4 bg-white bg-opacity-20 text-gray-800 rounded-lg font-semibold transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 hover:text-white hover:shadow-lg hover:border-2 hover:border-green-900 border border-green-700"
              >
                Logout
              </button>
            </>
          ) : (
            // Guest user button
            <Link to="/auth">
              <button className="py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-lg font-semibold transition-all duration-300 ease-in-out hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:border-2 hover:border-green-900 bounce-in delay-700">
                Get Started
              </button>
            </Link>
          )}
        </div>
      )}

      <div className="sm:hidden flex flex-1 justify-end items-center ml-4">
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
                className={`font-poppins font-medium cursor-pointer text-[16px] transition-all duration-300 ease-in-out hover:text-white hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 rounded-lg px-2 py-1 ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
            
            {/* Mobile auth buttons */}
            {!loading && (
              <li className="mt-4 pt-4 border-t border-white/20 w-full">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <Link to="/dashboard">
                      <button className="w-full py-2 px-4 bg-white bg-opacity-20 text-white rounded-lg font-medium text-sm transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 hover:shadow-lg">
                        Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-red-500 text-white rounded-lg font-medium text-sm transition-all duration-300 ease-in-out hover:from-green-700 hover:to-green-800 hover:shadow-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <button className="w-full py-2 px-4 bg-teal-500 text-white rounded-lg font-medium text-sm transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 hover:shadow-lg">
                      Get Started
                    </button>
                  </Link>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
