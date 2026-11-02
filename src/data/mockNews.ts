import { MobilityNewsItem } from '../types';

export const MOCK_NEWS_DATA: MobilityNewsItem[] = [
  {
    id: 'news-1',
    category: '자동차',
    title: '현대차그룹, 차세대 SDV 페이스카 공개 및 전동화 통합 제어 아키텍처 가속화',
    date: '2026.10.28 [예시 데이터]',
    summary: [
      '소프트웨어 중심 자동차(SDV) 전환을 위한 차세대 중앙집중형 전자제어 아키텍처(Zonal Architecture) 로드맵 구체화.',
      '하드웨어와 소프트웨어의 완전한 분리로 OTA(무선 업데이트)를 통한 차량 성능 및 안전 기능 지속 업그레이드 체계 구축.',
      '완성차 연구개발(R&D) 조직 개편을 통해 차량 SW 및 제어기 엔지니어링 인력 수시 채용 대폭 확대.',
    ],
    relatedIndustriesAndCompanies: ['현대자동차', '기아', '현대오토에버', '포티투닷(42dot)'],
    whyJobSeekersShouldCare:
      '기존 기계 설계 위주였던 완성차 채용의 무게중심이 임베디드 SW, 차량 네트워크(CAN/CAN-FD/Ethernet), 시스템 엔지니어링으로 급격히 이동하고 있음을 보여줍니다.',
    relatedCompetencies: ['차량 임베디드 SW', 'CAN/Ethernet 통신', 'AUTOSAR 표준', 'OTA 시스템 검증'],
    interviewQuestions: [
      {
        question: 'SDV(Software Defined Vehicle) 전환이 기존 내연기관/전기차 개발 프로세스와 다른 가장 큰 차이점은 무엇이며 본인 전공과 어떻게 연결할 수 있나요?',
        hint: '하드웨어 의존적 개발에서 기능 모듈화/도메인 중앙제어로의 진화, SW 생애주기 관리 및 지속적 가치 제공을 언급하세요.',
      },
      {
        question: '차량 제어기의 기능 안전(ISO 26262) 관점에서 무선 업데이트(OTA) 시 발생할 수 있는 리스크와 대응 방안은 무엇인가요?',
        hint: '페일세이프(Fail-Safe), 롤백 메커니즘, 듀얼 뱅크 플래시 메모리 구조를 언급하면 기술적 깊이를 어필할 수 있습니다.',
      },
    ],
  },
  {
    id: 'news-2',
    category: '이차전지',
    title: 'K-배터리 3사, 차세대 고전압 미드니켈 및 LFP·전고체 양산 라인 수율 95% 도전',
    date: '2026.10.25 [예시 데이터]',
    summary: [
      '전기차 대중화(캐즘 극복)를 위해 가격 경쟁력을 갖춘 고전압 미드니켈(Mid-Ni) 및 CTP(Cell-to-Pack) 기술 신규 양산 라인 도입.',
      '전극 공정의 건식 코팅 기술 및 배터리 활성화(Formation) 공정 내 AI 기반 이상 감지 도입으로 초기 수율 목표 95% 달성 추진.',
      '양극재·음극재 신소재 개발 및 셀 제조 공정 엔지니어의 현장 품질 보증 역량 수요 급증.',
    ],
    relatedIndustriesAndCompanies: ['LG에너지솔루션', '삼성SDI', 'SK온', '포스코퓨처엠', '에코프로비엠'],
    whyJobSeekersShouldCare:
      '이차전지 기업들이 단순 설비 증설을 넘어 "원가 절감과 공정 수율 극대화"에 집중하고 있어, 생산기술·품질관리 엔지니어에게 공정 분석과 통계적 품질관리(SPC) 역량이 절대적인 합격 기준이 됩니다.',
    relatedCompetencies: ['배터리 전극/조립 공정', 'CTP 패키징', '통계적 공정관리(SPC)', '전고체 배터리 소재 평가'],
    interviewQuestions: [
      {
        question: '이차전지 제조 공정(극판-조립-화성) 중 수율에 가장 큰 영향을 미치는 병목 구간은 어디이며, 이를 개선하기 위한 엔지니어링 접근법은 무엇인가요?',
        hint: '극판 코팅/압연 공정의 두께 편차 관리나 화성 공정의 가스 발생 및 내부 저항 측정 정밀도를 사례로 제시하세요.',
      },
      {
        question: '최근 배터리 업계의 화두인 LFP vs NCM(삼원계)의 장단점과, 본인이 지원한 직무에서 이를 어떻게 대응해야 하는지 설명해 보세요.',
        hint: '에너지 밀도 vs 열적 안정성 및 가격 경쟁력 트레이드오프, BMS 및 팩 설계 최적화를 통한 극복 전략을 연결하세요.',
      },
    ],
  },
  {
    id: 'news-3',
    category: '자동차 부품 및 전장',
    title: '현대모비스·HL만도, 전자식 제동(EMB) 및 스티어바이와이어(SbW) 글로벌 수주 확대',
    date: '2026.10.20 [예시 데이터]',
    summary: [
      '기계적 연결 없이 전기 신호로 조향·제동을 제어하는 X-by-Wire 기술이 글로벌 완성차에 대거 탑재 시작.',
      '유압 액추에이터를 전기 모터와 전자제어유닛(ECU)으로 대체함에 따라 전장 시스템의 다중 안전 백업(Redundancy) 설계 필수화.',
      '품질본부 중심 IATF 16949 및 ASPICE Level 3 준수 프로세스 감사 강화로 관련 품질 엔지니어 수요 증가.',
    ],
    relatedIndustriesAndCompanies: ['현대모비스', 'HL만도', 'HL클레무브', 'LG이노텍'],
    whyJobSeekersShouldCare:
      '샤시 부품이 전통 기계 장치에서 초정밀 메카트로닉스/전장 부품으로 완전히 통합되면서 기계공학과 전자공학 융합 지식을 갖춘 품질/설계 엔지니어가 취업 시장에서 가장 높은 선호도를 얻고 있습니다.',
    relatedCompetencies: ['X-by-Wire 시스템', '모터 제어(BLDC)', 'ASPICE 인증', 'IATF 16949 실무', 'FMEA/FTA 분석'],
    interviewQuestions: [
      {
        question: '스티어바이와이어(SbW)와 같은 바이와이어 시스템에서 전자 제어 결함이 발생했을 때 차량 제어를 안전하게 유지하기 위한 이중화(Redundancy) 설계 개념을 설명하세요.',
        hint: '듀얼 모터, 독립 센서 회로, 독립 ECU 전원 라인, 페일 오퍼레이셔널(Fail-Operational) 개념을 설명하세요.',
      },
    ],
  },
  {
    id: 'news-4',
    category: '전기차 및 자율주행',
    title: '레벨 3+ 자율주행 상용화 본격화... 고해상도 4D 이미징 레이더 및 센서 융합 기술 채택',
    date: '2026.10.15 [예시 데이터]',
    summary: [
      '악천후 환경에서도 300m 이상 물체 식별이 가능한 4D 이미징 레이더와 단거리 라이다 융합 시스템 본격 양산 돌입.',
      '단순 룰 기반 제어에서 엔드투엔드(E2E) AI 딥러닝 기반 자율주행 파운데이션 모델 차량 실장 테스트 진행.',
      '실차 테스트 데이터 로깅, 이상 시나리오 필터링, SILs/HILs 시뮬레이션 검증 인력 수요 확대.',
    ],
    relatedIndustriesAndCompanies: ['스트라드비젼', '현대모비스', '포티투닷', '카카오모빌리티'],
    whyJobSeekersShouldCare:
      '자율주행 R&D뿐 아니라 실차 시험평가, 필드 품질 검증 직무에서도 ROS, CANoe, Python 기반 데이터 로깅 및 분석 툴을 다룰 줄 아는 실무형 인재를 우대하고 있습니다.',
    relatedCompetencies: ['센서 융합(Sensor Fusion)', 'HILs 검증 시스템', 'ROS/Linux', 'Python 데이터 분석', '실차 시험평가'],
    interviewQuestions: [
      {
        question: '카메라, 레이더, 라이다 센서 각각의 물리적 한계점과 이를 상호 보완하는 센서 융합(Sensor Fusion) 아키텍처에 대해 본인의 생각을 말해주세요.',
        hint: '카메라(조도/날씨 취약, 색상/표지판 우수), 레이더(기상 무관, 속도 정확, 형상 인식 한계), 라이다(정밀 거리계측, 고가/우천 취약) 비교.',
      },
    ],
  },
  {
    id: 'news-5',
    category: '스마트팩토리',
    title: '모빌리티 제조 혁신: AI 비전 검사기 및 자율이동로봇(AMR) 기반 다품종 소량 생산 라인 확산',
    date: '2026.10.10 [예시 데이터]',
    summary: [
      '배터리 팩 및 자동차 전장 라인에 딥러닝 AI 비전 검사를 전수 적용하여 마이크로 크랙 및 용접 결함 유출률 제로화 추진.',
      '고정식 컨베이어 벨트를 철거하고 AMR(자율이동로봇)과 디지털 트윈을 결합한 유연 셀(Cell) 생산 시스템 도입 가속화.',
      '생산기술 및 제조 엔지니어의 PLC(프로그래머블 로직 제어기), MES 연동, 로봇 티칭 역량이 핵심 채용 평가 항목으로 부상.',
    ],
    relatedIndustriesAndCompanies: ['현대위아', '현대오토에버', 'LG CNS', '두산로보틱스', '한화로보틱스'],
    whyJobSeekersShouldCare:
      '모빌리티 공장은 과거 단순 노무 조립에서 첨단 로봇·IT 융합 공장으로 진화했습니다. 생산기술/설비기술 지원자는 기계 메커니즘뿐 아니라 PLC, 센서 인터페이스, 공정 데이터 분석 경험을 어필해야 합니다.',
    relatedCompetencies: ['PLC 제어(미쓰비시/지멘스)', 'AI 비전 검사', '디지털 트윈', 'AMR 물류 제어', 'MES/SCADA 연동'],
    interviewQuestions: [
      {
        question: '스마트팩토리 제조 라인에서 AI 비전 검사를 도입할 때 발생하는 과검(False Positive)과 미검(False Negative)의 문제점과 이를 최소화하기 위한 품질 엔지니어의 역할은 무엇인가요?',
        hint: '과검은 수율 저하 및 불필요 폐기, 미검은 고객사 불량 유출 치명타. 데이터 레이블링 개선과 임계값(Threshold) 튜닝 프로세스를 설명하세요.',
      },
    ],
  },
  {
    id: 'news-6',
    category: '품질 및 제조기술',
    title: '모빌리티 부품사, IATF 16949 개정 및 4M 변경점 사전 검증 체계 고도화',
    date: '2026.10.05 [예시 데이터]',
    summary: [
      '완성차 고객사의 리콜 비용 급증에 따라 1·2차 협력사를 대상으로 신차 양산 전 APQP(사전제품품질기획) 및 PPAP 승인 절차 엄격 적용.',
      '4M(Man, Machine, Material, Method) 변경 시 실시간 추적성(Traceability) 관리 시스템 구축 의무화.',
      '품질경영기사, 6시그마(Six Sigma), FMEA(고장형태영향분석) 실무 자격 및 경험을 보유한 신입/인턴 채용 선호 뚜렷.',
    ],
    relatedIndustriesAndCompanies: ['현대트랜시스', '현대케피코', '서연이화', 'SL', '에스엘'],
    whyJobSeekersShouldCare:
      '부품사 품질관리(QC) 및 품질보증(QA)은 신입 채용 비중이 높은 핵심 직무입니다. IATF 16949 5대 Core Tool(APQP, FMEA, MSA, SPC, PPAP) 개념을 정확히 이해하고 면접에 임해야 차별화됩니다.',
    relatedCompetencies: ['IATF 16949 Core Tools', 'APQP/PPAP 승인 절차', 'FMEA/MSA/SPC', '4M 변경점 관리', '품질비용(COPQ) 분석'],
    interviewQuestions: [
      {
        question: '신차 개발 단계에서 APQP(사전제품품질기획)와 PPAP(양산부품승인절차)가 왜 중요하며, 양산 후 발생할 수 있는 품질 클레임을 사전에 어떻게 예방할 수 있나요?',
        hint: '설계 및 공정 FMEA를 통한 잠재 고장 모드 사전 차단, 초기 공정 능력 지수(Cpk) 1.67 이상 확보, 4M 검증 프로세스 연계.',
      },
    ],
  },
];

