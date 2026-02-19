"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="absolute top-0 left-0 right-0 z-50 w-full py-4 md:py-8 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <div className="relative w-[100px] h-[40px] md:w-[300px] md:h-[90px]">
                        <Image
                            src="/assets/logo.png"
                            alt="REHAB 5 Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-500">
                    <Link href="#about" className="hover:text-primary transition-colors">About Us</Link>
                    <Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
                    <Link href="#doctors" className="hover:text-primary transition-colors">Doctors</Link>
                    <Link href="#testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-600 p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg p-4 flex flex-col gap-4 border-t z-50">
                    <Link
                        href="#about"
                        className="text-gray-600 hover:text-primary py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About Us
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="text-gray-600 hover:text-primary py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        How It Works
                    </Link>
                    <Link
                        href="#doctors"
                        className="text-gray-600 hover:text-primary py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Doctors
                    </Link>
                    <Link
                        href="#testimonials"
                        className="text-gray-600 hover:text-primary py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Testimonials
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
