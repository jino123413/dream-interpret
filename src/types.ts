export type DreamStateType = 'revelation' | 'premonition' | 'wish' | 'release' | 'everyday';

export type SymbolCategory = 'element' | 'place' | 'action' | 'person' | 'emotion';

export interface DreamSymbol {
  id: string;
  name: string;
  category: SymbolCategory;
  emoji: string;
  keywords: string[];
  meaning: string;
  psychology: string;
  energy: number; // 1-10
  actionAdvice: string;
}

export interface DreamState {
  type: DreamStateType;
  label: string;
  description: string;
  nebulaDensity: number;
  color: string;
  gradient: string;
  kkumiComment: string;
}

export interface CloudNode {
  symbol: DreamSymbol;
  size: 'large' | 'medium' | 'small';
  x: number;
  y: number;
  opacity: number;
}

export interface DreamResult {
  inputText: string;
  matchedSymbols: DreamSymbol[];
  dreamState: DreamState;
  cloudNodes: CloudNode[];
  kkumiMessage: string;
  actionSuggestion: string;
  deepAnalysis: string[];
  timestamp: number;
}

export interface DreamHistory {
  results: DreamResult[];
  collectedSymbolIds: string[];
  streak: {
    current: number;
    lastDate: string;
  };
}

export interface WeeklyPattern {
  dominantCategory: SymbolCategory;
  frequentSymbols: { symbol: DreamSymbol; count: number }[];
  stateDistribution: { state: DreamStateType; count: number }[];
  insight: string;
}