export const SAMPLE_JOB_POSTINGS = [
  {
    id: 'qa_qc',
    label: '현대모비스 전장품질 (기본 예시)',
    content: `[채용공고]
회사명: 현대모비스 (주)
모집 부문: 전장부품 품질관리 (QA/QC) 신입 / 채용연계형 인턴
근무지: 경기도 용인 마북 연구소 / 진천 공장

1. 담당 업무
- 차량용 통합 바디제어기(IBU) 및 자율주행 센서(레이더/라이다) 부품 품질 보증
- 신차 개발 단계 APQP(사전제품품질기획) 및 PPAP(양산부품승인절차) 프로세스 주도
- IATF 16949 및 고객사 품질 표준 기반 공정 감사(Audit) 및 협력사 품질 육성
- 양산 라인 4M(작업자, 설비, 원자재, 작업방법) 변경점 관리 및 유출 불량 원인 분석
- FMEA(고장형태영향분석), SPC(통계적 공정관리) 기법을 활용한 공정 능력 지수(Cpk) 향상 활동

2. 필수 지원 자격
- 4년제 정규대학 기계공학, 전기전자공학, 신소재공학, 산업공학 계열 학사 이상 졸업자 또는 졸업예정자
- 회로도 기초 해석 능력 및 공학적 측정 장비(오실로스코프, 멀티미터, 버니어캘리퍼스 등) 활용 이해도
- 공인 어학 성적 보유자 (TOEIC 750점 이상 또는 OPIc IM2 이상)
- 해외여행에 결격 사유가 없는 자

3. 우대 사항
- IATF 16949 내부심사원 자격증 취득자 또는 품질경영기사, 6시그마(Green/Black Belt) 보유자
- 자동차 부품사 인턴십 또는 생산기술/품질 관련 실무 프로젝트 유경험자
- 2D/3D CAD (CATIA, SolidWorks) 도면 해독 및 기초 설계 가능자
- 전장 CAN 통신 기본 이해 및 차량 기능안전(ISO 26262) 교육 수료자
- 모빌리티 전동화 및 스마트팩토리 공정 데이터 분석(Python, Minitab) 유경험자`,
  },
  {
    id: 'battery',
    label: 'LG에너지솔루션 배터리 공정개발',
    content: `[채용공고]
회사명: LG에너지솔루션
모집 부문: 차세대 원통형/파우치형 배터리 셀 공정개발 및 생산기술 신입
근무지: 충북 오창 에너지플랜트 / 대전 기술연구원

1. 담당 업무
- 극판 공정(슬러리 믹싱, 고속 코팅, 롤프레싱 압연, 슬리팅) 수율 및 설비 최적화
- 조립 및 화성(Formation) 공정 내 AI 비전 검사 데이터 분석 및 미세 단락(Micro-Short) 불량 방지
- CTP(Cell-to-Pack) 및 고에너지밀도 전극 신공법 양산 라인 셋업
- 통계적 공정관리(SPC) 및 실험계획법(DOE)을 통한 공정 산포 30% 저감

2. 필수 지원 자격
- 화학공학, 신소재/재료공학, 기계공학 학사 이상 학위 소지자
- 배터리 4대 요소(양극재, 음극재, 분리막, 전해액) 및 전기화학 기본 지식 보유자
- 어학 요건: TOEIC 800점 또는 OPIc IM3 이상

3. 우대 사항
- 2차전지 전극/셀 제조 관련 학부연구생 또는 관련 공정 실습 이수자
- Minitab 또는 Python을 활용한 대용량 제조 데이터 분석 가능자
- 스마트팩토리 설비 인터페이스 및 센서 데이터 로깅 유경험자`,
  },
  {
    id: 'sdv_sw',
    label: '현대자동차 SDV 자율주행 SW 제어',
    content: `[채용공고]
회사명: 현대자동차
모집 부문: R&D본부 SDV 제어기 임베디드 소프트웨어 개발 신입
근무지: 경기도 화성 남양연구소

1. 담당 업무
- 차세대 전자 아키텍처(Zonal ECU) 기반 차량 바디/섀시 제어 로직 설계
- 차량 네트워크(CAN-FD, 차량용 Ethernet) 프로토콜 스택 구현 및 패킷 분석
- ISO 26262 ASIL-D 기능안전 만족을 위한 소프트웨어 안전 분석(SW-FMEA, HAZOP)
- HILs(Hardware-in-the-Loop) 시뮬레이터를 활용한 가상 실차 환경 제어 로직 검증

2. 필수 지원 자격
- 컴퓨터공학, 전기전자공학, 제어계측공학 학사 이상
- C/C++ 기반 임베디드 펌웨어 개발 기초 역량
- 마이크로컨트롤러(MCU) 아키텍처 이해 및 인터페이스(SPI, I2C, UART) 제어 경험

3. 우대 사항
- AUTOSAR Classic/Adaptive 플랫폼 교육 이수 또는 프로젝트 유경험자
- Vector사 툴체인(CANoe, CANalyzer) 사용 가능자
- 자율주행 모빌리티 경진대회 또는 실차 제어 캡스톤 프로젝트 수상자`,
  },
];

