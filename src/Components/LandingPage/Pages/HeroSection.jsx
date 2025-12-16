import React from 'react';
import FloatingPapers from './FloatingPapers';
import BallotBox from './BallotBox';
import AnimatedText from './AnimatedText';
import { useNavigate } from 'react-router-dom';

export const HeroSection = ({ ballotBoxImage }) => {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0b0b0b 0%, #111111 100%)',
      }}
    >
      {/* Floating Papers Animation */}
      <FloatingPapers />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 pt-32 pb-32">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-10 z-10">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              VOTE <AnimatedText /> WITH
            </h1>

            <h3 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
              YOUR SECURE
            </h3>
            <h3 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
              ONLINE VOTING APP
            </h3>

            <p className="text-gray-300 text-lg max-w-xl leading-relaxed drop-shadow-md">
              Cast your vote anytime, anywhere with confidence. Simple, secure, and
              ready to empower your voice. Register now and make a difference!
            </p>

            {/* Get Started Button */}
            <div className="pt-4">
              <button
                onClick={() => navigate('/UserLogin')}
                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black font-bold text-xl px-14 py-5 rounded-full transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-green-400/50 border-2 border-green-400 hover:border-green-500"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative h-[450px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
            <BallotBox imageUrl={ballotBoxImage} />
          </div>
        </div>

      </div>

      {/* Bottom Fade Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};

export default HeroSection;
