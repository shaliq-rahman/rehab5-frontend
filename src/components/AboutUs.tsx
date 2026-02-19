"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

const highlights = [
    "Personalised rehabilitation plans for every patient",
    "Certified physiotherapists with 5+ years experience",
    "State-of-the-art equipment and evidence-based methods",
];

const AboutUs = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) =>
                        el.classList.add("visible")
                    );
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="about" ref={sectionRef} className="w-full max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28 flex flex-col md:flex-row items-center gap-14">
            {/* Image */}
            <div className="flex-1 relative h-[400px] md:h-[520px] w-full rounded-2xl overflow-hidden shadow-2xl reveal-left">
                <Image
                    src="/assets/consultation.png"
                    alt="Rehab5 Consultation"
                    fill
                    className="object-cover"
                />
                {/* Overlay card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Our Commitment</p>
                    <p className="text-sm text-gray-700 font-medium">Compassionate care that puts your recovery first, every step of the way.</p>
                </div>
            </div>

            {/* Text */}
            <div className="flex-1 space-y-7 reveal-right" style={{ transitionDelay: "150ms" }}>
                <div>
                    <span className="text-primary text-xs font-semibold uppercase tracking-widest">Who We Are</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 leading-snug">
                        Rehab5 — Where Recovery<br />
                        <span className="text-primary">Meets Excellence</span>
                    </h2>
                </div>

                <p className="text-gray-500 leading-relaxed">
                    Rehab5 is a leading physiotherapy and rehabilitation center dedicated to helping patients recover faster,
                    move better, and live pain-free. Our multidisciplinary team combines the latest evidence-based techniques
                    with personalised care plans to ensure the best outcomes.
                </p>

                <ul className="space-y-3">
                    {highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            {h}
                        </li>
                    ))}
                </ul>

                <a
                    href="#services"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all group"
                >
                    Explore Our Services
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="pt-2">
                    <div className="grid grid-cols-6 gap-1 w-fit">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
