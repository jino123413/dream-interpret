import React, { useState, useEffect } from 'react';

interface RevealScreenProps {
  message: string;
}

const STAR_POSITIONS = [
  { top: '10%', left: '15%', delay: 0 },
  { top: '8%', right: '20%', delay: 0.3 },
  { top: '30%', left: '5%', delay: 0.6 },
  { top: '25%', right: '8%', delay: 0.9 },
  { top: '55%', left: '12%', delay: 1.2 },
  { top: '50%', right: '15%', delay: 0.4 },
  { top: '70%', left: '20%', delay: 0.8 },
  { top: '65%', right: '10%', delay: 1.1 },
];

const REVEAL_MESSAGES = [
  '꿈의 조각을 모으고 있어요...',
  '별빛 속에서 의미를 찾는 중...',
  '수정구슬이 꿈을 읽고 있어요...',
  '성운 속에서 상징을 해석 중...',
  '당신의 무의식이 말하고 있어요...',
];

const RevealScreen: React.FC<RevealScreenProps> = ({ message }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % REVEAL_MESSAGES.length);
      setFadeKey(prev => prev + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const displayMessage = message || REVEAL_MESSAGES[currentMessageIndex];

  return (
    <div className="reveal-screen">
      {/* Twinkling stars around the crystal ball */}
      {STAR_POSITIONS.map((pos, i) => (
        <span
          key={i}
          className="twinkle-star"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            animationDelay: `${pos.delay}s`,
            animationDuration: `${1.2 + pos.delay * 0.3}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Crystal Ball */}
      <div className="crystal-ball-wrap">
        <div className="crystal-ball">
          <div className="crystal-ball-inner" />
          <div className="crystal-ball-shine" />
        </div>
      </div>

      {/* Message */}
      <div className="reveal-message" key={fadeKey} style={{ animation: 'fadeIn 0.5s ease' }}>
        {displayMessage}
      </div>
    </div>
  );
};

export default RevealScreen;
