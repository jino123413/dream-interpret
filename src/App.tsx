import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateHapticFeedback } from '@apps-in-toss/web-framework';
import { DreamResult, DreamHistory, WeeklyPattern } from './types';
import { FireIcon } from './components/Icons';
import { DREAM_SYMBOLS } from './data/dream-symbols';
import { interpretDream, getWeeklyPattern } from './utils/dream-engine';
import { getDreamHistory, saveDreamResult, updateStreak } from './utils/storage';
import { useInterstitialAd } from './hooks/useInterstitialAd';
import { DeviceViewport } from './components/DeviceViewport';
import InputScreen from './components/InputScreen';
import RevealScreen from './components/RevealScreen';
import ResultScreen from './components/ResultScreen';
import { KKUMI_MESSAGES } from './data/kkumi-messages';

type Screen = 'input' | 'revealing' | 'result';

const REVEAL_MESSAGES = KKUMI_MESSAGES.reveal;

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('input');
  const [dreamResult, setDreamResult] = useState<DreamResult | null>(null);
  const [history, setHistory] = useState<DreamHistory>({
    results: [],
    collectedSymbolIds: [],
    streak: { current: 0, lastDate: '' },
  });
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [weeklyUnlocked, setWeeklyUnlocked] = useState(false);
  const [collectionUnlocked, setCollectionUnlocked] = useState(false);
  const [weeklyPattern, setWeeklyPattern] = useState<WeeklyPattern | null>(null);
  const [revealMsg, setRevealMsg] = useState('');
  const { loading: adLoading, showAd } = useInterstitialAd('ait.v2.live.dream-interpret');
  const revealTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Load history on mount
  useEffect(() => {
    const init = async () => {
      const h = await getDreamHistory();
      setHistory(h);
      const streak = await updateStreak();
      setHistory((prev) => ({ ...prev, streak }));
      const pattern = getWeeklyPattern(h.results);
      setWeeklyPattern(pattern);
    };
    init();
  }, []);

  const handleSubmit = useCallback(
    (text: string) => {
      try {
        generateHapticFeedback({ type: 'softMedium' });
      } catch {}

      // Start reveal animation
      setScreen('revealing');
      setRevealMsg(REVEAL_MESSAGES[0]);

      // Cycle through reveal messages
      let msgIdx = 0;
      const msgTimer = setInterval(() => {
        msgIdx++;
        if (msgIdx < REVEAL_MESSAGES.length) {
          setRevealMsg(REVEAL_MESSAGES[msgIdx]);
          try {
            generateHapticFeedback({ type: 'softHeavy' });
          } catch {}
        }
      }, 700);

      // Process dream interpretation
      const result = interpretDream(text);

      // Transition to result after 2.5 seconds
      revealTimerRef.current = setTimeout(async () => {
        clearInterval(msgTimer);
        try {
          generateHapticFeedback({ type: 'rigid' });
        } catch {}

        setDreamResult(result);

        // Save to storage
        const updatedHistory = await saveDreamResult(result);
        setHistory(updatedHistory);

        // Update weekly pattern
        const pattern = getWeeklyPattern(updatedHistory.results);
        setWeeklyPattern(pattern);

        // Reset premium unlocks for new result
        setPremiumUnlocked(false);
        setWeeklyUnlocked(false);
        setCollectionUnlocked(false);

        setScreen('result');
        window.scrollTo({ top: 0 });
      }, 2500);

      return () => {
        clearInterval(msgTimer);
        if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
      };
    },
    [],
  );

  const handleDeleteDream = useCallback(
    async (index: number) => {
      const updated = { ...history };
      updated.results = [...updated.results];
      updated.results.splice(index, 1);
      setHistory(updated);
      // Re-save — we'll just update history state; storage update on next save
    },
    [history],
  );

  const handleUnlockPremium = useCallback(() => {
    showAd({
      onDismiss: () => {
        setPremiumUnlocked(true);
        try {
          generateHapticFeedback({ type: 'softMedium' });
        } catch {}
      },
    });
  }, [showAd]);

  const handleUnlockWeekly = useCallback(() => {
    showAd({
      onDismiss: () => {
        setWeeklyUnlocked(true);
        try {
          generateHapticFeedback({ type: 'softMedium' });
        } catch {}
      },
    });
  }, [showAd]);

  const handleUnlockCollection = useCallback(() => {
    showAd({
      onDismiss: () => {
        setCollectionUnlocked(true);
        try {
          generateHapticFeedback({ type: 'softMedium' });
        } catch {}
      },
    });
  }, [showAd]);

  const handleRetry = useCallback(() => {
    setDreamResult(null);
    setPremiumUnlocked(false);
    setWeeklyUnlocked(false);
    setCollectionUnlocked(false);
    setScreen('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <DeviceViewport />

      {/* Falling Stars Background */}
      <div className="stars-bg" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={`falling-star ${i % 4 === 0 ? 'large' : ''}`}
            style={{
              left: `${(i * 8.5) % 100}%`,
              animationDuration: `${8 + (i % 5) * 3}s`,
              animationDelay: `${(i * 1.7) % 10}s`,
              ['--max-opacity' as string]: 0.15 + (i % 3) * 0.08,
            }}
          />
        ))}
      </div>

      <div className="app">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="header-title">간밤의 꿈</h1>
            {history.streak.current > 0 && (
              <span className="streak-badge">
                <FireIcon size={14} />
                {history.streak.current}일 연속
              </span>
            )}
          </div>
        </header>

        {/* Input Screen */}
        {screen === 'input' && (
          <InputScreen
            onSubmit={handleSubmit}
            recentDreams={history.results}
            onDeleteDream={handleDeleteDream}
            streak={history.streak}
          />
        )}

        {/* Reveal Screen */}
        {screen === 'revealing' && <RevealScreen message={revealMsg} />}

        {/* Result Screen */}
        {screen === 'result' && dreamResult && (
          <ResultScreen
            result={dreamResult}
            premiumUnlocked={premiumUnlocked}
            weeklyUnlocked={weeklyUnlocked}
            collectionUnlocked={collectionUnlocked}
            onUnlockPremium={handleUnlockPremium}
            onUnlockWeekly={handleUnlockWeekly}
            onUnlockCollection={handleUnlockCollection}
            onRetry={handleRetry}
            adLoading={adLoading}
            weeklyPattern={weeklyPattern}
            collectedSymbolIds={history.collectedSymbolIds}
            totalSymbols={DREAM_SYMBOLS.length}
          />
        )}
      </div>
    </>
  );
};

export default App;
