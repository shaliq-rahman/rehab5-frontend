"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import BookingModal from "./BookingModal";

const doctors = [
    {
        name: "Dr. Sarah Mitchell",
        role: "Senior Physiotherapist",
        specialty: "Sports & Orthopaedic",
        experience: "8 Years",
        rating: 4.9,
        reviews: 142,
        image: "/assets/doctor-sarah.png",
    },
    {
        name: "Dr. Arjun Patel",
        role: "Rehabilitation Specialist",
        specialty: "Neurological Rehab",
        experience: "6 Years",
        rating: 4.8,
        reviews: 98,
        image: "/assets/doctor-arjun.png",
    },
    {
        name: "Dr. Priya Nair",
        role: "Pediatric Physiotherapist",
        specialty: "Pediatric Rehab",
        experience: "5 Years",
        rating: 4.9,
        reviews: 76,
        image: "/assets/doctor-priya.png",
    },
    {
        name: "Dr. James Okafor",
        role: "Pain Management Expert",
        specialty: "Chronic Pain & TENS",
        experience: "10 Years",
        rating: 5.0,
        reviews: 201,
        image: "/assets/doctor-james.png",
    },
];

const Doctors = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current?.querySelectorAll(".reveal, .reveal-scale").forEach((el) =>
                        el.classList.add("visible")
                    );
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="doctors" ref={sectionRef} className="w-full py-20 md:py-28 bg-slate-50/60">
            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="text-center space-y-3 mb-14 reveal">
                    <span className="text-primary text-xs font-semibold uppercase tracking-widest">Our Team</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Meet Our Expert <span className="text-primary">Therapists</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Certified professionals passionate about helping you recover and thrive.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {doctors.map((doc, i) => (
                        <div
                            key={doc.name}
                            onClick={() => setIsModalOpen(true)}
                            className="reveal-scale card-hover bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-pointer"
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            {/* Photo */}
                            <div className="relative h-52 bg-gradient-to-br from-primary/10 to-slate-100 overflow-hidden">
                                <Image
                                    src={doc.image}
                                    alt={doc.name}
                                    fill
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold tracking-wide">Book Session</span>
                                </div>
                            </div>

                            <div className="p-5 space-y-1.5">
                                <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                    {doc.name}
                                </h3>
                                <p className="text-xs text-primary font-medium">{doc.role}</p>
                                <p className="text-xs text-gray-400">{doc.specialty}</p>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-semibold text-gray-700">{doc.rating}</span>
                                        <span className="text-xs text-gray-400">({doc.reviews})</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{doc.experience}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Doctors;
