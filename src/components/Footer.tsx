import Image from "next/image";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 text-gray-400 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
                    {/* Brand */}
                    <div className="space-y-4 md:col-span-1">
                        <div className="relative w-[120px] h-[45px]">
                            <Image src="/assets/logo.png" alt="Rehab5 Logo" fill className="object-contain object-left brightness-0 invert" />
                        </div>
                        <p className="text-sm leading-relaxed">
                            Expert physiotherapy and rehabilitation services helping you recover, move better, and live pain-free.
                        </p>
                        <div className="flex gap-3">
                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors">
                                    <Icon className="w-4 h-4 text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
                        <ul className="space-y-3 text-sm">
                            {["Physiotherapy", "Sports Rehabilitation", "Post-Surgery Recovery", "Pain Management", "Neurological Rehab", "Pediatric Rehab"].map((s) => (
                                <li key={s}><a href="#services" className="hover:text-primary transition-colors">{s}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { label: "About Us", href: "#about" },
                                { label: "How It Works", href: "#how-it-works" },
                                { label: "Our Doctors", href: "#doctors" },
                                { label: "Testimonials", href: "#testimonials" },
                                { label: "Book Appointment", href: "#" },
                            ].map((link) => (
                                <li key={link.label}><a href={link.href} className="hover:text-primary transition-colors">{link.label}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>Rehab5 Clinic, 5th Floor, Health Tower, MG Road, Bangalore — 560001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                                <a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                                <a href="mailto:care@rehab5.in" className="hover:text-primary transition-colors">care@rehab5.in</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <p>© {new Date().getFullYear()} Rehab5. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
