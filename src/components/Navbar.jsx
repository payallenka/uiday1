import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";

import Logo from "./ui/Logo";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// Navigation links array
const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

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
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <a href="#" className="text-primary hover:text-primary/90">
            <Logo />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                size="sm"
                className={`text-sm bg-neutral-800 text-white hover:bg-neutral-700 transition-colors ${active === link.label ? "bg-neutral-700" : ""}`}
                onClick={() => setActive(link.label)}
                asChild
              >
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
          </div>
        </div>

        {/* Right side (auth buttons) */}
        {!loading && (
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button size="sm" className="text-sm bg-neutral-800 text-white hover:bg-neutral-700 transition-colors">Profile</Button>
                </Link>
                <Button size="sm" className="text-sm bg-neutral-800 text-white hover:bg-neutral-700 transition-colors" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="text-sm bg-neutral-800 text-white hover:bg-neutral-700 transition-colors">Sign In</Button>
              </Link>
            )}
          </div>
        )}

        {/* Mobile menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="group size-8 md:hidden" variant="ghost" size="icon">
              <svg
                className="pointer-events-none"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12H20" />
                <path d="M4 12H20" className="translate-y-[7px]" />
                <path d="M4 12H20" className="-translate-y-[7px]" />
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-36 p-1 md:hidden flex flex-col gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                size="sm"
                className="bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                asChild
                onClick={() => setActive(link.label)}
              >
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button size="sm" className="bg-neutral-800 text-white hover:bg-neutral-700 transition-colors" asChild>
                        <a>Profile</a>
                      </Button>
                    </Link>
                    <Button size="sm" className="bg-neutral-800 text-white hover:bg-neutral-700 transition-colors" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/auth">
                    <Button size="sm" className="bg-neutral-800 text-white hover:bg-neutral-700 transition-colors">Sign In</Button>
                  </Link>
                )}
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
