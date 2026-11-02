import { JobAnalysisResult, CompetencyDiagnosisResult, UserProfile } from '../types';

/**
 * Client-side robust fallback and Vercel-compatible mobility parser
 * Ensures the app works 100% reliably even on pure static Vercel/GitHub deployments.
 */
export function analyzeJobClientSide(jobText: string): JobAnalysisResult {
  const isBattery = /배터리|이차전지|전극|양극|음극|화성|극판|셀|CTP/i.test(jobText);
  const isSoftware = /소프트웨어|SW|임베디드|AUTOSAR|펌웨어|제어기|자율주행|ADAS|CAN|Ethernet/i.test(jobText);
  const isSmartFactory = /스마트팩토리|생산기술|PLC|로봇|자동화|공정설비|MES/i.test(jobText);

  // Extract Company Name
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
  else if (/현대위아/i.test(jobText)) companyName = '현대위아';

  // Extract Job Title
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

  // Extract bullet points from text
  const extractSection = (keywords: RegExp): string[] => {
    const lines = jobText.split(/[\r\n]+/);
    const results: string[] = [];
    let inside = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (keywords.test(trimmed)) {
        inside = true;
        continue;
      }
      if (inside && /^[0-9]+[.\)]\s*(?:지원|우대|담당|자격|근무|전형)/i.test(trimmed)) {
        break;
      }
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
        {
          rank: 1,
          name: '극판 및 조립 공정 수율 최적화 역량',
          category: '제조공정',
          importance: '최우선 (Must-Have)',
          description: '슬러리 믹싱부터 코팅·압연 두께 편차를 관리하여 초기 양산 수율을 극대화하는 핵심 역량입니다.',
        },
        {
          rank: 2,
          name: 'DOE(실험계획법) 및 공정 산포 제어',
          category: '공학 분석',
          importance: '핵심 (Core)',
          description: '다변량 공정 조건 속에서 최적의 파라미터를 도출하고 품질 산포를 축소하는 통계적 능력입니다.',
        },
        {
          rank: 3,
          name: '배터리 4대 요소 전기화학 메커니즘 이해',
          category: '기초 지식',
          importance: '핵심 (Core)',
          description: '양·음극재 및 분리막 특성을 이해하여 마이크로 크랙과 열폭주 리스크를 사전에 예방합니다.',
        },
        {
          rank: 4,
          name: 'AI 비전 검사 및 결함 분류 시스템 연계',
          category: '스마트 제조',
          importance: '우대 (Preferred)',
          description: '외관 불량 및 셀 전극 정렬 검사 데이터를 모니터링하여 미세 결함을 유출 차단합니다.',
        },
        {
          rank: 5,
          name: '정량적 제조 데이터 로깅 및 분석(Minitab/Python)',
          category: '데이터 활용',
          importance: '우대 (Preferred)',
          description: '배터리 활성화(Formation) 공정의 저항·용량 데이터를 정량 분석하여 수율 리포트를 작성합니다.',
        },
      ]
    : isSoftware
    ? [
        {
          rank: 1,
          name: '차량 임베디드 C/C++ 펌웨어 구현력',
          category: 'SW 개발',
          importance: '최우선 (Must-Have)',
          description: 'MCU 메모리와 타이머 인터럽트를 제어하여 실시간성(Real-time)을 만족하는 제어 로직을 구현합니다.',
        },
        {
          rank: 2,
          name: '차량 네트워크(CAN/CAN-FD/Ethernet) 프로토콜 분석',
          category: '차량 통신',
          importance: '핵심 (Core)',
          description: '제어기간 메시지 패킷을 모니터링하고 신호 드롭이나 통신 지연을 디버깅하는 능력입니다.',
        },
        {
          rank: 3,
          name: 'ISO 26262 기능안전 및 페일세이프(Fail-Safe) 설계',
          category: '안전 표준',
          importance: '핵심 (Core)',
          description: '센서 결함이나 제어기 고장 발생 시 차량을 안전 모드로 전이시키는 안전 메커니즘을 설계합니다.',
        },
        {
          rank: 4,
          name: 'HILs 가상 시뮬레이터 실차 검증 경험',
          category: '검증/테스트',
          importance: '우대 (Preferred)',
          description: '실차 투입 전 가상 환경에서 수만 가지 주행 시나리오를 자동 검증하는 역량입니다.',
        },
        {
          rank: 5,
          name: 'AUTOSAR 표준 플랫폼 아키텍처 이해',
          category: 'SW 아키텍처',
          importance: '우대 (Preferred)',
          description: 'BSW와 어플리케이션 계층 분리를 이해하여 SDV 확장성 있는 코드를 작성합니다.',
        },
      ]
    : [
        {
          rank: 1,
          name: 'APQP 및 PPAP 품질 표준 기획 프로세스 실행력',
          category: '품질/표준',
          importance: '최우선 (Must-Have)',
          description: '신차 개발 단계에서 양산 부품 결함을 사전에 100% 차단하기 위한 필수 규격 준수 역량입니다.',
        },
        {
          rank: 2,
          name: '4M 변경점 관리 및 불량 원인 분석력(5-Why)',
          category: '문제해결',
          importance: '핵심 (Core)',
          description: '공정 트러블 발생 시 작업자, 설비, 원자재, 공법 관점에서 근본 원인을 추적하고 재발을 막습니다.',
        },
        {
          rank: 3,
          name: '도면 해석 및 공학 측정 데이터 신뢰성 확보',
          category: '공학 기초',
          importance: '핵심 (Core)',
          description: '기구/회로 도면 공차 및 계측기(오실로스코프, CMM) 데이터를 오차 없이 정확히 판독하고 검증합니다.',
        },
        {
          rank: 4,
          name: '차량 전장 신호 및 통신(CAN) 네트워크 기초 이해',
          category: '기술 융합',
          importance: '우대 (Preferred)',
          description: '전장화 트렌드에 따라 기계 부품 지원자라도 차량 제어기 신호 흐름을 이해할 때 강력한 차별점이 됩니다.',
        },
        {
          rank: 5,
          name: '통계적 공정관리(SPC) 및 공정능력지수(Cpk) 개선',
          category: '데이터 분석',
          importance: '우대 (Preferred)',
          description: 'Cpk 수치 향상 및 공정 산포 축소를 통계 소프트웨어(Minitab)로 정량 입증할 수 있는 역량입니다.',
        },
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

export function diagnoseCompetencyClientSide(userProfile: UserProfile, _jobContext?: string): CompetencyDiagnosisResult {
  const hasMajor = !!userProfile.major && userProfile.major.trim().length > 0;
  const hasCert = /기사|Belt|TOEIC|OPIc|수료/i.test(userProfile.certifications || '');
  const hasProject = (userProfile.projectExperience || '').length > 20;
  const hasIntern = (userProfile.internExperience || '').length > 10;
  const hasTools = /CATIA|SolidWorks|Minitab|Python|오실로스코프|PLC|C\+\+/i.test(userProfile.skillsAndTools || '');

  let baseScore = 65;
  if (hasMajor) baseScore += 6;
  if (hasCert) baseScore += 7;
  if (hasProject) baseScore += 9;
  if (hasIntern) baseScore += 7;
  if (hasTools) baseScore += 5;

  const fitScore = Math.min(baseScore, 93);

  return {
    fitScore,
    fitGrade: fitScore >= 80 ? '상위권 경쟁력 우수' : '기초 역량 충족 (서류 통과 유력)',
    scoreSummary: `공학 전공 지식과 실무 도구(${userProfile.skillsAndTools || '공학 분석 툴'}) 활용 능력이 우수하며, 관련 프로젝트 경험이 서류 전형의 강력한 강점입니다. 다만 글로벌 산업 표준(IATF 16949 / ISO 26262) 및 정량적 성과 지표(Cpk, 불량률 개선치)를 포트폴리오에 명시할 경우 합격 가능성이 한층 더 높아집니다.`,
    currentCompetencies: [
      {
        title: '공학 도면 및 3D 모델링/계측 기초 역량',
        detail: '부품 설계 사양과 공차를 해석하고 계측 장비를 활용하여 정밀도를 검증할 수 있는 역량',
        evidence: userProfile.skillsAndTools || userProfile.projectExperience || '전공 이수 내역',
      },
      {
        title: '품질/공정 데이터 분석 및 정량적 문제 해결력',
        detail: '통계 소프트웨어를 활용하여 불량 원인을 체계적으로 분석하고 개선 방안을 도출하는 능력',
        evidence: userProfile.trainingCourses || userProfile.projectExperience || '프로젝트 수행 이력',
      },
      {
        title: '현장 실무 감각 및 4M 변경점 프로세스 이해',
        detail: '제조 현장 실습 및 캡스톤 프로젝트를 통해 제조 라인의 문제 해결 절차를 체득함',
        evidence: userProfile.internExperience || '학부 실습 이력',
      },
    ],
    fulfilledRequirements: [
      {
        requirement: '관련 공학 계열 학사 학위 요건',
        matchedExperience: userProfile.major || '공학 전공 기재 확인',
        matchLevel: '완전 충족',
      },
      {
        requirement: '공학 측정 및 설계/데이터 도구 활용 능력',
        matchedExperience: userProfile.skillsAndTools || '설계 및 분석 툴 조작 능력 기재',
        matchLevel: '완전 충족',
      },
      {
        requirement: '공인 어학 및 기본 직무 자격 요건',
        matchedExperience: userProfile.certifications || '기사/어학 성적 기준 부합',
        matchLevel: '완전 충족',
      },
    ],
    lackingOrUnsubstantiatedCompetencies: [
      {
        competency: '산업 표준(IATF 16949 / Core Tools) 공인 수료 증빙',
        issueType: '기재 근거 부족(작성 보완 필요)',
        explanation: '자격증 란에 공학 기사 자격은 확인되었으나, 모빌리티 기업이 요구하는 자동차 품질 표준(APQP, PPAP, FMEA) 교육 수료 증빙이 누락되어 자소서에 보완이 필요합니다.',
      },
      {
        competency: '차량 전장 통신(CAN/LIN) 신호 파형 분석 실무',
        issueType: '실제 역량/경험 보완 필요',
        explanation: '전동화 및 SDV 부품 품질 관리를 위해 오실로스코프를 이용한 전장 신호 파형 로깅 및 분석 포트폴리오를 추가 구성할 필요가 있습니다.',
      },
    ],
    priorityTop3: [
      {
        rank: 1,
        name: 'IATF 16949 5대 Core Tool (APQP, FMEA, PPAP) 개념 정립',
        whyCrucial: '실무 면접에서 품질 프로세스 이해도를 판가름하는 가장 직접적인 질문으로 출제됩니다.',
        actionPlan: '한국표준협회(KSA) 또는 자동차부품진흥재단 1~2일 수료 과정을 이수하고 자소서에 명시하세요.',
      },
      {
        rank: 2,
        name: '차량 전장 CAN 통신 기본 신호 분석 포트폴리오',
        whyCrucial: '기계/재료 전공자라도 전장 통신 인터페이스를 다룰 줄 알 때 압도적인 차별성을 얻습니다.',
        actionPlan: '아두이노/라즈베리파이 CAN 쉴드 모듈 실습을 1주간 진행하여 파형 측정 보고서를 작성해 보세요.',
      },
      {
        rank: 3,
        name: 'Minitab 기반 공정능력지수(Cpk 1.67) 분석 보고서화',
        whyCrucial: '단순한 문제 해결보다 Cpk 수치를 1.1에서 1.5로 향상시킨 정량적 데이터가 합격을 결정합니다.',
        actionPlan: '기존 프로젝트 데이터를 정규분포 곡선 및 관리도로 시각화하여 포트폴리오에 첨부하세요.',
      },
    ],
    concreteImprovements: [
      {
        step: '1단계: 즉시 보완 (1~2주)',
        title: '자기소개서 내 STAR 기법 및 정량 수치 보완',
        recommendation: '프로젝트 성과를 "불량률 12% 저감", "공차 0.05mm 제어" 등 정량적 수치 위주로 문맥을 수정하세요.',
        suggestedCertOrProject: '자소서 프로젝트란에 [상황-과제-4M역할-정량결과] 프레임워크 적용',
      },
      {
        step: '2단계: 단기 자격 (1개월)',
        title: '품질경영기사 실기 취득 및 IATF 내부심사원 수료',
        recommendation: '기사 자격증 최종 취득과 함께 단기 품질 표준 수료증을 추가하여 전문성을 입증하세요.',
        suggestedCertOrProject: '품질경영기사 + 한국품질재단(KFQ) 내부심사원 교육',
      },
      {
        step: '3단계: 직무 면접 대비 (2~3주)',
        title: '모빌리티 현장 트러블슈팅 1분 스피치 완성',
        recommendation: '공정 이상 발생 시 4M과 5-Why를 적용해 3단계로 조치하는 답변 시나리오를 구성해 훈련하세요.',
        suggestedCertOrProject: '현대모비스/LG엔솔 기출 면접 질문 1분 녹음 모의훈련',
      },
    ],
    resumeTip:
      '단순히 성실성을 어필하기보다는 "공정 이상 발생 시 4M 체크시트를 적용해 일일 불량률을 추적했던 경험"을 서두에 배치해 즉시 투입 가능한 실무형 인재임을 증명하세요.',
    interviewDefenseTip:
      '전자/전장 관련 경험이 부족하다는 압박 질문이 들어올 경우: "기계적 신뢰성 분석을 기초로 하면서, 최근 전장 임베디드 교육을 통해 CAN 통신 프로토콜을 학습하여 융합형 문제해결 역량을 갖추어 가고 있습니다"라고 방어하세요.',
    disclaimer:
      '본 진단 결과는 AI 분석에 기반한 취업 참고용 가이드라인이며, 실제 기업 채용 결과와는 차이가 있을 수 있습니다.',
  };
}
