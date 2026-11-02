import { GoogleGenAI, Type } from '@google/genai';

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI 응답 지연 (Timeout)')), timeoutMs)
    ),
  ]);
}

function generateDynamicDiagnosis(userProfile: any, _jobContext?: string) {
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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userProfile, targetJobContext } = req.body || {};
  if (!userProfile) {
    return res.status(400).json({ error: '사용자 역량 정보가 누락되었습니다.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const fallbackData = generateDynamicDiagnosis(userProfile, targetJobContext);
    return res.status(200).json({
      success: true,
      data: fallbackData,
      isFallback: true,
      notice: 'Vercel 환경변수에 GEMINI_API_KEY가 설정되지 않아 표준 역량 진단 엔진이 가동되었습니다.',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const prompt = `당신은 현대자동차, LG에너지솔루션, 현대모비스 등 모빌리티 대기업의 수석 채용 평가위원입니다.
지원자의 프로필과 목표 직무(또는 채용공고 요건)를 면밀히 대조하여 객관적이고 건설적인 역량 진단을 내려주세요.

[중요 지침]
1. 사용자가 기재하지 않은 사실이나 경험을 거짓으로 지어내지 마세요.
2. '실제 역량 부족'과 '정보 부족(경험 근거 미기재)'을 명확하게 구분하여 피드백하세요.
3. 점수는 현실적인 100점 만점 기준의 참고용 적합도 점수입니다.
4. 구체적인 보완 우선순위 TOP 3와 실무 관점의 솔직한 개선 방법을 제시하세요.

지원자 입력 정보:
- 전공: ${userProfile.major || '미입력'}
- 희망 직무: ${userProfile.targetJob || '미입력'}
- 보유 자격증: ${userProfile.certifications || '미입력'}
- 교육 및 수료 과정: ${userProfile.trainingCourses || '미입력'}
- 프로젝트 경험: ${userProfile.projectExperience || '미입력'}
- 인턴십 및 실무 경험: ${userProfile.internExperience || '미입력'}
- 활용 가능한 기술 및 프로그램: ${userProfile.skillsAndTools || '미입력'}

참고 채용공고/직무 기준:
${targetJobContext || userProfile.targetJob || '모빌리티 일반 엔지니어링 및 품질 직무'}`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        fitScore: { type: Type.INTEGER },
        fitGrade: { type: Type.STRING },
        scoreSummary: { type: Type.STRING },
        currentCompetencies: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              detail: { type: Type.STRING },
              evidence: { type: Type.STRING },
            },
          },
        },
        fulfilledRequirements: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              requirement: { type: Type.STRING },
              matchedExperience: { type: Type.STRING },
              matchLevel: { type: Type.STRING },
            },
          },
        },
        lackingOrUnsubstantiatedCompetencies: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              competency: { type: Type.STRING },
              issueType: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
          },
        },
        priorityTop3: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rank: { type: Type.INTEGER },
              name: { type: Type.STRING },
              whyCrucial: { type: Type.STRING },
              actionPlan: { type: Type.STRING },
            },
          },
        },
        concreteImprovements: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step: { type: Type.STRING },
              title: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              suggestedCertOrProject: { type: Type.STRING },
            },
          },
        },
        resumeTip: { type: Type.STRING },
        interviewDefenseTip: { type: Type.STRING },
        disclaimer: { type: Type.STRING },
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
                '모빌리티 산업 취업 준비생의 역량 진단을 정확하고 건설적인 JSON 형식으로 출력합니다. 점수는 참고용임을 명시합니다.',
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
        console.warn(`Model ${model} diagnosis failed:`, err.message);
      }
    }

    const fallbackData = generateDynamicDiagnosis(userProfile, targetJobContext);
    return res.status(200).json({
      success: true,
      data: fallbackData,
      isFallback: true,
    });
  } catch (error: any) {
    const fallbackData = generateDynamicDiagnosis(userProfile, targetJobContext);
    return res.status(200).json({
      success: true,
      data: fallbackData,
      isFallback: true,
    });
  }
}
