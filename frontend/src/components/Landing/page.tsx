import Link from "next/link";
const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner */}
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg.jpg')" }}
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

          {/* Buttons Row */}
          <div className="flex flex-col md:flex-row gap-6">
            <Link href="/register">
              <button className="bg-gradient-to-l from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-4 px-10 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-500/25 text-lg">
                Join Us
              </button>
              </Link>
              <Link href="/login">
              <button className="bg-gradient-to-l from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-4 px-10 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-500/25 text-lg">
                Sign Up
              </button>
              </Link>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Make a Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every action counts. Join thousands of volunteers making our
              beaches cleaner and safer.
            </p>
          </div>

          <div className="grid gap-10 grid-cols-1 md:grid-cols-3">
            {[
              {
                image: "/images/card1.jpg",
                title: "Why Join?",
                desc: "Help protect marine life, reduce plastic waste, and inspire your community to act for a cleaner future.",
              },
              {
                image: "/images/card2.jpg",
                title: "How It Works",
                desc: "Sign up, show up, and team up! We provide all the tools and equipment — just bring your energy and passion.",
              },
              {
                image: "/images/card3.jpg",
                title: "Get Involved",
                desc: "Share our mission on social media, invite your friends, and help grow this important environmental movement.",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/10 border border-gray-100"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-52 object-cover rounded-2xl mb-6"
                />
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-8">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-lg mb-2">&copy; 2025 Beach Cleanup Drive</p>
          <p className="text-gray-400">
            Built with love to make Earth cleaner, one beach at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
