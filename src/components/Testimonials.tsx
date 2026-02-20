"use client";

import { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
    {
        name: "Fatima Al Mansoori",
        location: "Dubai Marina, UAE",
        rating: 5,
        text: "I never imagined I could do physiotherapy from my living room. After my knee surgery, Rehab5's telerehab sessions were a game-changer — my specialist guided me through every exercise via video and I recovered in record time. This is the future!",
        role: "Post-Surgery Telerehab Patient",
    },
    {
        name: "Omar Hassan",
        location: "Jumeirah, UAE",
        rating: 5,
        text: "As a busy professional in the UAE, I had no time to visit a physio clinic. Rehab5 let me book a session during my lunch break from my home office. My back pain went from chronic to manageable in 5 weeks — all online.",
        role: "Remote Rehab Patient",
    },
    {
        name: "Aisha Khalid",
        location: "Downtown Dubai, UAE",
        rating: 5,
        text: "My son has developmental challenges and traveling to clinics was exhausting for him. Rehab5's pediatric telerehab sessions are engaging, child-friendly, and incredibly effective. Dr. Priya has been incredible — all via video call.",
        role: "Parent of Pediatric Telerehab Patient",
    },
    {
        name: "Mohammed Al Rashidi",
        location: "Business Bay, UAE",
        rating: 5,
        text: "I tore my hamstring during a football match and was flying back to the UAE the next day. Rehab5 had me in a remote session within 24 hours. Structured, progressive, and completely online — I was back playing in 7 weeks.",
        role: "Sports Telerehab Patient",
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
                    <span className="text-primary text-xs font-semibold uppercase tracking-widest">UAE Patient Stories</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Real Recovery, <span className="text-primary">Fully Online</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Hear from patients across the UAE who transformed their recovery through Rehab5&apos;s telerehabitation platform.
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
