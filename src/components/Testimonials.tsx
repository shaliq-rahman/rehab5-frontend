"use client";

import { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
    {
        name: "Riya Sharma",
        location: "Mumbai",
        rating: 5,
        text: "After my knee surgery, I was worried I'd never run again. Rehab5's team built a personalised recovery plan and within 3 months I was back on the track. Absolutely life-changing!",
        role: "Post-Surgery Patient",
    },
    {
        name: "Kiran Mehta",
        location: "Pune",
        rating: 5,
        text: "I've been dealing with chronic back pain for years. Dr. Okafor at Rehab5 identified the root cause and in just 6 weeks my pain reduced by 80%. The online booking made it so convenient.",
        role: "Chronic Pain Patient",
    },
    {
        name: "Suresh Nambiar",
        location: "Bangalore",
        rating: 5,
        text: "My son had developmental delays and we were referred to Rehab5's pediatric team. Dr. Priya is exceptional — patient, caring, and highly skilled. We've seen incredible progress.",
        role: "Parent of Pediatric Patient",
    },
    {
        name: "Anita D'Souza",
        location: "Goa",
        rating: 5,
        text: "As a weekend football player I tore my hamstring. The sports rehab program at Rehab5 was exactly what I needed — structured, progressive, and effective. Back playing in 8 weeks!",
        role: "Sports Rehab Patient",
    },
];

const Testimonials = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
    const next = () => setCurrent((c) => (c + 1) % testimonials.length);

    return (
        <section id="testimonials" ref={sectionRef} className="w-full py-20 md:py-28 bg-gradient-to-br from-primary/5 to-white">
            <div className="max-w-4xl mx-auto px-6 md:px-8">
                <div className="text-center space-y-3 mb-14 reveal">
                    <span className="text-primary text-xs font-semibold uppercase tracking-widest">Patient Stories</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Real Results, <span className="text-primary">Real People</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Hear from the patients whose lives Rehab5 has helped transform.
                    </p>
                </div>

                {/* Carousel */}
                <div className="reveal relative">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 min-h-[280px] flex flex-col justify-between transition-all duration-500">
                        {/* Stars */}
                        <div className="flex gap-1 mb-4">
                            {[...Array(testimonials[current].rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>

                        <p className="text-gray-700 text-base md:text-lg leading-relaxed flex-1 italic">
                            &ldquo;{testimonials[current].text}&rdquo;
                        </p>

                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                            <div>
                                <p className="font-semibold text-gray-800">{testimonials[current].name}</p>
                                <p className="text-xs text-gray-400">{testimonials[current].role} · {testimonials[current].location}</p>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-2">
                                <button onClick={prev} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={next} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-gray-300"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
