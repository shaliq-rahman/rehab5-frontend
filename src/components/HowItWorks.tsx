"use client";

import { useEffect, useRef } from "react";
import { Calendar, Video, ClipboardList } from "lucide-react";

const steps = [
    {
        icon: Calendar,
        step: "01",
        title: "Book Online in Seconds",
        description: "Choose your preferred date, time, and telerehab specialist. Instant confirmation — no waiting rooms, no travel, no hassle.",
    },
    {
        icon: Video,
        step: "02",
        title: "Join Your Live Session",
        description: "Connect with your specialist via secure HD video from your home, office, or anywhere in the UAE. Just click and start recovering.",
    },
    {
        icon: ClipboardList,
        step: "03",
        title: "Your Digital Recovery Plan",
        description: "Receive a personalised telerehab program with guided exercises and progress tracking — all managed online for maximum outcomes.",
    },
];

const HowItWorks = () => {
    const sectionRef = useRef<HTMLElement>(null);

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
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="how-it-works" ref={sectionRef} className="w-full py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="text-center space-y-3 mb-16 reveal">
                    <span className="text-primary text-xs font-semibold uppercase tracking-widest">Simple &amp; 100% Remote</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        How Telerehab <span className="text-primary">Works</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Getting started with Rehab5 takes minutes. Three steps to begin your recovery — entirely online.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Connecting line (desktop) */}
                    <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-primary/20" />

                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.step}
                                className="reveal-scale flex flex-col items-center text-center relative"
                                style={{ transitionDelay: `${i * 150}ms` }}
                            >
                                {/* Step circle */}
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center z-10 relative">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center z-20">
                                        {i + 1}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center mt-14 reveal" style={{ transitionDelay: "400ms" }}>
                    <a
                        href="#doctors"
                        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/25"
                    >
                        Meet Our Telerehab Specialists
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
