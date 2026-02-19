import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const AboutUs = () => {
    return (
        <section className="w-full max-w-7xl mx-auto px-8 py-20 flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">About Us</h2>
                <p className="text-gray-500 leading-relaxed max-w-md">
                    Access top rated doctors quickly and easily online. Connect with experienced professionals to your needs, right from the comfort of your home.
                </p>

                <Link href="#" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors group">
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Dots decoration */}
                <div className="pt-8">
                    <div className="grid grid-cols-5 gap-1 w-fit">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Image Content */}
            <div className="flex-1 relative h-[400px] w-full bg-gray-100 rounded-lg overflow-hidden">
                <Image
                    src="/assets/consultation.png"
                    alt="Doctor Consulting Patient"
                    fill
                    className="object-cover"
                />
            </div>
        </section>
    );
};

export default AboutUs;
