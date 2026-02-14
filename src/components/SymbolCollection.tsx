import React from 'react';
import type { DreamSymbol, SymbolCategory } from '../types';

interface SymbolCollectionProps {
  collectedIds: string[];
  allSymbols: DreamSymbol[];
}

const CATEGORY_LABELS: Record<SymbolCategory, string> = {
  element: '자연/원소',
  place: '장소',
  action: '행동',
  person: '인물',
  emotion: '감정',
};

const CATEGORY_ORDER: SymbolCategory[] = ['element', 'place', 'action', 'person', 'emotion'];

const SymbolCollection: React.FC<SymbolCollectionProps> = ({ collectedIds, allSymbols }) => {
  const collectedSet = new Set(collectedIds);

  // Group symbols by category
  const grouped: Record<SymbolCategory, DreamSymbol[]> = {
    element: [],
    place: [],
    action: [],
    person: [],
    emotion: [],
  };

  allSymbols.forEach(symbol => {
    if (grouped[symbol.category]) {
      grouped[symbol.category].push(symbol);
    }
  });

  return (
    <div>
      <div className="collection-counter">
        {collectedIds.length} / {allSymbols.length} 상징 수집 완료
      </div>

      {CATEGORY_ORDER.map(category => {
        const symbols = grouped[category];
        if (symbols.length === 0) return null;

        return (
          <React.Fragment key={category}>
            <div className="collection-header">
              {CATEGORY_LABELS[category]} ({symbols.filter(s => collectedSet.has(s.id)).length}/{symbols.length})
            </div>
            <div className="symbol-collection">
              {symbols.map(symbol => {
                const isCollected = collectedSet.has(symbol.id);
                return (
                  <div
                    key={symbol.id}
                    className={`symbol-cell ${isCollected ? 'collected' : 'not-collected'}`}
                  >
                    <span className="symbol-emoji">
                      {isCollected ? symbol.emoji : '?'}
                    </span>
                    <span className="symbol-name">
                      {isCollected ? symbol.name : '???'}
                    </span>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SymbolCollection;
