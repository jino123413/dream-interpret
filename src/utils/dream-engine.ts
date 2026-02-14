import {
  DreamSymbol,
  DreamState,
  DreamStateType,
  DreamResult,
  CloudNode,
  SymbolCategory,
  WeeklyPattern,
} from '../types';
import { DREAM_SYMBOLS } from '../data/dream-symbols';
import { DREAM_STATES, getDreamState } from '../data/dream-states';
import { INTERPRETATION_TEMPLATES } from '../data/interpretation-templates';
import { KKUMI_MESSAGES } from '../data/kkumi-messages';

/**
 * Simple deterministic hash code for a string.
 * Used to produce seeded pseudo-random choices from input text.
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // convert to 32-bit int
  }
  return Math.abs(hash);
}

/**
 * Deterministic pick from an array based on a seed number.
 */
function seededPick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/**
 * Deterministic shuffle (Fisher-Yates with seeded values).
 * Returns a new array; does not mutate input.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = ((s * 1103515245 + 12345) & 0x7fffffff);
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get today's date string for deterministic seeding.
 */
function getTodaySeed(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Match dream text against all symbols by scanning keywords.
 */
function matchSymbols(text: string): DreamSymbol[] {
  const normalised = text.toLowerCase().replace(/\s+/g, ' ').trim();
  const matched: DreamSymbol[] = [];

  for (const symbol of DREAM_SYMBOLS) {
    for (const keyword of symbol.keywords) {
      if (normalised.includes(keyword)) {
        matched.push(symbol);
        break; // one match per symbol is enough
      }
    }
  }

  return matched;
}

/**
 * Determine dream state type based on matched symbols count and total energy.
 */
function determineDreamStateType(symbols: DreamSymbol[]): DreamStateType {
  const count = symbols.length;
  const totalEnergy = symbols.reduce((sum, s) => sum + s.energy, 0);

  if (count >= 5 || totalEnergy > 35) return 'revelation';
  if (count >= 4 || totalEnergy > 28) return 'premonition';
  if (count >= 3 || totalEnergy > 20) return 'wish';
  if (count >= 2 || totalEnergy > 12) return 'release';
  return 'everyday';
}

/**
 * Generate cloud nodes for the nebula visualisation.
 * The highest-energy symbol occupies the center (large), the rest orbit around it.
 */
export function generateCloudNodes(symbols: DreamSymbol[]): CloudNode[] {
  if (symbols.length === 0) return [];

  // Sort by energy descending
  const sorted = [...symbols].sort((a, b) => b.energy - a.energy);
  const limited = sorted.slice(0, 5);

  // Satellite positions in SVG viewBox coordinates (0-300)
  const satellitePositions: Array<{ x: number; y: number }> = [
    { x: 75, y: 75 },
    { x: 225, y: 90 },
    { x: 60, y: 195 },
    { x: 234, y: 204 },
  ];

  const nodes: CloudNode[] = limited.map((symbol, index) => {
    if (index === 0) {
      // Center node — largest, most prominent
      return {
        symbol,
        size: 'large' as const,
        x: 150,
        y: 135,
        opacity: 1.0,
      };
    }

    const pos = satellitePositions[(index - 1) % satellitePositions.length];
    const size: 'medium' | 'small' = index <= 2 ? 'medium' : 'small';
    const opacity = Math.max(0.5, 1.0 - index * 0.15);

    return {
      symbol,
      size,
      x: pos.x,
      y: pos.y,
      opacity,
    };
  });

  return nodes;
}

/**
 * Build an interpretation message from templates for a given symbol.
 */
function buildInterpretation(symbol: DreamSymbol, seed: number): string {
  const templateGroup = INTERPRETATION_TEMPLATES.find(
    (t) => t.category === symbol.category
  );
  if (!templateGroup) return symbol.meaning;

  const template = seededPick(templateGroup.templates, seed);
  return template.replace(/\{symbolName\}/g, symbol.name);
}

/**
 * Build a deep analysis line from templates for a given symbol.
 */
function buildDeepAnalysis(symbol: DreamSymbol, seed: number): string {
  const templateGroup = INTERPRETATION_TEMPLATES.find(
    (t) => t.category === symbol.category
  );
  if (!templateGroup) return symbol.psychology;

  const template = seededPick(templateGroup.deepAnalysisTemplates, seed);
  return template.replace(/\{symbolName\}/g, symbol.name);
}

/**
 * Build an action suggestion from templates for a given symbol.
 */
function buildActionSuggestion(symbol: DreamSymbol, seed: number): string {
  const templateGroup = INTERPRETATION_TEMPLATES.find(
    (t) => t.category === symbol.category
  );
  if (!templateGroup) return symbol.actionAdvice;

  const template = seededPick(templateGroup.actionTemplates, seed);
  return template.replace(/\{symbolName\}/g, symbol.name);
}

/**
 * Core dream interpretation engine.
 *
 * 1. Parse text and match keywords from DREAM_SYMBOLS
 * 2. If no matches, pick 1-2 pseudo-random symbols based on text hash
 * 3. Determine dream state from matched symbol count + total energy
 * 4. Generate cloud nodes (max 5)
 * 5. Generate kkumi message from templates
 * 6. Generate action suggestion
 * 7. Generate deep analysis (1 per matched symbol, max 5)
 */
export function interpretDream(text: string): DreamResult {
  const combinedSeed = hashCode(text + getTodaySeed());
  let matchedSymbols = matchSymbols(text);

  // If no keywords matched, pick 1-2 symbols deterministically
  if (matchedSymbols.length === 0) {
    const shuffled = seededShuffle(DREAM_SYMBOLS, combinedSeed);
    const pickCount = (combinedSeed % 2) + 1; // 1 or 2
    matchedSymbols = shuffled.slice(0, pickCount);
  }

  // De-duplicate by id (in case multiple keywords match the same symbol)
  const seen = new Set<string>();
  matchedSymbols = matchedSymbols.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });

  // Determine dream state
  const stateType = determineDreamStateType(matchedSymbols);
  const dreamState = getDreamState(stateType);

  // Generate cloud nodes
  const cloudNodes = generateCloudNodes(matchedSymbols);

  // Kkumi reveal message
  const kkumiMessage = seededPick(KKUMI_MESSAGES.reveal, combinedSeed);

  // Action suggestion — based on the highest-energy symbol
  const primarySymbol = [...matchedSymbols].sort((a, b) => b.energy - a.energy)[0];
  const actionSuggestion = buildActionSuggestion(primarySymbol, combinedSeed + 7);

  // Deep analysis — one per symbol, max 5
  const deepAnalysis = matchedSymbols.slice(0, 5).map((symbol, idx) =>
    buildDeepAnalysis(symbol, combinedSeed + idx * 13)
  );

  return {
    inputText: text,
    matchedSymbols,
    dreamState,
    cloudNodes,
    kkumiMessage,
    actionSuggestion,
    deepAnalysis,
    timestamp: Date.now(),
  };
}

