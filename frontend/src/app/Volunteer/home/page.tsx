import { User } from 'lucide-react';
import React from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-4 shadow-lg border-b border-slate-600">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Profile Icon on the left */}
          <Link
            href="/Volunteer/dashboard"
            className="bg-white/90 hover:bg-teal-50 p-2 rounded-full transition-all duration-300 shadow-sm group"
          >
            <User className="w-6 h-6 text-slate-800 group-hover:text-teal-800" />
          </Link>

          {/* Navigation Links in the center */}
          <div className="flex space-x-6">
            {[
              { label: "Home", path: "/Volunteer/home" },
              { label: "Events", path: "/Volunteer/events" },
              { label: "Leaderboard", path: "/Volunteer/leaderboard" },
              { label: "AI Assistant", path: "/Volunteer/quiz" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.path}
                className="bg-white/90 text-slate-800 px-6 py-2 rounded-lg text-lg font-medium hover:bg-teal-50 hover:text-teal-800 transition-all duration-300 shadow-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Empty div for balance (optional) */}
          <div className="w-10"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg3.jpg')" }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70 z-10" />

        {/* Content on top of banner */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Clean Coast AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-lg font-light leading-relaxed">
            Cleaning Smarter With Every Click.
          </p>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Event Card 1 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <img
                src="/images/bg.jpg"
                alt="Event1"
                className="h-40 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Marina Beach Cleanup
                </h3>
                <p className="text-gray-600 mb-4">
                  Join us for a comprehensive beach cleanup at Marina Beach.
                  Help remove plastic harmful waste and protect marine life.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-teal-600 font-medium">
                    July 15, 2025
                  </span>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Register
                  </Button>
                </div>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <img
                src="/images/bg4.jpg"
                alt="Event1"
                className="h-40 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Awareness Workshop
                </h3>
                <p className="text-gray-600 mb-4">
                  Educational workshop on ocean pollution and sustainable
                  practices for coastal communities. Help Spread Awareness.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium">
                    July 22, 2025
                  </span>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Join Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <img
                src="/images/bg3.jpg"
                alt="Event1"
                className="h-40 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Community Challenge
                </h3>
                <p className="text-gray-600 mb-4">
                  Monthly cleanup challenge with rewards. Track your impact and
                  compete with other volunteers. Motivate you towards Cleanup.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium">Ongoing</span>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Participate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beach Cleanup Awareness Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Why Beach Cleanup Matters
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Every year, millions of tons of plastic waste enter our
                  oceans, threatening marine ecosystems and coastal communities.
                  Beach cleanups are more than just environmental activities –
                  they're vital interventions that protect biodiversity and
                  preserve our planet's health.
                </p>
                <p>
                  Marine animals often mistake plastic debris for food, leading
                  to injury or death. By removing waste from beaches, we prevent
                  it from entering the ocean and harming wildlife. Additionally,
                  clean beaches support local tourism and economic prosperity.
                </p>
                <p>
                  Community involvement is crucial. When people participate in
                  cleanup efforts, they develop a deeper connection to
                  environmental conservation and become advocates for
                  sustainable practices in their daily lives.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">8M+</div>
                  <div className="text-gray-600">
                    Tons of plastic enter oceans yearly
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">700+</div>
                  <div className="text-gray-600">
                    Species affected by ocean debris
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div
                className="w-full h-96 rounded-2xl flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg4.jpg')" }}
              >
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-12 border-t border-slate-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                Clean Coast AI
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Empowering communities to protect our coastlines through
                AI-driven cleanup initiatives and environmental awareness
                programs.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-400 transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  📘
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-400 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  🐦
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-400 transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  📷
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-400 transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  💼
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  "About Us",
                  "Events",
                  "Volunteer",
                  "Impact Report",
                  "Contact",
                ].map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p>📧 info@cleancoastai.org</p>
                <p>📞 +91 98765 43210</p>
                <p>📍 Chennai, Tamil Nadu</p>
                <p>🕒 Mon-Fri 9AM-6PM</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Clean Coast AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
