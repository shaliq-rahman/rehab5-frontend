"use client";

import Image from "next/image";
import { useState } from "react";
import BookingModal from "./BookingModal";

const Hero = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="w-full relative min-h-screen flex items-center overflow-x-hidden pt-20 md:pt-0">
            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Background Split */}
            <div className="absolute inset-0 flex flex-col md:flex-row -z-20">
                <div className="w-full md:w-[55%] bg-white h-[50%] md:h-full"></div>
                <div className="w-full md:w-[45%] bg-accent h-[50%] md:h-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 min-h-screen">
                {/* Text Content */}
                <div className="flex-1 space-y-6 md:space-y-10 z-10 pt-10 md:pt-20 text-center md:text-left">
                    <div className="space-y-4 md:space-y-6 flex flex-col items-center md:items-start">
                        <span className="text-gray-500 text-xs md:text-sm tracking-wide uppercase border-b border-gray-300 pb-1 w-fit">About Us</span>

                        <h1 className="text-5xl md:text-8xl text-gray-900 leading-[1.1] md:leading-[1.05]">
                            <span className="font-light block">Our Best</span>
                            <span className="font-semibold text-primary block">Doctors</span>
                            <span className="font-light block">Online</span>
                        </h1>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed tracking-wide max-w-md mx-auto md:mx-0">
                        Access top-rated doctors quickly and easily online. Connect with experienced professionals to your needs, right from the comfort of your home.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 md:gap-6 pt-4 w-full md:w-auto">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-md font-medium shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5 text-sm tracking-wide"
                        >
                            Schedule Appointment
                        </button>
                        <button className="w-full sm:w-auto bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-500 px-8 py-4 rounded-md font-medium transition-all text-sm tracking-wide shadow-sm">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Image Content */}
                <div className="flex-1 relative w-full h-[50vh] md:h-screen flex items-end justify-center">
                    <div className="relative w-full h-full md:w-[130%] md:h-[95%] md:right-[10%]">
                        <Image
                            src="/assets/doctor-female.png"
                            alt="Professional Doctor"
                            fill
                            className="object-contain object-bottom mix-blend-multiply"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
