import React from 'react';
import type { WeeklyPattern as WeeklyPatternType, DreamStateType, SymbolCategory } from '../types';

interface WeeklyPatternProps {
  pattern: WeeklyPatternType;
}

const CATEGORY_INFO: Record<SymbolCategory, { emoji: string; label: string }> = {
  element: { emoji: '🌊', label: '자연/원소' },
  place: { emoji: '🏠', label: '장소' },
  action: { emoji: '🏃', label: '행동' },
  person: { emoji: '👤', label: '인물' },
  emotion: { emoji: '💭', label: '감정' },
};

const STATE_LABELS: Record<DreamStateType, string> = {
  revelation: '계시형',
  premonition: '예지형',
  wish: '소망형',
  release: '해소형',
  everyday: '일상형',
};

const WeeklyPatternComponent: React.FC<WeeklyPatternProps> = ({ pattern }) => {
  const categoryInfo = CATEGORY_INFO[pattern.dominantCategory] || { emoji: '💭', label: pattern.dominantCategory };

  const maxCount = Math.max(...pattern.stateDistribution.map(s => s.count), 1);

  return (
    <div className="weekly-pattern">
      {/* Dominant Category */}
      <div className="weekly-category">
        <span className="weekly-category-emoji">{categoryInfo.emoji}</span>
        <div>
          <div className="weekly-category-label">주요 꿈 카테고리</div>
          <div className="weekly-category-name">{categoryInfo.label}</div>
        </div>
      </div>

      {/* Frequent Symbols */}
      {pattern.frequentSymbols.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
            자주 등장한 상징
          </div>
          <div className="weekly-symbols">
            {pattern.frequentSymbols.map(({ symbol, count }) => (
              <span key={symbol.id} className="weekly-symbol-badge">
                <span>{symbol.emoji}</span>
                <span>{symbol.name}</span>
                <span className="weekly-symbol-count">x{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* State Distribution */}
      {pattern.stateDistribution.length > 0 && (
        <div className="weekly-distribution">
          <div className="weekly-dist-label">꿈 유형 분포</div>
          {pattern.stateDistribution.map(({ state, count }) => (
            <div key={state} className="weekly-dist-bar-wrap">
              <span className="weekly-dist-name">
                {STATE_LABELS[state] || state}
              </span>
              <div className="weekly-dist-bar-bg">
                <div
                  className="weekly-dist-bar-fill"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="weekly-dist-count">{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Insight */}
      {pattern.insight && (
        <div className="weekly-insight">
          {pattern.insight}
        </div>
      )}
    </div>
  );
};

export default WeeklyPatternComponent;
