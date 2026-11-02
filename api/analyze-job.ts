import { GoogleGenAI, Type } from '@google/genai';

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI 응답 지연 (Timeout)')), timeoutMs)
    ),
  ]);
}

function generateDynamicJobAnalysis(jobText: string) {
  const isBattery = /배터리|이차전지|전극|양극|음극|화성|극판|셀|CTP/i.test(jobText);
  const isSoftware = /소프트웨어|SW|임베디드|AUTOSAR|펌웨어|제어기|자율주행|ADAS|CAN|Ethernet/i.test(jobText);
  const isSmartFactory = /스마트팩토리|생산기술|PLC|로봇|자동화|공정설비|MES/i.test(jobText);

  let companyName = '모빌리티 핵심 기업';
  const companyMatch = jobText.match(/(?:회사명|기업명)\s*[:：]\s*([^\n\r]+)/i);
  if (companyMatch && companyMatch[1].trim()) {
    companyName = companyMatch[1].trim().replace(/[\(\)\[\]주]/g, '').trim();
  } else if (/현대모비스/i.test(jobText)) companyName = '현대모비스';
  else if (/현대자동차|현대차/i.test(jobText)) companyName = '현대자동차';
  else if (/기아/i.test(jobText)) companyName = '기아';
  else if (/LG에너지솔루션|LG엔솔/i.test(jobText)) companyName = 'LG에너지솔루션';
  else if (/삼성SDI/i.test(jobText)) companyName = '삼성SDI';
  else if (/SK온/i.test(jobText)) companyName = 'SK온';
  else if (/HL만도|만도/i.test(jobText)) companyName = 'HL만도';

  let jobTitle = '전장부품 품질관리(QA/QC) 엔지니어';
  let jobField = '자동차 부품 및 전장 시스템';
  const titleMatch = jobText.match(/(?:모집 부문|모집부문|직무|채용 부문)\s*[:：]\s*([^\n\r]+)/i);
  if (titleMatch && titleMatch[1].trim()) {
    jobTitle = titleMatch[1].trim();
  } else if (isBattery) {
    jobTitle = '배터리 셀/팩 공정기술 및 생산기술 엔지니어';
    jobField = '이차전지 및 전동화 시스템';
  } else if (isSoftware) {
    jobTitle = '차량 임베디드 SW 및 SDV 제어 로직 개발자';
    jobField = 'SDV 및 차량 소프트웨어';
  } else if (isSmartFactory) {
    jobTitle = '스마트팩토리 설비제어 및 로봇 자동화 엔지니어';
    jobField = '스마트 제조기술 및 공정자동화';
  }

  const extractSection = (keywords: RegExp): string[] => {
    const lines = jobText.split(/[\r\n]+/);
    const results: string[] = [];
    let inside = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (keywords.test(trimmed)) { inside = true; continue; }
      if (inside && /^[0-9]+[.\)]\s*(?:지원|우대|담당|자격|근무|전형)/i.test(trimmed)) break;
      if (inside && /^[-*•·]\s*(.+)/.test(trimmed)) {
        const item = trimmed.replace(/^[-*•·]\s*/, '').trim();
        if (item.length > 5) results.push(item);
      }
    }
    return results;
  };

  let responsibilities = extractSection(/(?:담당\s*업무|주요\s*업무|직무\s*내용)/i);
  if (responsibilities.length === 0) {
    if (isBattery) {
      responsibilities = [
        '전극/조립/화성 공정 수율 향상 및 미세 단락(Micro-Short) 결함 유출 방지',
        'CTP(Cell-to-Pack) 신규 양산 라인 셋업 및 공정 산포 30% 저감',
        '통계적 공정관리(SPC) 및 실험계획법(DOE) 기반 공정 파라미터 최적화',
        '양산 공정 감사 및 고객사 품질 요구 표준 준수 활동',
      ];
    } else if (isSoftware) {
      responsibilities = [
        'Zonal ECU 아키텍처 기반 차량 제어 로직 설계 및 펌웨어 구현',
        '차량 네트워크(CAN-FD, 차량용 Ethernet) 프로토콜 스택 적용 및 버스 모니터링',
        'ISO 26262 ASIL-D 기능안전 만족을 위한 소프트웨어 안전 분석(SW-FMEA)',
        'HILs(Hardware-in-the-Loop) 시뮬레이터를 활용한 가상 실차 환경 검증',
      ];
    } else {
      responsibilities = [
        '차량용 핵심 전장 및 부품 신차 개발 단계 APQP 및 PPAP 승인 절차 주도',
        'IATF 16949 및 고객사 품질 표준 기반 공정 감사 및 협력사 품질 육성',
        '양산 라인 4M(작업자, 설비, 원자재, 공법) 변경점 관리 및 불량 원인 분석',
        'FMEA 및 SPC 기법을 활용한 공정능력지수(Cpk 1.67) 확보 활동',
      ];
    }
  }

  let requirements = extractSection(/(?:필수\s*지원\s*자격|지원\s*자격|필수\s*요건|자격\s*요건)/i);
  if (requirements.length === 0) {
    requirements = [
      '관련 공학 계열(기계, 전기전자, 신소재, 컴퓨터, 산업공학) 학사 이상 학위 소지자',
      '도면(2D/3D) 해석 기초 또는 전장 회로/신호 측정 장비(오실로스코프) 활용 이해도',
      '공인 어학 성적 보유자 (TOEIC 750점 이상 또는 OPIc IM2 이상)',
      '유관 부서 및 협력사와의 원활한 공학적 의사소통 및 문제해결 역량',
    ];
  }

  let preferred = extractSection(/(?:우대\s*사항|우대\s*조건|가산점)/i);
  if (preferred.length === 0) {
    preferred = [
      '품질경영기사, IATF 16949 내부심사원 또는 6시그마 Green/Black Belt 자격증 보유자',
      '자동차 전장 또는 부품사 인턴십 및 현장 실무 프로젝트 경험자',
      'CAN 통신, ISO 26262 기능안전 교육 수료 또는 Minitab/Python 데이터 분석 가능자',
      '3D CAD(CATIA, SolidWorks) 도면 해독 및 기구/회로 해석 유경험자',
    ];
  }

  const skillDict = [
    'IATF 16949', 'APQP', 'PPAP', 'FMEA', 'SPC', 'Cpk', '4M 관리',
    'CATIA', 'SolidWorks', 'AutoCAD', 'CAN 통신', 'CAN-FD', 'AUTOSAR',
    'ISO 26262', '오실로스코프', 'Minitab', 'Python', 'PLC 제어',
    'AI 비전검사', 'HILs 검증', '배터리 극판공정', 'CTP 패키징', 'C/C++'
  ];
  const technicalSkills = skillDict.filter(s => new RegExp(s.replace('+', '\\+'), 'i').test(jobText));
  if (technicalSkills.length < 4) {
    if (isBattery) technicalSkills.push('전극 공정', 'CTP 패키징', 'Minitab', 'DOE 실험계획');
    else if (isSoftware) technicalSkills.push('CAN 통신', 'AUTOSAR', 'C/C++', 'HILs 검증');
    else technicalSkills.push('IATF 16949', 'APQP/PPAP', 'FMEA', 'CATIA', '오실로스코프');
  }

  const top5Competencies = isBattery
    ? [
        { rank: 1, name: '극판 및 조립 공정 수율 최적화 역량', category: '제조공정', importance: '최우선 (Must-Have)', description: '슬러리 믹싱부터 코팅·압연 두께 편차를 관리하여 초기 양산 수율을 극대화하는 핵심 역량입니다.' },
        { rank: 2, name: 'DOE(실험계획법) 및 공정 산포 제어', category: '공학 분석', importance: '핵심 (Core)', description: '다변량 공정 조건 속에서 최적의 파라미터를 도출하고 품질 산포를 축소하는 통계적 능력입니다.' },
        { rank: 3, name: '배터리 4대 요소 전기화학 메커니즘 이해', category: '기초 지식', importance: '핵심 (Core)', description: '양·음극재 및 분리막 특성을 이해하여 마이크로 크랙과 열폭주 리스크를 사전에 예방합니다.' },
        { rank: 4, name: 'AI 비전 검사 및 결함 분류 시스템 연계', category: '스마트 제조', importance: '우대 (Preferred)', description: '외관 불량 및 셀 전극 정렬 검사 데이터를 모니터링하여 미세 결함을 유출 차단합니다.' },
        { rank: 5, name: '정량적 제조 데이터 로깅 및 분석(Minitab/Python)', category: '데이터 활용', importance: '우대 (Preferred)', description: '배터리 활성화(Formation) 공정의 저항·용량 데이터를 정량 분석하여 수율 리포트를 작성합니다.' },
      ]
    : isSoftware
    ? [
        { rank: 1, name: '차량 임베디드 C/C++ 펌웨어 구현력', category: 'SW 개발', importance: '최우선 (Must-Have)', description: 'MCU 메모리와 타이머 인터럽트를 제어하여 실시간성(Real-time)을 만족하는 제어 로직을 구현합니다.' },
        { rank: 2, name: '차량 네트워크(CAN/CAN-FD/Ethernet) 프로토콜 분석', category: '차량 통신', importance: '핵심 (Core)', description: '제어기간 메시지 패킷을 모니터링하고 신호 드롭이나 통신 지연을 디버깅하는 능력입니다.' },
        { rank: 3, name: 'ISO 26262 기능안전 및 페일세이프(Fail-Safe) 설계', category: '안전 표준', importance: '핵심 (Core)', description: '센서 결함이나 제어기 고장 발생 시 차량을 안전 모드로 전이시키는 안전 메커니즘을 설계합니다.' },
        { rank: 4, name: 'HILs 가상 시뮬레이터 실차 검증 경험', category: '검증/테스트', importance: '우대 (Preferred)', description: '실차 투입 전 가상 환경에서 수만 가지 주행 시나리오를 자동 검증하는 역량입니다.' },
        { rank: 5, name: 'AUTOSAR 표준 플랫폼 아키텍처 이해', category: 'SW 아키텍처', importance: '우대 (Preferred)', description: 'BSW와 어플리케이션 계층 분리를 이해하여 SDV 확장성 있는 코드를 작성합니다.' },
      ]
    : [
        { rank: 1, name: 'APQP 및 PPAP 품질 표준 기획 프로세스 실행력', category: '품질/표준', importance: '최우선 (Must-Have)', description: '신차 개발 단계에서 양산 부품 결함을 사전에 100% 차단하기 위한 필수 규격 준수 역량입니다.' },
        { rank: 2, name: '4M 변경점 관리 및 불량 원인 분석력(5-Why)', category: '문제해결', importance: '핵심 (Core)', description: '공정 트러블 발생 시 작업자, 설비, 원자재, 공법 관점에서 근본 원인을 추적하고 재발을 막습니다.' },
        { rank: 3, name: '도면 해석 및 공학 측정 데이터 신뢰성 확보', category: '공학 기초', importance: '핵심 (Core)', description: '기구/회로 도면 공차 및 계측기(오실로스코프, CMM) 데이터를 오차 없이 정확히 판독하고 검증합니다.' },
        { rank: 4, name: '차량 전장 신호 및 통신(CAN) 네트워크 기초 이해', category: '기술 융합', importance: '우대 (Preferred)', description: '전장화 트렌드에 따라 기계 부품 지원자라도 차량 제어기 신호 흐름을 이해할 때 강력한 차별점이 됩니다.' },
        { rank: 5, name: '통계적 공정관리(SPC) 및 공정능력지수(Cpk) 개선', category: '데이터 분석', importance: '우대 (Preferred)', description: 'Cpk 수치 향상 및 공정 산포 축소를 통계 소프트웨어(Minitab)로 정량 입증할 수 있는 역량입니다.' },
      ];

  return {
    companyName,
    jobTitle,
    jobField,
    responsibilities,
    requirements,
    preferred,
    technicalSkills,
    top5Competencies,
    keyEvaluationPoints: [
      '문제 발생 시 추상적 태도가 아닌 공학적 원인 분석(4M, 5-Why) 프레임워크를 적용할 수 있는가',
      '해당 직무의 산업 표준(IATF 16949, ISO 26262, SPC 등)에 대한 핵심 프로세스를 이해하고 있는가',
      '정량적인 데이터(공차, Cpk, 수율, 신호 파형)를 체계적으로 문서화하고 보고할 수 있는가',
    ],
    mobilityTrendInsight:
      '최근 전동화와 SDV(소프트웨어 중심 자동차) 전환으로 인해 하드웨어 단품 품질뿐 아니라 제어기 간 통신 신뢰성과 안전 규격(ISO 26262) 준수가 합격의 핵심 열쇠가 되고 있습니다.',
    recommendedInterviewTopics: [
      '신차 개발 단계에서 APQP와 PPAP의 차이점과 본인이 주도한 품질 검증 경험',
      '양산 라인에서 간헐적 불량이 발생했을 때 4M 관점에서 원인을 추적하는 접근 방식',
      '공정능력지수(Cpk) 개선을 위해 통계적 분석(SPC)을 활용했던 구체적 프로젝트 사례',
    ],
  };
}

