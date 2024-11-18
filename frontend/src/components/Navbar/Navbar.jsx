import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/logo.png';
import { IoReorderThree } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const Navbar = () => {
    const [MobileNav, setMobileNav] = useState(false);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Categories", path: "/categories" },
        { name: "All Podcasts", path: "/all-podcasts" },
        { name: "Profile", path: "/profile" },
    ];

    return (
        <nav className="px-4 md:px-8 lg:px-12 py-2 relative">
            {/* Desktop Navbar */}
            <div className="flex items-center justify-between">
                {/* Logo Section */}
                <div className="logo brand-name w-2/6 flex items-center gap-4">
                    <img src={logo} alt="PodDeck Logo" className="h-10 w-10" />
                    <Link to="/" className="text-2xl font-bold">PodDeck</Link>
                </div>

                {/* Links for Desktop */}
                <div className="hidden w-2/6 lg:flex items-center">
                    {navLinks.map((item, i) => (
                        <Link key={i} to={item.path} className="ms-4 hover:font-semibold transition-all duration-300">
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Buttons for Desktop */}
                <div className="hidden w-2/6 lg:flex items-center justify-end">
                    <Link to="/login" className="px-6 py-3 border border-black rounded-full">Login</Link>
                    <Link to="/signup" className="ms-4 px-5 py-3 bg-black text-white rounded-full">Signup</Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="w-4/6 flex items-center justify-end lg:hidden">
                    <button className="text-4xl" onClick={() => setMobileNav(!MobileNav)}>
                        <IoReorderThree />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {MobileNav && (
                <div className="fixed top-0 left-0 w-full h-screen bg-blue-100 z-50">
                    {/* Close Button */}
                    <div className="p-4 flex justify-end">
                        <button onClick={() => setMobileNav(false)}
                            className="text-3xl p-2 rounded-full bg-black text-white">
                            <RxCross2 />
                        </button>
                    </div>

                    {/* Mobile Links */}
                    <div className="h-full flex flex-col items-center justify-center">
                        {navLinks.map((item, i) => (
                            <Link
                                key={i}
                                to={item.path}
                                className="mb-6 text-3xl hover:font-semibold"
                                onClick={() => setMobileNav(false)}>
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            to="/login"
                            className="mb-6 text-3xl hover:font-semibold"
                            onClick={() => setMobileNav(false)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="mb-6 text-3xl hover:font-semibold"
                            onClick={() => setMobileNav(false)}>
                            Signup
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
