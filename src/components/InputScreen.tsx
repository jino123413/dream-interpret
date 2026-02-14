import React, { useState } from 'react';
import type { DreamResult } from '../types';
import { FireIcon, SparkleIcon, ClockIcon, CloseIcon } from './Icons';

const EXAMPLE_DREAMS = [
  { emoji: '🌊', text: '바다에서 수영하는 꿈' },
  { emoji: '✈️', text: '하늘을 나는 꿈' },
  { emoji: '🏃', text: '누군가에게 쫓기는 꿈' },
  { emoji: '🐍', text: '뱀이 나오는 꿈' },
  { emoji: '🦷', text: '이가 빠지는 꿈' },
  { emoji: '🏠', text: '어린 시절 집에 가는 꿈' },
  { emoji: '💰', text: '돈을 줍는 꿈' },
  { emoji: '🌸', text: '꽃밭을 걷는 꿈' },
];

const DREAM_STATE_COLORS: Record<string, string> = {
  revelation: '#FFD700',
  premonition: '#8B5CF6',
  wish: '#F472B6',
  release: '#34D399',
  everyday: '#94A3B8',
};

const DREAM_STATE_EMOJIS: Record<string, string> = {
  revelation: '✨',
  premonition: '🔮',
  wish: '💫',
  release: '🍃',
  everyday: '☁️',
};

interface InputScreenProps {
  onSubmit: (text: string) => void;
  recentDreams: DreamResult[];
  onDeleteDream: (index: number) => void;
  streak: { current: number; lastDate: string };
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}`;
}

function getGreetingByTime(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return '아침에 꾼 꿈이 있나요?';
  if (hour >= 9 && hour < 12) return '오전에 떠오른 꿈이 있나요?';
  if (hour >= 12 && hour < 18) return '낮에도 꿈은 찾아오죠';
  if (hour >= 18 && hour < 22) return '오늘 밤의 꿈을 들려주세요';
  return '한밤의 꿈 이야기를 들려주세요';
}

const InputScreen: React.FC<InputScreenProps> = ({
  onSubmit,
  recentDreams,
  onDeleteDream,
  streak,
}) => {
  const [text, setText] = useState('');
  const isReady = text.trim().length >= 10;
  const maxChars = 500;
  const displayDreams = recentDreams.slice(0, 5);

  const handleSubmit = () => {
    if (!isReady) return;
    onSubmit(text.trim());
    setText('');
  };

  const handleChipClick = (dreamText: string) => {
    setText(dreamText);
  };

  return (
    <div className="input-screen">
      {/* Greeting */}
      <div className="input-greeting">
        <span className="mascot-emoji">🔮</span>
        <div className="greeting-text">
          {getGreetingByTime()}
        </div>
        <div className="greeting-sub">
          수정구슬이 당신의 꿈을 읽어드려요
        </div>
      </div>

      {/* Streak Badge */}
      {streak.current > 0 && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span className="streak-badge">
            <FireIcon size={14} />
            {streak.current}일 연속 해몽 중
          </span>
        </div>
      )}

      {/* Dream Textarea */}
      <div className="dream-textarea-wrap">
        <textarea
          className="dream-textarea"
          placeholder="꿈 내용을 자세히 적어주세요...&#10;&#10;예) 넓은 바다에서 돌고래와 함께 헤엄치고 있었어요. 물이 정말 맑고 따뜻했는데..."
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              setText(e.target.value);
            }
          }}
          maxLength={maxChars}
        />
        <span className={`char-count ${isReady ? 'ready' : ''}`}>
          {text.length}/{maxChars}
        </span>
      </div>

      {/* Cloud Chip Examples */}
      <div className="cloud-chips-section">
        <div className="cloud-chips-label">이런 꿈은 어때요?</div>
        <div className="cloud-chips">
          {EXAMPLE_DREAMS.map((dream, i) => (
            <button
              key={i}
              className="cloud-chip"
              onClick={() => handleChipClick(dream.text)}
            >
              <span>{dream.emoji}</span>
              <span>{dream.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        className="btn-submit"
        disabled={!isReady}
        onClick={handleSubmit}
      >
        <SparkleIcon size={18} />
        꿈 해몽하기
      </button>
      {!isReady && text.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
          최소 10자 이상 입력해주세요 ({text.length}/10)
        </div>
      )}

      {/* Recent Dreams */}
      <div className="recent-section">
        <div className="recent-title">
          <ClockIcon size={16} />
          최근 해몽 기록
        </div>

        {displayDreams.length === 0 ? (
          <div className="recent-empty">
            <span className="empty-emoji">🌙</span>
            <p>아직 해몽 기록이 없어요</p>
            <p style={{ marginTop: 4 }}>첫 번째 꿈을 들려주세요</p>
          </div>
        ) : (
          displayDreams.map((dream, index) => (
            <div key={dream.timestamp} className="recent-item">
              <div className="recent-item-content">
                <div className="recent-item-text">
                  {dream.inputText}
                </div>
                <div className="recent-item-meta">
                  <span
                    className="recent-item-state"
                    style={{
                      color: DREAM_STATE_COLORS[dream.dreamState.type] || '#94A3B8',
                      borderColor: `${DREAM_STATE_COLORS[dream.dreamState.type] || '#94A3B8'}33`,
                    }}
                  >
                    {DREAM_STATE_EMOJIS[dream.dreamState.type] || '☁️'}
                    {dream.dreamState.label}
                  </span>
                  <span className="recent-item-date">
                    {formatDate(dream.timestamp)}
                  </span>
                </div>
              </div>
              <button
                className="recent-item-delete"
                onClick={() => onDeleteDream(index)}
                aria-label="삭제"
              >
                <CloseIcon size={14} color="currentColor" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InputScreen;
