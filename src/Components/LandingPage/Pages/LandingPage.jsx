import React from "react"; 
import Navbar from "./NavBar";
import { HeroSection } from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import ComprehensiveFeaturesSection from "./ComprehensiveFeaturesSection";

export default function LandingPage() {
  const ballotBoxImageUrl = ""; // Leave empty to use default illustration

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
    
       
        <HeroSection ballotBoxImage={ballotBoxImageUrl} />
      

      {/* Comprehensive Features */}
     
        <ComprehensiveFeaturesSection />
      

    
        <FeaturesSection />
      

      {/* Footer */}
     
        {/* Was mt-6 pt-6 → mt-20 pt-12 for proper spacing from previous section */}
        <Footer />
    
    </div>
  );
}
