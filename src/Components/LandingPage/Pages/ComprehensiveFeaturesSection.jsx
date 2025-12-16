import React from "react";

export const ComprehensiveFeaturesSection = () => {
  const features = [
    {
      title: "Convenient Onboarding",
      description: "Quick and hassle-free registration to get you started.",
      icon: (
        <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="12" y="16" width="36" height="40" rx="2" />
          <rect x="20" y="24" width="8" height="10" rx="1" />
          <line x1="32" y1="26" x2="44" y2="26" />
          <line x1="32" y1="30" x2="44" y2="30" />
          <path d="M20 42 L28 42 M20 46 L28 46" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Rock-Solid Security",
      description: "Advanced encryption and authentication to protect your vote.",
      icon: (
        <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M32 16 L32 48 M16 32 L48 32" />
          <circle cx="32" cy="32" r="18" />
          <path d="M32 20 C36 20 40 24 40 28 C40 32 36 36 32 36 C28 36 24 32 24 28 C24 24 28 20 32 20 Z" fill="currentColor" opacity="0.3" />
        </svg>
      ),
    },
    {
      title: "Real-Time Results",
      description: "Stay informed with live updates on election outcomes.",
      icon: (
        <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="16" y="20" width="32" height="28" rx="2" />
          <rect x="20" y="26" width="6" height="4" />
          <rect x="29" y="26" width="6" height="4" />
          <rect x="38" y="26" width="6" height="4" />
          <rect x="20" y="34" width="6" height="4" />
          <rect x="29" y="34" width="6" height="4" />
          <rect x="38" y="34" width="6" height="4" />
          <line x1="20" y1="44" x2="44" y2="44" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive insights and data visualization tools.",
      icon: (
        <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="16" y="24" width="32" height="24" rx="2" />
          <path d="M20 32 L24 36 L28 32" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="32" y1="34" x2="42" y2="34" strokeLinecap="round" />
          <line x1="32" y1="40" x2="42" y2="40" strokeLinecap="round" />
          <path d="M28 16 L36 16 L36 24 L28 24 Z" />
        </svg>
      ),
    },
    {
      title: "Global Accessibility",
      description: "Access from anywhere in the world, at any time.",
      icon: (
        <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="32" cy="32" r="18" />
          <path d="M20 32 C20 26 26 20 32 20" strokeLinecap="round" />
          <path d="M44 32 C44 38 38 44 32 44" strokeLinecap="round" />
          <line x1="32" y1="14" x2="32" y2="20" strokeLinecap="round" />
          <line x1="32" y1="44" x2="32" y2="50" strokeLinecap="round" />
          <line x1="14" y1="32" x2="20" y2="32" strokeLinecap="round" />
          <line x1="44" y1="32" x2="50" y2="32" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Exceptional Support",
      description: "24/7 customer support to assist you every step of the way.",
      icon: (
        <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="32" cy="28" r="8" />
          <path d="M20 48 C20 40 26 36 32 36 C38 36 44 40 44 48" strokeLinecap="round" />
          <circle cx="46" cy="24" r="6" opacity="0.6" />
          <circle cx="18" cy="24" r="6" opacity="0.6" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-gradient-to-b from-black to-gray-900 py-32 px-6 sm:px-10 md:px-16 lg:px-24 text-center mb-24">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Putting Your Needs First:
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold text-green-400 mb-6">
            The Ultimate Online Voting System
          </h2>
          <p className="text-gray-400 text-center mb-12 mx-auto max-w-3xl">
            Discover a comprehensive range of online voting software options, from secure polling
            tools to managing complex virtual voting events — all designed to exceed your expectations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-10 hover:border-green-500/50 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/10"
            >
              <div className="text-green-400 mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed max-w-xs">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ComprehensiveFeaturesSection;
