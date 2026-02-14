import { DreamState, DreamStateType } from '../types';

export const DREAM_STATES: DreamState[] = [
  {
    type: 'revelation',
    label: '계시몽',
    description: '우주가 보내는 메시지가 담긴 꿈',
    nebulaDensity: 1.0,
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)',
    kkumiComment: '이건... 우주가 너에게 보내는 특별한 메시지야! 꿈의 모든 조각이 하나의 별자리를 이루고 있어...',
  },
  {
    type: 'premonition',
    label: '예지몽',
    description: '미래의 파편이 스며든 꿈',
    nebulaDensity: 0.85,
    color: '#A78BFA',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #6366F1 100%)',
    kkumiComment: '미래의 조각들이 꿈에 스며들었어... 오늘 꾼 꿈에 앞으로 올 일의 힌트가 숨어 있을지도 몰라~',
  },
  {
    type: 'wish',
    label: '소망몽',
    description: '마음 깊은 곳의 바람이 투영된 꿈',
    nebulaDensity: 0.65,
    color: '#F472B6',
    gradient: 'linear-gradient(135deg, #F472B6 0%, #E11D48 100%)',
    kkumiComment: '네 마음 깊은 곳의 소원이 꿈으로 피어났어~ 진짜 원하는 게 뭔지 잘 들여다봐...!',
  },
  {
    type: 'release',
    label: '해소몽',
    description: '감정을 풀어내는 치유의 꿈',
    nebulaDensity: 0.45,
    color: '#34D399',
    gradient: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
    kkumiComment: '꿈이 너의 마음을 치유하고 있어~ 쌓여 있던 감정들이 서서히 풀리고 있는 거야...',
  },
  {
    type: 'everyday',
    label: '일상몽',
    description: '기억이 재배열되는 꿈',
    nebulaDensity: 0.25,
    color: '#94A3B8',
    gradient: 'linear-gradient(135deg, #94A3B8 0%, #6B7280 100%)',
    kkumiComment: '오늘의 기억들이 꿈에서 정리되고 있어~ 편안하게 쉬었으니 내일은 더 맑은 하루가 될 거야!',
  },
];

export function getDreamState(type: DreamStateType): DreamState {
  const state = DREAM_STATES.find((s) => s.type === type);
  if (!state) {
    return DREAM_STATES[DREAM_STATES.length - 1]; // fallback to everyday
  }
  return state;
}