export const SAMPLE_JOB_POSTING = SAMPLE_JOB_POSTINGS[0].content;

export const SAMPLE_USER_PROFILE: {
  major: string;
  targetJob: string;
  certifications: string;
  trainingCourses: string;
  projectExperience: string;
  internExperience: string;
  skillsAndTools: string;
} = {
  major: '기계공학과 (부전공: 전자공학 기초)',
  targetJob: '현대모비스 / 자동차 부품 및 전장 품질관리(QC/QA)',
  certifications: '일반기계기사, 품질경영기사 1차 필기합격(실기 준비중), TOEIC 820점, OPIc IM3',
  trainingCourses:
    '현대오토에버 모빌리티 임베디드 SW 기초 아카데미 (80시간 수료), 스마트팩토리 품질 데이터 분석 교육 (미니탭/파이썬 40시간)',
  projectExperience:
    '1. 졸업 캡스톤: 모빌리티 조향 모터 진동 데이터 분석 기반 고장 예지 시스템 구축 (센서 부착, 신호 처리, 불량률 12% 예측 알고리즘 설계)\n2. 공학설계 프로젝트: 3D CAD(CATIA)를 활용한 전기차 배터리 팩 냉각 하우징 경량화 설계 및 공차 해석',
  internExperience:
    '1차 자동차 샤시 부품 협력사 하계 6주 현장 실습 (조립 라인 치공구 검사 지원, 일일 불량률 데이터 취합 및 4M 체크시트 작성 보조)',
  skillsAndTools:
    'CATIA V5, SolidWorks, Minitab(SPC 공정능력 분석), 오실로스코프 기본 조작, Excel 고급 수식 및 피벗테이블, Python 기초',
};
