import React from "react";
import ballotBoxImage from "../Components/Assets/ballotbox3.png";

const BallotBox = ({ imageUrl }) => {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <img
        src={imageUrl || ballotBoxImage}
        alt="Ballot Box"
        className="object-contain rounded-lg"
        style={{
          width: "100%",
          maxWidth: "420px", // ✅ Keeps it proportional on large screens
          height: "auto",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)", // Subtle depth shadow
        }}
      />
    </div>
  );
};

export default BallotBox;
