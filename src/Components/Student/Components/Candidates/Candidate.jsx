import React, { useState } from "react";

const candidatesData = [
  {
    id: 1,
    name: "Aarav Mehta",
    position: "President",
    department: "Computer Science",
    year: "3rd Year",
    manifesto:
      "I aim to improve student engagement and transparency in campus decisions. My focus will be on creating open forums for student feedback and implementing a transparent decision-making process.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Riya Patel",
    position: "President",
    department: "Information Technology",
    year: "3rd Year",
    manifesto:
      "My vision is to bridge the gap between students and administration. I will work towards better infrastructure, enhanced career support, and creating more opportunities for holistic development.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 3,
    name: "Priya Sharma",
    position: "Vice President",
    department: "Electrical Engineering",
    year: "2nd Year",
    manifesto:
      "Focus on sustainability and organizing more technical workshops. I will establish partnerships with industry experts and promote green initiatives across campus.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 4,
    name: "Arjun Reddy",
    position: "Vice President",
    department: "Civil Engineering",
    year: "2nd Year",
    manifesto:
      "I believe in creating an inclusive campus culture. My priorities include mental health support, diverse cultural events, and improved sports facilities for all students.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: 5,
    name: "Karan Singh",
    position: "Treasurer",
    department: "Mechanical Engineering",
    year: "3rd Year",
    manifesto:
      "Ensure transparent use of student funds for beneficial events. I will implement a public budget dashboard and prioritize funding for student-led initiatives and academic competitions.",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 6,
    name: "Ananya Kumar",
    position: "Treasurer",
    department: "Business Administration",
    year: "3rd Year",
    manifesto:
      "Financial accountability is my priority. I will maximize value from every rupee spent, create emergency funds for students in need, and invest in long-term campus improvements.",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
  },
  {
    id: 7,
    name: "Vikram Joshi",
    position: "Secretary",
    department: "Electronics Engineering",
    year: "2nd Year",
    manifesto:
      "Efficient communication is key to a thriving campus. I will streamline event coordination, improve digital communication channels, and ensure every student voice is heard and documented.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 8,
    name: "Meera Nair",
    position: "Secretary",
    department: "Chemical Engineering",
    year: "2nd Year",
    manifesto:
      "Organization and transparency define my approach. I will maintain comprehensive records, create accessible archives of student council activities, and facilitate better inter-department collaboration.",
    image: "https://randomuser.me/api/portraits/women/72.jpg",
  },
];

export default function Candidates() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00ff41]"
          style={{ textShadow: "0 0 20px rgba(0,255,65,0.5)" }}
        >
          Candidates
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mt-2">
          Meet the candidates running for student council positions
        </p>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {candidatesData.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-[#111111] border border-[#00ff41]/20 rounded-xl p-4 sm:p-6 cursor-pointer transition-all hover:scale-105 hover:border-[#00ff41]/60 hover:shadow-[0_0_20px_rgba(0,255,65,0.2)]"
            onClick={() => setSelectedCandidate(candidate)}
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-3 sm:mb-4 border-4 border-[#00ff41]"
                style={{ boxShadow: "0 0 15px rgba(0,255,65,0.4)" }}
              />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                {candidate.name}
              </h3>
              <p className="text-[#00ff41] font-semibold text-xs sm:text-sm">
                {candidate.position}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {candidate.department}
              </p>
              <button
                className="mt-3 sm:mt-4 px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg bg-[#00ff41] hover:bg-[#00ff41]/80 text-black font-bold transition-all"
                style={{ boxShadow: "0 0 15px rgba(0,255,65,0.3)" }}
              >
                View Manifesto
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="bg-[#111111] rounded-xl p-4 sm:p-6 lg:p-8 w-full max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto relative border border-[#00ff41]/40"
            style={{ boxShadow: "0 0 40px rgba(0,255,65,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#00ff41] hover:text-[#00ff41]/70 text-xl sm:text-2xl font-bold transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center mt-4 sm:mt-0">
              <img
                src={selectedCandidate.image}
                alt={selectedCandidate.name}
                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover mb-4 border-4 border-[#00ff41]"
                style={{ boxShadow: "0 0 25px rgba(0,255,65,0.5)" }}
              />
              <h3
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2"
                style={{ textShadow: "0 0 15px rgba(0,255,65,0.3)" }}
              >
                {selectedCandidate.name}
              </h3>
              <p className="text-[#00ff41] font-semibold text-sm sm:text-base mb-1">
                {selectedCandidate.position}
              </p>
              <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                {selectedCandidate.department} • {selectedCandidate.year}
              </p>
              
              <div className="bg-[#0a0a0a] rounded-lg p-4 sm:p-6 border border-[#00ff41]/20 w-full">
                <h4 className="text-[#00ff41] font-semibold text-base sm:text-lg mb-3">
                  Manifesto:
                </h4>
                <p className="text-gray-300 leading-relaxed text-left text-sm sm:text-base">
                  {selectedCandidate.manifesto}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}