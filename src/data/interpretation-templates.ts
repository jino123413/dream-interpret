import { SymbolCategory } from '../types';

export interface InterpretationTemplate {
  category: SymbolCategory;
  templates: string[];
  deepAnalysisTemplates: string[];
  actionTemplates: string[];
}

export const INTERPRETATION_TEMPLATES: InterpretationTemplate[] = [
  {
    category: 'element',
    templates: [
      '꿈에서 {symbolName}이(가) 나타난 건 원초적인 에너지의 변화를 알려주고 있어',
      '{symbolName}의 기운이 너의 무의식을 감싸고 있어~ 자연의 메시지에 귀 기울여봐',
      '꿈속의 {symbolName}은(는) 지금 너에게 필요한 에너지가 뭔지 보여주고 있어',
      '{symbolName}이(가) 등장한 꿈은 내면의 근본적인 변화가 시작되고 있다는 신호야',
    ],
    deepAnalysisTemplates: [
      '{symbolName}은(는) 생명의 근원적 에너지를 상징해. 지금 너의 에너지 흐름에 변화가 생기고 있을 수 있어',
      '원소 {symbolName}이(가) 꿈에 나타났다는 건 네 안의 자연적 본능이 깨어나고 있다는 뜻이야',
      '고대부터 {symbolName}은(는) 변화와 재생의 상징이었어. 삶에서 새로운 국면이 다가오고 있을지도 몰라',
    ],
    actionTemplates: [
      '{symbolName}의 에너지를 실생활에서 접해보면 마음이 안정될 거야',
      '오늘은 {symbolName}과(와) 관련된 활동을 해보면 좋겠어',
      '{symbolName}의 기운을 떠올리며 명상하면 꿈의 메시지가 더 선명해질 거야',
    ],
  },
  {
    category: 'place',
    templates: [
      '꿈에서 {symbolName}에 있었다면 그곳이 지금 네 마음의 상태를 비추고 있어',
      '{symbolName}이(가) 배경인 꿈은 네가 그 공간이 상징하는 감정 속에 있다는 뜻이야',
      '꿈속의 {symbolName}은(는) 네 무의식이 만든 심리적 공간이야~ 그 안에서 어떤 기분이었는지가 중요해',
      '{symbolName}에서의 꿈은 삶의 방향에 대한 단서를 품고 있어',
    ],
    deepAnalysisTemplates: [
      '{symbolName}은(는) 심리학에서 자아의 특정 영역을 상징해. 그 공간에서 느낀 감정이 현재 네 심리 상태를 반영해',
      '꿈속의 {symbolName}은(는) 실제 장소가 아니라 네 마음의 풍경이야. 그곳의 분위기가 지금 네 감정 상태를 알려줘',
      '{symbolName}이(가) 등장하는 꿈은 소속감, 안전감, 모험심 중 하나와 관련이 깊어',
    ],
    actionTemplates: [
      '실제 {symbolName}과(와) 비슷한 장소를 방문해보면 꿈의 메시지가 더 와닿을 거야',
      '{symbolName}에서 느낀 감정을 일상에서도 만들어보려고 노력해봐',
      '꿈속 {symbolName}의 이미지를 떠올리며 마음을 정리하는 시간을 가져봐',
    ],
  },
  {
    category: 'action',
    templates: [
      '꿈에서 {symbolName} 행동은 현실에서 네가 취하고 싶은 태도를 보여주고 있어',
      '{symbolName}을(를) 하는 꿈은 지금 네 안에 축적된 에너지의 방향을 알려줘',
      '꿈속에서 {symbolName}을(를) 했다면 현실에서도 비슷한 충동을 느끼고 있을 거야',
      '{symbolName} 꿈은 네 무의식이 문제를 해결하는 방식을 보여주고 있어',
    ],
    deepAnalysisTemplates: [
      '{symbolName}은(는) 행동 심리학에서 중요한 상징이야. 꿈에서의 이 행동은 현실에서의 대처 방식을 반영해',
      '꿈에서 {symbolName}을(를) 한다는 건 그 행동이 상징하는 심리적 욕구가 강해지고 있다는 뜻이야',
      '{symbolName}과(와) 관련된 꿈은 자율성과 통제감에 대한 욕구와 밀접한 관련이 있어',
    ],
    actionTemplates: [
      '꿈속 {symbolName}의 에너지를 현실의 목표 달성에 활용해봐',
      '오늘은 {symbolName}의 상징적 의미를 생각하며 하루를 보내봐',
      '{symbolName}과(와) 비슷한 활동을 실제로 해보면 카타르시스를 느낄 수 있어',
    ],
  },
  {
    category: 'person',
    templates: [
      '꿈에 {symbolName}이(가) 나온 건 그 존재가 상징하는 감정이 활성화되었다는 뜻이야',
      '{symbolName}이(가) 등장하는 꿈은 인간관계에 대한 네 마음의 목소리야',
      '꿈속의 {symbolName}은(는) 실제 그 사람이 아니라 너의 일부분일 수도 있어~',
      '{symbolName}과(와) 함께한 꿈은 관계에 대한 네 무의식적 감정을 드러내고 있어',
    ],
    deepAnalysisTemplates: [
      '융 심리학에서 꿈속의 {symbolName}은(는) 자아의 투영일 수 있어. 그 사람의 특성 중 네가 닮고 싶거나 두려워하는 부분이 반영된 거야',
      '{symbolName}이(가) 꿈에 나타났다는 건 그 관계에서 해결되지 않은 감정이 남아 있을 수 있어',
      '꿈속의 {symbolName}은(는) 네 내면의 대화 상대야. 그 존재가 전한 말이나 행동에 주목해봐',
    ],
    actionTemplates: [
      '꿈에 나온 {symbolName}에게 실제로 연락해보면 좋은 일이 생길 수 있어',
      '{symbolName}이(가) 상징하는 감정을 글로 써보며 정리해봐',
      '{symbolName}과(와)의 관계를 돌아보며 감사한 점을 떠올려봐',
    ],
  },
  {
    category: 'emotion',
    templates: [
      '꿈에서 {symbolName}을(를) 느꼈다면 현실에서도 그 감정이 표면 아래에서 흐르고 있어',
      '{symbolName}의 파동이 꿈을 가득 채우고 있었어~ 이 감정을 무시하지 마',
      '꿈속의 {symbolName}은(는) 네 마음이 보내는 진솔한 신호야',
      '{symbolName}이(가) 지배한 꿈은 감정의 균형을 맞추라는 내면의 요청이야',
    ],
    deepAnalysisTemplates: [
      '{symbolName}은(는) 꿈에서 가장 순수한 형태로 나타나. 현실에서 이 감정을 충분히 표현하지 못하고 있을 수 있어',
      '꿈에서의 {symbolName}은(는) 억압된 감정의 해소 통로야. 이 감정을 인정하는 것이 치유의 첫걸음이야',
      '{symbolName}이(가) 꿈의 주된 감정이었다면 최근 삶에서 비슷한 상황이 반복되고 있는지 돌아봐',
    ],
    actionTemplates: [
      '{symbolName}의 감정을 건강하게 표현할 수 있는 방법을 찾아봐',
      '오늘은 {symbolName}의 감정을 있는 그대로 인정하고 받아들여봐',
      '{symbolName}을(를) 다루는 자신만의 방식을 만들어보면 좋겠어',
    ],
  },
];
