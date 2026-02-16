import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Switch from "../DarkModeToggle";
import { jwtDecode } from "jwt-decode";
import awaazLogo from "../assets/awaaz-logo.svg";
import {
  Info,
  Phone,
  Users,
  User,
  LogOut,
  Shield,
  LayoutDashboard,
  BookOpen,
  Menu,
  X,
  AlertTriangle,
  Vote,
  Map,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const userMenuRef = useRef(null);

  const closeMobile = (cb) => {
    setMobileMenuOpen(false);
    cb?.();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.dispatchEvent(new Event("storage"));
    setUserMenuOpen(false);
    navigate("/");
  };

  // keep token in sync
  useEffect(() => {
    const sync = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e) => e.key === "Escape" && setMobileMenuOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileMenuOpen]);

  let isAdmin = false;
  let isOfficer = false;
  try {
    if (token) {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === "admin";
      isOfficer = decoded.role === "officer";
    }
  } catch {
    /* invalid token — ignore */
  }

  const navLinks = [
    { title: "About", href: "/about", icon: Info },
    { title: "Contact", href: "/contact", icon: Phone },
    { title: "Contributors", href: "/contributors", icon: Users },
    { title: "Voting", href: "/voting-system", icon: Vote },
    { title: "Issue Map", href: "/user-map", icon: Map },
    { title: "Feedback", href: "/feedback", icon: AlertTriangle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/");
            }}
            className="flex items-center gap-2.5"
          >
            <img src={awaazLogo} alt="Awaaz" className="h-9 w-9" />
            <div className="leading-tight">
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                Awaaz
              </span>
              <span className="block text-[10px] text-gray-500 dark:text-gray-400">
                आवाज़
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* SOS — desktop */}
            <button
              onClick={() => navigate("/sos")}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              SOS
            </button>

            {/* Dark mode toggle */}
            <div className="hidden lg:flex items-center">
              <Switch />
            </div>

            {/* User dropdown — desktop */}
            <div className="hidden lg:block relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="User menu"
              >
                <User className="w-4 h-4" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/civic-education");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <BookOpen className="w-4 h-4" />
                    Civic Education
                  </button>

                  {!token ? (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <User className="w-4 h-4" />
                      Login
                    </button>
                  ) : (
                    <>
                      <hr className="my-1 border-gray-100 dark:border-gray-800" />
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (isAdmin) navigate("/admin");
                          else if (isOfficer) navigate("/officer/dashboard");
                          else navigate("/user/dashboard");
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {isAdmin ? (
                          <Shield className="w-4 h-4" />
                        ) : (
                          <LayoutDashboard className="w-4 h-4" />
                        )}
                        Dashboard
                      </button>
                      <hr className="my-1 border-gray-100 dark:border-gray-800" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger — mobile */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/20 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="lg:hidden fixed inset-x-0 top-16 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((item) => {
                const active = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.href}
                    onClick={() => closeMobile()}
                    className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md ${
                      active
                        ? "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.title}
                  </Link>
                );
              })}

              <hr className="my-3 border-gray-200 dark:border-gray-800" />

              {token && (
                <>
                  <button
                    onClick={() => closeMobile(() => navigate("/profile"))}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() =>
                      closeMobile(() => {
                        if (isAdmin) navigate("/admin");
                        else if (isOfficer) navigate("/officer/dashboard");
                        else navigate("/user/dashboard");
                      })
                    }
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                </>
              )}

              <button
                onClick={() => closeMobile(() => navigate("/sos"))}
                className="w-full flex items-center justify-center gap-2 px-3 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Emergency SOS
              </button>

              {token ? (
                <button
                  onClick={() => closeMobile(handleLogout)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium text-red-600 border border-red-200 dark:border-red-900 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => closeMobile(() => navigate("/login"))}
                    className="flex-1 py-3 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => closeMobile(() => navigate("/signup"))}
                    className="flex-1 py-3 text-sm font-semibold rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                <span className="text-xs text-gray-400">Theme</span>
                <Switch />
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default Navbar;
