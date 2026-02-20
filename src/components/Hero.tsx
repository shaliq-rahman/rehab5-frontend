"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Zap, Calendar, Wifi } from "lucide-react";
import BookingModal from "./BookingModal";

const Hero = () => {
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const [nextAvail, setNextAvail] = useState<string>("Loading...");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            textRef.current?.classList.add("visible");
            imageRef.current?.classList.add("visible");
        }, 100);
        return () => clearTimeout(t);
    }, []);

    // Fetch the next available slot dynamically from the backend
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        fetch(`${apiUrl}/next-availability`)
            .then((r) => r.json())
            .then((data) => {
                if (data.display) setNextAvail(data.display);
            })
            .catch(() => {
                setNextAvail("Today, 9:00 AM");
            });
    }, []);

    return (
        <>
            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <section className="w-full relative min-h-screen flex items-center overflow-x-hidden">
                {/* Background Gradient */}
                <div
                    className="absolute inset-0 -z-20"
                    style={{ background: 'linear-gradient(to right, #ffffff 30%, #e8f5e9 60%, #c8e6c9 100%)' }}
                />

                <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 min-h-screen pt-32 md:pt-2">
                    {/* Text Content */}
                    <div
                        ref={textRef}
                        className="flex-1 space-y-7 z-10 text-center md:text-left reveal-left"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full border border-primary/20">
                            <Zap className="w-3.5 h-3.5 fill-primary" />
                            🇦🇪 &nbsp;First Telerehabilitation Platform in the UAE
                        </div>

                        <div className="space-y-2">
                            <span className="text-gray-400 text-xs tracking-widest uppercase block">
                                The Future of Rehabilitation — Here, Now
                            </span>
                            <h1 className="text-5xl md:text-7xl text-gray-900 leading-[1.05]">
                                <span className="font-light block">Recover Smarter,</span>
                                <span className="font-bold text-primary block">Anywhere with</span>
                                <span className="font-light block">Telerehab</span>
                            </h1>
                        </div>

                        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0">
                            Rehab5 pioneers telerehabitation in the UAE — bringing certified rehab specialists
                            directly to your screen. No commute, no waiting rooms. Just expert, results-driven
                            rehabilitation from the comfort of your home.
                        </p>

                        {/* Stats row */}
                        <div className="flex items-center justify-center md:justify-start gap-8 pt-2">
                            {[
                                { val: "500+", label: "Remote Sessions" },
                                { val: "#1", label: "In the UAE" },
                                { val: "98%", label: "Recovery Rate" },
                            ].map((s) => (
                                <div key={s.label} className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">{s.val}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="relative overflow-hidden group w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.03] shadow-[0_0_20px_rgba(36,163,172,0.4)] hover:shadow-[0_0_30px_rgba(36,163,172,0.6)] flex items-center justify-center animate-pulse-ring"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Wifi className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                    Start Your Online Session
                                </span>
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shine z-0"></div>
                            </button>
                        </div>
                    </div>

                    {/* Image */}
                    <div
                        ref={imageRef}
                        className="flex-1 relative w-full h-[50vh] md:h-screen flex items-end justify-center reveal-right"
                    >
                        <div className="relative w-full h-full md:w-[130%] md:h-[95%] md:right-[10%]">
                            <Image
                                src="/assets/doctor-female.png"
                                alt="Rehab5 Telerehabilitation Specialist"
                                fill
                                className="object-contain object-bottom"
                                priority
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        {/* Floating card */}
                        <div className="absolute bottom-16 md:bottom-24 left-0 md:left-2 bg-white rounded-2xl shadow-2xl p-4 z-10 animate-float">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-700">Next Online Slot</p>
                                    <p className="text-xs text-primary font-bold">{nextAvail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;
