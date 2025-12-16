import React from 'react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: '🔒',
      title: 'Secure Voting',
      description: 'Bank-level encryption ensures your vote is safe and confidential',
    },
    {
      icon: '⚡',
      title: 'Real-time Results',
      description: 'Get instant updates on election results as votes are counted',
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Vote from any device - phone, tablet, or desktop',
    },
    {
      icon: '✅',
      title: 'Easy Verification',
      description: 'Verify your vote was counted with our transparent system',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-black to-gray-900 py-20 px-6 md:px-12 lg:px-20 text-center mb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2">
            Why Choose
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold text-green-400 mb-6">
            VoteON?
          </h2>
          <p className="text-gray-400 text-center mb-10 mx-auto max-w-2xl text-lg">
            Experience the future of democratic participation with cutting-edge technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-14 justify-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-10 md:p-12 hover:border-green-500/50 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/10"
            >
              <div className="text-green-400 text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed max-w-xs text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
