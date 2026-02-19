import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Services from "../components/Services";
import HowItWorks from "../components/HowItWorks";
import Doctors from "../components/Doctors";
import AboutUs from "../components/AboutUs";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <Doctors />
      <AboutUs />
      <Testimonials />
      <Footer />
    </main>
  );
}
