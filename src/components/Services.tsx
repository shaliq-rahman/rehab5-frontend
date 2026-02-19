"use client";

import { useEffect, useRef } from "react";
import { Activity, Zap, Heart, Brain, Baby, Bone } from "lucide-react";

const services = [
    {
        icon: Activity,
        title: "Physiotherapy",
        description: "Targeted exercises and manual therapy to restore movement, reduce pain, and improve physical function.",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: Zap,
        title: "Sports Rehabilitation",
        description: "Specialised recovery programs for athletes — from acute injury management to performance optimisation.",
        color: "bg-orange-50 text-orange-500",
    },
    {
        icon: Bone,
        title: "Post-Surgery Recovery",
        description: "Structured rehabilitation following orthopaedic or joint replacement surgeries to regain full function.",
        color: "bg-purple-50 text-purple-600",
    },
    {
        icon: Heart,
        title: "Pain Management",
        description: "Evidence-based techniques to manage chronic and acute pain including dry needling, TENS, and ultrasound therapy.",
        color: "bg-red-50 text-red-500",
    },
    {
        icon: Brain,
        title: "Neurological Rehab",
        description: "Comprehensive rehabilitation for neurological conditions such as stroke, Parkinson's, and multiple sclerosis.",
        color: "bg-green-50 text-green-600",
    },
    {
        icon: Baby,
        title: "Pediatric Rehab",
        description: "Child-friendly rehabilitation programs addressing developmental delays, cerebral palsy, and musculoskeletal issues.",
        color: "bg-yellow-50 text-yellow-600",
    },
];

const Services = () => {
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
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="services" ref={sectionRef} className="w-full bg-slate-50/60 py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                {/* Header */}
                <div className="text-center space-y-3 mb-14 reveal">
                    <span className="text-primary text-xs font-semibold uppercase tracking-widest">What We Offer</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Our Rehabilitation{" "}
                        <span className="text-primary">Services</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
                        Comprehensive rehabilitation solutions delivered by certified professionals, tailored to your individual needs.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, i) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.title}
                                className="reveal-scale card-hover bg-white rounded-2xl p-7 border border-gray-100 cursor-pointer group"
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${service.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
                                <div className="mt-5 h-0.5 w-0 bg-primary rounded transition-all group-hover:w-12" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;
