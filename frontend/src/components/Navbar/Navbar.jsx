import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoReorderThreeOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import PodStar from "../../assets/podStar.png";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [MobileNav, setMobileNav] = useState(false);
  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Categories",
      path: "/categories",
    },
    {
      name: "All Podcasts",
      path: "/all-podcasts",
    },
  ];

  const closeMobileNav = () => setMobileNav(false);

  return (
    <nav className="px-4 md:px-8 bg-zinc-700 lg:px-12 py-2 relative z-[1]">
      <div className="flex items-center text-white justify-between">
        <div className="logo brand-name w-2/6 flex items-center gap-2">
          <img
            src={PodStar}
            alt="PodStar"
            className="h-12 transition-transform duration-100 hover:scale-110"
          />
          <Link to="/" className="text-3xl font-bold">
            PodStar
          </Link>
        </div>
        <div className="hidden w-2/6 lg:flex items-center justify-center text-xl">
          {navLinks.map((items, i) => (
            <Link
              key={i}
              to={items.path}
              className="ms-4 hover:font-semibold transition-all duration-300"
            >
              {items.name}
            </Link>
          ))}
        </div>
        <div className="hidden w-2/6 lg:flex items-center justify-end">
          {!isLoggedIn && (
            <>
              {" "}
              <Link
                to="/login"
                className="px-6 py-3 border bg-white text-black border border-black font-semibold rounded-full"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="ms-4 px-6 py-3 bg-black text-black bg-white border border-black font-semibold rounded-full"
              >
                Signup
              </Link>
              {/* Admin Login Link */}
              <Link
                to="/admin/login" // The route you want to navigate to for admin login
                className="ms-4 px-6 py-3 bg-gray-800 text-white border border-gray-600 font-semibold rounded-full"
              >
                Admin Login
              </Link>
            </>
          )}
          {isLoggedIn && (
            <Link
              to="/profile"
              className="ms-4 px-6 py-3 bg-black text-white rounded-full"
            >
              Profile
            </Link>
          )}
        </div>
        <div className="w-4/6 flex items-center justify-end lg:hidden z-[2]">
          <button
            className={`text-4xl ${
              MobileNav ? "rotate-360" : " rotate-180"
            } transition-all duration-300`}
            onClick={() => setMobileNav(!MobileNav)}
          >
            {MobileNav ? <RxCross2 /> : <IoReorderThreeOutline />}
          </button>
        </div>
      </div>

      {/* Mobile Nav  */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-blue-100 lg:hidden ${
          MobileNav ? "translate-y-0" : "translate-y-[-100%] hidden"
        } transition-transform duration-500 ease-in-out `}
      >
        <div className="h-full flex flex-col items-center justify-center">
          {navLinks.map((items, i) => (
            <Link
              key={i}
              to={items.path}
              className="mb-12 text-3xl hover:font-semibold transition-all duration-300"
              onClick={closeMobileNav}
            >
              {items.name}
            </Link>
          ))}
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="mb-12 text-3xl hover:font-semibold transition-all duration-300"
                onClick={closeMobileNav}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="mb-12 text-3xl hover:font-semibold transition-all duration-300"
                onClick={closeMobileNav}
              >
                Signup
              </Link>
            </>
          ) : (
            <Link
              to="/profile"
              className="mb-12 text-3xl hover:font-semibold transition-all duration-300"
              onClick={closeMobileNav}
            >
              Profile
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
