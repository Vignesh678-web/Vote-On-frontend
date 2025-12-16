import React from 'react';


export const FloatingPapers = () => {
  const papers = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 3 + Math.random() * 2,
    x: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {papers.map((paper) => (
        <div
          key={paper.id}
          className="absolute w-12 h-16 bg-white rounded shadow-lg"
          style={{
            left: `${paper.x}%`,
            top: '-10%',
            animation: `float ${paper.duration}s ease-in-out ${paper.delay}s infinite`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
export default FloatingPapers;