export default async function handler(req: any, res: any) {
  // CORS handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let parsedBody = req.body;
  if (typeof parsedBody === 'string') {
    try {
      parsedBody = JSON.parse(parsedBody);
    } catch {
      parsedBody = {};
    }
  }
  const { jobText } = parsedBody || {};
  if (!jobText || typeof jobText !== 'string' || jobText.trim().length === 0) {
    return res.status(400).json({ error: '채용공고 텍스트를 입력해 주세요.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Graceful fallback for Vercel if user hasn't added env var in Vercel dashboard yet
    const fallbackData = generateDynamicJobAnalysis(jobText);
    return res.status(200).json({
      success: true,
      data: fallbackData,
      isFallback: true,
      notice: 'Vercel 환경변수에 GEMINI_API_KEY가 설정되지 않아 스마트 직무 분석 엔진이 가동되었습니다. Vercel Settings > Environment Variables에서 키를 등록할 수 있습니다.',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const prompt = `당신은 현대자동차, LG에너지솔루션, 현대모비스, 삼성SDI 등 국내 최고 모빌리티 대기업의 15년 차 채용 전문 인사/기술 면접관입니다.
다음 모빌리티 산업 채용공고 텍스트를 전문적이고 정밀하게 분석해 주세요.

채용공고 본문:
"""
${jobText.slice(0, 8000)}
"""

요구사항:
1. 기업명과 모집 직무를 식별하세요.
2. 주요 업무, 필수 자격 요건, 우대 사항, 요구 기술 및 직무 역량을 분리 정리하세요.
3. 핵심 역량 TOP 5를 선정하고, 순위, 역량명, 분야, 중요도, 상세 이유를 포함하세요.
4. 채용공고에서 중요하게 보는 핵심 평가 요소를 3-4가지 정리하세요.
5. 모빌리티 산업 관점의 직무 인사이트와 추천 면접 질문 3개를 제시하세요.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        companyName: { type: Type.STRING },
        jobTitle: { type: Type.STRING },
        jobField: { type: Type.STRING },
        responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
        requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
        preferred: { type: Type.ARRAY, items: { type: Type.STRING } },
        technicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        top5Competencies: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rank: { type: Type.INTEGER },
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              importance: { type: Type.STRING },
              description: { type: Type.STRING },
            },
          },
        },
        keyEvaluationPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        mobilityTrendInsight: { type: Type.STRING },
        recommendedInterviewTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    };

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    for (const model of modelsToTry) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction:
                '모빌리티(자동차, 이차전지, 전장부품, 스마트팩토리) 전문 채용 분석 AI로서 반드시 유효한 JSON 형식으로만 응답합니다.',
              responseMimeType: 'application/json',
              responseSchema: schema,
            },
          }),
          7000
        );

        const text = response.text || '{}';
        const parsed = JSON.parse(text);
        return res.status(200).json({ success: true, data: parsed, modelUsed: model });
      } catch (err: any) {
        console.warn(`Model ${model} failed in Vercel function:`, err.message);
      }
    }

    const fallbackData = generateDynamicJobAnalysis(jobText);
    return res.status(200).json({
      success: true,
      data: fallbackData,
      isFallback: true,
    });
  } catch (error: any) {
    const fallbackData = generateDynamicJobAnalysis(jobText);
    return res.status(200).json({
      success: true,
      data: fallbackData,
      isFallback: true,
    });
  }
}
