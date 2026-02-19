"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Star, Calendar } from "lucide-react";

const Hero = () => {
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const [nextAvail, setNextAvail] = useState<string>("Loading...");

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
        <section className="w-full relative min-h-screen flex items-center overflow-x-hidden">
            {/* Background Split */}
            <div className="absolute inset-0 flex flex-col md:flex-row -z-20">
                <div className="w-full md:w-[55%] bg-white h-[50%] md:h-full" />
                <div className="w-full md:w-[45%] bg-accent h-[50%] md:h-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 min-h-screen pt-24 md:pt-0">
                {/* Text Content */}
                <div
                    ref={textRef}
                    className="flex-1 space-y-7 z-10 text-center md:text-left reveal-left"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full border border-primary/20">
                        <Star className="w-3.5 h-3.5 fill-primary" />
                        4.9 Rating · 500+ Happy Patients
                    </div>

                    <div className="space-y-2">
                        <span className="text-gray-400 text-xs tracking-widest uppercase block">
                            Rehabilitation &amp; Physiotherapy
                        </span>
                        <h1 className="text-5xl md:text-7xl text-gray-900 leading-[1.05]">
                            <span className="font-light block">Expert Care,</span>
                            <span className="font-bold text-primary block">Right Here</span>
                            <span className="font-light block">For You</span>
                        </h1>
                    </div>

                    <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0">
                        Rehab5 brings world-class physiotherapy and rehabilitation to your fingertips.
                        Book a consultation with our expert therapists and start your recovery journey today.
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center justify-center md:justify-start gap-8 pt-2">
                        {[
                            { val: "500+", label: "Patients" },
                            { val: "5+", label: "Specialities" },
                            { val: "98%", label: "Success Rate" },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <div className="text-2xl font-bold text-gray-800">{s.val}</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
                        <a
                            href="#services"
                            className="w-full sm:w-auto bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-600 px-8 py-4 rounded-lg font-medium transition-all text-sm tracking-wide shadow-sm"
                        >
                            Our Services
                        </a>
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
                            alt="Rehab5 Physiotherapist"
                            fill
                            className="object-contain object-bottom mix-blend-multiply"
                            priority
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>

                    {/* Floating card — positioned bottom-left, away from the face */}
                    <div className="absolute bottom-16 md:bottom-24 left-0 md:left-2 bg-white rounded-2xl shadow-2xl p-4 z-10 animate-float">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-700">Next Available</p>
                                <p className="text-xs text-primary font-bold">{nextAvail}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
