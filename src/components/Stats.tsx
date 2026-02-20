"use client";

import { useEffect, useRef, useState } from "react";

const statsData = [
    { value: 500, suffix: "+", label: "Remote Sessions Delivered" },
    { value: 98, suffix: "%", label: "Recovery Success Rate" },
    { value: 1, suffix: "st", label: "Telerehab Platform in the UAE" },
    { value: 100, suffix: "%", label: "Online — No Clinic Visits" },
];

function useCountUp(target: number, duration: number, active: boolean) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [active, target, duration]);
    return count;
}

function StatItem({ value, suffix, label, active, delay }: { value: number; suffix: string; label: string; active: boolean; delay: number }) {
    const count = useCountUp(value, 1500, active);
    return (
        <div
            className="reveal flex flex-col items-center space-y-2"
            style={{ transitionDelay: `${delay}ms` }}
        >
            <span className="text-4xl md:text-5xl font-bold text-primary">
                {count}{suffix}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-widest text-center">{label}</span>
        </div>
    );
}

const Stats = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setActive(true);
                    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-gradient-to-br from-slate-50 to-white py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center space-y-14">
                <div className="space-y-4 max-w-2xl reveal" style={{ transitionDelay: "0ms" }}>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Numbers That{" "}
                        <span className="text-primary relative">
                            Prove The Future
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/30 rounded" />
                        </span>
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Rehab5 is rewriting what rehabilitation looks like in the UAE — every number reflects a patient who recovered smarter, faster, and from the comfort of their home.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full">
                    {statsData.map((stat, i) => (
                        <StatItem key={stat.label} {...stat} active={active} delay={(i + 1) * 150} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
