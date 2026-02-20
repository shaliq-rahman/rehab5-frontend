"use client";

import { useEffect, useRef } from "react";
import { Video, Activity, Zap, Brain, Baby, Bone } from "lucide-react";

const services = [
    {
        icon: Video,
        title: "Live Video Rehab Sessions",
        description: "One-on-one real-time sessions with certified specialists via secure HD video — as effective as in-person, from anywhere in the UAE.",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: Activity,
        title: "Remote Physiotherapy",
        description: "Guided therapeutic exercises and movement correction delivered digitally — personalised, monitored, and progress-tracked online.",
        color: "bg-green-50 text-green-600",
    },
    {
        icon: Zap,
        title: "Sports Telerehabilitation",
        description: "Remote recovery programs for athletes — from acute injury management to return-to-sport planning, all without stepping into a clinic.",
        color: "bg-orange-50 text-orange-500",
    },
    {
        icon: Bone,
        title: "Post-Surgery Remote Recovery",
        description: "Structured post-operative rehabilitation delivered virtually — continuity of care from your home, without repeated hospital visits.",
        color: "bg-purple-50 text-purple-600",
    },
    {
        icon: Brain,
        title: "Neurological Telerehab",
        description: "Remote therapy for stroke, Parkinson's, and MS patients — consistent sessions and digital exercise programs that drive real outcomes.",
        color: "bg-red-50 text-red-500",
    },
    {
        icon: Baby,
        title: "Pediatric Telerehab",
        description: "Child-friendly remote rehabilitation for developmental delays and musculoskeletal conditions — accessible, engaging, and parent-guided.",
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
                        Our Telerehabilitation{" "}
                        <span className="text-primary">Services</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
                        Comprehensive rehabilitation delivered entirely online — no clinic visits needed. Same expertise, greater convenience, measurable results.
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
