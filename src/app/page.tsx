import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import AboutUs from "../components/AboutUs";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-50/50 to-white">
        <Navbar />
        <Hero />
      </div>
      <Stats />
      <AboutUs />
    </main>
  );
}
