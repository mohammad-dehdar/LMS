"use client";

import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useConfettiStore } from "@/hooks/use-confetti-store";

function ConfettiProvider() {
  const confetti = useConfettiStore();
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  // افزودن منطق ردیابی سایز پنجره
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // مقداردهی اولیه
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!confetti.isOpen) return null;

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      className="pointer-events-none z-[100]"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={confetti.onClose}
    />
  );
}

export default ConfettiProvider;