/**
 * Analyse weekly dream patterns (needs at least 3 results).
 */
export function getWeeklyPattern(results: DreamResult[]): WeeklyPattern | null {
  if (results.length < 3) return null;

  // Count categories
  const categoryCounts: Record<SymbolCategory, number> = {
    element: 0,
    place: 0,
    action: 0,
    person: 0,
    emotion: 0,
  };

  // Count individual symbols
  const symbolCountMap = new Map<string, { symbol: DreamSymbol; count: number }>();

  // Count states
  const stateCounts: Record<DreamStateType, number> = {
    revelation: 0,
    premonition: 0,
    wish: 0,
    release: 0,
    everyday: 0,
  };

  for (const result of results) {
    stateCounts[result.dreamState.type]++;

    for (const symbol of result.matchedSymbols) {
      categoryCounts[symbol.category]++;

      const existing = symbolCountMap.get(symbol.id);
      if (existing) {
        existing.count++;
      } else {
        symbolCountMap.set(symbol.id, { symbol, count: 1 });
      }
    }
  }

  // Dominant category
  const dominantCategory = (Object.entries(categoryCounts) as [SymbolCategory, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  // Frequent symbols (top 5)
  const frequentSymbols = Array.from(symbolCountMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // State distribution (sorted by count desc)
  const stateDistribution = (Object.entries(stateCounts) as [DreamStateType, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([state, count]) => ({ state, count }));

  // Generate insight text based on dominant category
  const categoryInsights: Record<SymbolCategory, string> = {
    element: '최근 꿈에서 자연 원소가 자주 등장하고 있어. 내면의 근본적인 에너지 변화가 일어나는 시기야',
    place: '다양한 장소가 꿈에 나타나고 있어. 삶의 방향이나 소속감에 대한 고민이 활발한 시기인 것 같아',
    action: '꿈에서 많은 행동을 하고 있어. 현실에서 에너지를 쏟을 곳을 찾고 있다는 신호야',
    person: '사람들이 꿈에 자주 등장하고 있어. 인간관계에 대한 마음의 정리가 필요한 시기일 수 있어',
    emotion: '감정이 꿈의 중심을 차지하고 있어. 감정 표현과 해소에 더 주의를 기울여야 할 때야',
  };

  const insight = categoryInsights[dominantCategory];

  return {
    dominantCategory,
    frequentSymbols,
    stateDistribution,
    insight,
  };
}

/**
 * Example dream texts for quick-input chips on the input screen.
 */
export const EXAMPLE_DREAMS: string[] = [
  '하늘을 날았어',
  '바다에서 수영했어',
  '학교에 다시 갔어',
  '누군가에게 쫓겼어',
  '가족과 함께였어',
  '비가 내리고 있었어',
];
