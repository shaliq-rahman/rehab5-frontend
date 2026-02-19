"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import BookingModal from "./BookingModal";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "#about", label: "About Us" },
        { href: "#services", label: "Services" },
        { href: "#how-it-works", label: "How It Works" },
        { href: "#doctors", label: "Doctors" },
        { href: "#testimonials", label: "Testimonials" },
    ];

    return (
        <>
            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <nav
                className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled
                        ? "bg-white/95 backdrop-blur-md shadow-md py-3"
                        : "bg-transparent py-5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <div className="relative w-[100px] h-[38px] md:w-[160px] md:h-[55px]">
                        <Image
                            src="/assets/logo.png"
                            alt="REHAB 5 Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:text-primary transition-colors relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:block">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20"
                        >
                            Book Appointment
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-600 p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white shadow-xl border-t px-6 py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-600 hover:text-primary py-1 text-sm font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button
                            onClick={() => { setIsMenuOpen(false); setIsModalOpen(true); }}
                            className="w-full bg-primary text-white py-3 rounded-lg text-sm font-medium mt-2"
                        >
                            Book Appointment
                        </button>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
