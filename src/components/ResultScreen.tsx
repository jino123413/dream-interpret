import React from 'react';
import type { DreamResult, WeeklyPattern } from '../types';
import { DREAM_SYMBOLS } from '../data/dream-symbols';
import DreamCloudMap from './DreamCloudMap';
import DeepAnalysis from './DeepAnalysis';
import WeeklyPatternComponent from './WeeklyPattern';
import SymbolCollection from './SymbolCollection';
import { CompassIcon, BrainIcon, ChartIcon, BookIcon, RefreshIcon } from './Icons';

const DREAM_STATE_EMOJIS: Record<string, string> = {
  revelation: '✨',
  premonition: '🔮',
  wish: '💫',
  release: '🍃',
  everyday: '☁️',
};

interface ResultScreenProps {
  result: DreamResult;
  premiumUnlocked: boolean;
  weeklyUnlocked: boolean;
  collectionUnlocked: boolean;
  onUnlockPremium: () => void;
  onUnlockWeekly: () => void;
  onUnlockCollection: () => void;
  onRetry: () => void;
  adLoading: boolean;
  weeklyPattern: WeeklyPattern | null;
  collectedSymbolIds: string[];
  totalSymbols: number;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  premiumUnlocked,
  weeklyUnlocked,
  collectionUnlocked,
  onUnlockPremium,
  onUnlockWeekly,
  onUnlockCollection,
  onRetry,
  adLoading,
  weeklyPattern,
  collectedSymbolIds,
  totalSymbols,
}) => {
  const stateEmoji = DREAM_STATE_EMOJIS[result.dreamState.type] || '☁️';

  return (
    <div className="result-screen hide-scrollbar">
      {/* 1. Dream State Badge */}
      <div className="dream-state-badge">
        <span className="state-emoji">{stateEmoji}</span>
        <div className="state-label" style={{ color: result.dreamState.color }}>
          {result.dreamState.label}
        </div>
        <div className="state-description">
          {result.dreamState.description}
        </div>
      </div>

      {/* 2. Dream Cloud Map (Nebula SVG) */}
      <div className="cloud-map-container">
        <DreamCloudMap
          cloudNodes={result.cloudNodes}
          dreamState={result.dreamState}
          animate={true}
        />
      </div>

      {/* 3. Kkumi's Interpretation */}
      <div className="kkumi-bubble">
        <div className="kkumi-label">
          <span>🔮</span>
          수정구슬의 해석
        </div>
        <div className="kkumi-comment">
          {result.dreamState.kkumiComment}
        </div>
        <div className="kkumi-interpretation">
          {result.kkumiMessage}
        </div>
      </div>

      {/* 4. Action Suggestion */}
      <div className="action-card">
        <div className="action-card-title">
          <CompassIcon size={16} />
          오늘의 행동
        </div>
        <div className="action-card-text">
          {result.actionSuggestion}
        </div>
      </div>

      {/* 5. Deep Analysis (Premium) */}
      <div className="premium-section">
        <div className="premium-section-title">
          <BrainIcon size={16} />
          심층 분석
        </div>

        {premiumUnlocked ? (
          <DeepAnalysis analysis={result.deepAnalysis} />
        ) : (
          <div className="premium-locked">
            <div className="premium-locked-preview">
              <p>꿈에서 나타난 물의 상징은 당신의 감정 상태를...</p>
              <p>무의식적으로 억눌러왔던 욕구가 꿈을 통해...</p>
              <p>이 꿈은 현재 당신이 겪고 있는 변화의...</p>
            </div>
            <div className="premium-locked-overlay">
              <button
                className="btn-ad-unlock"
                onClick={onUnlockPremium}
                disabled={adLoading}
              >
                <span className="ad-badge">AD</span>
                {adLoading ? '로딩 중...' : '심층 분석 열기'}
              </button>
              <div className="ad-notice">
                광고 시청 후 심층 분석을 확인할 수 있어요
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Weekly Pattern (Premium) */}
      <div className="premium-section">
        <div className="premium-section-title">
          <ChartIcon size={16} />
          주간 꿈 패턴
        </div>

        {weeklyPattern ? (
          weeklyUnlocked ? (
            <WeeklyPatternComponent pattern={weeklyPattern} />
          ) : (
            <div className="premium-locked">
              <div className="premium-locked-preview">
                <p>최근 꿈에서 자연/원소 관련 상징이 자주 등장...</p>
                <p>소망형 꿈이 가장 많이 나타나고 있으며...</p>
                <p>반복되는 상징 패턴으로 볼 때...</p>
              </div>
              <div className="premium-locked-overlay">
                <button
                  className="btn-ad-unlock"
                  onClick={onUnlockWeekly}
                  disabled={adLoading}
                >
                  <span className="ad-badge">AD</span>
                  {adLoading ? '로딩 중...' : '주간 패턴 열기'}
                </button>
                <div className="ad-notice">
                  광고 시청 후 주간 패턴을 확인할 수 있어요
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="premium-no-data">
            <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>📊</span>
            3개 이상의 꿈을 해몽하면 패턴을 분석해드려요
          </div>
        )}
      </div>

      {/* 7. Symbol Collection (Premium) */}
      <div className="premium-section">
        <div className="premium-section-title">
          <BookIcon size={16} />
          상징 도감
          <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, marginLeft: 'auto' }}>
            {collectedSymbolIds.length}/{totalSymbols}
          </span>
        </div>

        {collectionUnlocked ? (
          <SymbolCollection
            collectedIds={collectedSymbolIds}
            allSymbols={DREAM_SYMBOLS}
          />
        ) : (
          <div className="premium-locked">
            <div className="premium-locked-preview">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, padding: 8 }}>
                {['🌊', '🔥', '🌬️', '🏠', '🏃', '👤', '💭', '⭐', '🌙', '🌸'].map((e, i) => (
                  <div key={i} style={{ textAlign: 'center', fontSize: 18, padding: 6 }}>{e}</div>
                ))}
              </div>
            </div>
            <div className="premium-locked-overlay">
              <button
                className="btn-ad-unlock"
                onClick={onUnlockCollection}
                disabled={adLoading}
              >
                <span className="ad-badge">AD</span>
                {adLoading ? '로딩 중...' : '도감 열기'}
              </button>
              <div className="ad-notice">
                광고 시청 후 도감을 열어볼 수 있어요
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8. Retry Button (Core feature - NO AD) */}
      <button className="btn-retry" onClick={onRetry}>
        <RefreshIcon size={16} />
        다른 꿈 해몽하기
      </button>
    </div>
  );
};

export default ResultScreen;
