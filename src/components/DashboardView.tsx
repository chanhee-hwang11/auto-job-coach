import React, { useState } from 'react';
import {
  NavigationTab,
  JobAnalysisResult,
  CompetencyDiagnosisResult,
  MobilityNewsItem,
} from '../types';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileSearch,
  UserCheck,
  Newspaper,
  CheckCircle2,
  Building2,
  Target,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  targetJob: string;
  onUpdateTargetJob: (job: string) => void;
  jobAnalysis: JobAnalysisResult | null;
  competencyDiagnosis: CompetencyDiagnosisResult | null;
  recommendedNews: MobilityNewsItem[];
  onSelectNewsItem: (news: MobilityNewsItem) => void;
  onLoadSampleJobAndAnalyze: () => void;
  onLoadSampleProfileAndDiagnose: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  targetJob,
  onUpdateTargetJob,
  jobAnalysis,
  competencyDiagnosis,
  recommendedNews,
  onSelectNewsItem,
  onLoadSampleJobAndAnalyze,
  onLoadSampleProfileAndDiagnose,
}) => {
  const [localJobInput, setLocalJobInput] = useState(targetJob || '현대모비스 전장부품 품질관리(QA/QC)');

  const popularKeywords = [
    '현대모비스 전장품질',
    'LG에너지솔루션 배터리 공정기술',
    '현대자동차 자율주행 제어 R&D',
    '삼성SDI 배터리 셀 개발',
    '현대위아 스마트팩토리 로봇제어',
    'HL만도 샤시 X-by-Wire 설계',
  ];

  const handleApplyJob = (val: string) => {
    setLocalJobInput(val);
    onUpdateTargetJob(val);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>차세대 모빌리티 취업 올인원 파트너</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            나만의 모빌리티 취업 전략을 시작하세요
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            자동차·이차전지·전장·스마트팩토리 산업은 지금 거대한 전환기를 맞고 있습니다.
            실제 채용공고 분석부터 내 역량 정밀 진단, 최신 산업 트렌드 기반 면접 대비까지
            AI와 함께 가장 확실한 합격 로드맵을 설계하세요.
          </p>

          {/* Target Job Input Area */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 max-w-2xl">
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span>관심 있거나 목표하는 기업 및 희망 직무</span>
              </span>
              <span className="text-[11px] text-blue-300">실시간 연동</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={localJobInput}
                onChange={(e) => setLocalJobInput(e.target.value)}
                placeholder="예: 현대모비스 전장부품 품질관리, LG에너지솔루션 배터리 공정 등"
                className="flex-1 bg-white text-slate-900 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleApplyJob(localJobInput)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 whitespace-nowrap shadow-md"
              >
                <span>목표 설정</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Popular quick chips */}
            <div className="mt-2.5 flex items-center flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1">추천 검색:</span>
              {popularKeywords.map((item) => (
                <button
                  key={item}
                  onClick={() => handleApplyJob(item)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white/15 hover:bg-white/25 text-slate-200 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Step Quick Workflow Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('jobAnalysis')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileSearch className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
              공고 분석하기 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">1. 채용공고 AI 분석</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            채용공고를 붙여넣으면 Gemini AI가 직무 핵심 역량 TOP 5와 면접관의 중점 평가 요소를 추출합니다.
          </p>
        </div>

        <div
          onClick={() => onNavigate('competency')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
              역량 진단하기 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">2. 내 역량 정밀 진단</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            나의 전공·프로젝트·자격증을 공고와 대조하여 직무 적합도 점수와 부족 역량 TOP 3를 도출합니다.
          </p>
        </div>

        <div
          onClick={() => onNavigate('industryNews')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Newspaper className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-cyan-700 group-hover:translate-x-1 transition-transform inline-flex items-center">
              뉴스 보러가기 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">3. 산업 뉴스 & 면접 대비</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            자동차·이차전지·스마트팩토리 6대 분야별 최신 이슈와 실제 출제될 면접 예상 질문을 학습합니다.
          </p>
        </div>
      </section>

      {/* 3. Core Status Dashboard (Recent Analysis + Fit Score + Missing Competencies) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Job Analysis Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">최근 채용공고 분석</h2>
                  <p className="text-xs text-slate-500">목표 공고 직무 요건 요약</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('jobAnalysis')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                상세보기
              </button>
            </div>

            {jobAnalysis ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs font-bold text-blue-700 mb-0.5">
                    {jobAnalysis.companyName || '모빌리티 기업'}
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {jobAnalysis.jobTitle || '직무명'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    분야: {jobAnalysis.jobField || '모빌리티 부품/품질'}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>도출된 핵심 역량 TOP 5</span>
                    <span className="text-[11px] text-blue-600 font-medium">5개 분석완료</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {jobAnalysis.top5Competencies?.slice(0, 3).map((comp) => (
                      <li key={comp.rank} className="flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {comp.rank}
                        </span>
                        <span className="font-medium text-slate-800 truncate">{comp.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {jobAnalysis.keyEvaluationPoints && jobAnalysis.keyEvaluationPoints.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      핵심 평가 포인트
                    </span>
                    <p className="text-xs text-slate-700 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50 line-clamp-2">
                      💡 {jobAnalysis.keyEvaluationPoints[0]}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileSearch className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium mb-1">
                  아직 분석된 채용공고가 없습니다.
                </p>
                <p className="text-[11px] text-slate-400 mb-3">
                  공고를 입력하거나 1초 만에 예시 공고를 로드해 보세요.
                </p>
                <button
                  onClick={onLoadSampleJobAndAnalyze}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>예시 공고 즉시 분석</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('jobAnalysis')}
              className="w-full text-center text-xs font-medium text-slate-600 hover:text-slate-900 py-1 flex items-center justify-center space-x-1"
            >
              <span>새 채용공고 붙여넣기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* My Job Fit Score */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">나의 직무 적합도</h2>
                  <p className="text-xs text-slate-500">100점 만점 기준 AI 종합 점수</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('competency')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                진단하기
              </button>
            </div>

            {competencyDiagnosis ? (
              <div className="space-y-4">
                {/* Score gauge preview */}
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600 transition-all duration-1000 stroke-current"
                        strokeDasharray={`${competencyDiagnosis.fitScore}, 100`}
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xl font-black text-slate-900">
                        {competencyDiagnosis.fitScore}
                      </span>
                      <span className="text-[10px] text-slate-400 block -mt-1">/100</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 mb-1">
                      {competencyDiagnosis.fitGrade || '진단 완료'}
                    </span>
                    <p className="text-xs text-slate-600 leading-snug line-clamp-3">
                      {competencyDiagnosis.scoreSummary}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>충족된 요구 역량</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {competencyDiagnosis.fulfilledRequirements?.length || 0}개 항목
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5 text-amber-700 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>보완 필요 역량</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {competencyDiagnosis.lackingOrUnsubstantiatedCompetencies?.length || 0}개 항목
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  * {competencyDiagnosis.disclaimer || '참고용 가이드라인이며 실제 채용과 다를 수 있습니다.'}
                </p>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium mb-1">
                  아직 역량 진단 기록이 없습니다.
                </p>
                <p className="text-[11px] text-slate-400 mb-3">
                  기계·전자·SW 경험을 입력해 내 적합도를 측정해 보세요.
                </p>
                <button
                  onClick={onLoadSampleProfileAndDiagnose}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>예시 지원자 즉시 진단</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('competency')}
              className="w-full text-center text-xs font-medium text-slate-600 hover:text-slate-900 py-1 flex items-center justify-center space-x-1"
            >
              <span>내 스펙 입력 및 정밀 진단</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Missing Competencies TOP 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">부족 역량 TOP 3</h2>
                  <p className="text-xs text-slate-500">서류/면접 전 우선 보완할 핵심 과제</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('competency')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
              >
                개선 로드맵
              </button>
            </div>

            {competencyDiagnosis && competencyDiagnosis.priorityTop3?.length ? (
              <div className="space-y-3">
                {competencyDiagnosis.priorityTop3.map((item) => (
                  <div
                    key={item.rank}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-rose-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center justify-center">
                          {item.rank}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        우선 보완
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight mb-1">{item.whyCrucial}</p>
                    <div className="text-[11px] text-blue-700 bg-blue-50/70 p-1.5 rounded font-medium">
                      🎯 {item.actionPlan}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-1">
                    <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>전장 통신 및 차량 제어 프로토콜 (CAN/LIN)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    전장화 및 SDV 확대로 모든 기계/품질 직무에서 기본 소양으로 요구됨
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-1">
                    <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                      2
                    </span>
                    <span>IATF 16949 5대 Core Tool (APQP, PPAP, FMEA)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    완성차 및 협력사 품질보증 실무자가 가장 검증하고자 하는 핵심 지식
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-1">
                    <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                      3
                    </span>
                    <span>공정 통계 및 데이터 분석 도구 (Minitab/Python)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    배터리 및 스마트팩토리 불량률 개선을 정량적 데이터로 증명하는 능력
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('competency')}
              className="w-full text-center text-xs font-medium text-slate-600 hover:text-slate-900 py-1 flex items-center justify-center space-x-1"
            >
              <span>진단 결과 보러가기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Recommended Industry News (3 items) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                실전 면접 대비
              </span>
              <span className="text-xs text-slate-400">[예시 데이터]</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              추천 모빌리티 산업 뉴스 3선
            </h2>
            <p className="text-xs text-slate-500">
              최신 기술 트렌드와 직무 역량, 면접 예상 질문을 함께 분석해 드립니다.
            </p>
          </div>

          <button
            onClick={() => onNavigate('industryNews')}
            className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <span>전체 뉴스 6개 분야 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedNews.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectNewsItem(item);
                onNavigate('industryNews');
              }}
              className="group border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between bg-slate-50/40"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {item.category}
                  </span>
                  <span className="text-slate-400">{item.date}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {item.summary[0]}
                </p>

                {/* Why Job Seekers Should Care snippet */}
                <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80 mb-3">
                  <span className="font-bold text-blue-900 block mb-0.5 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>취준생 주목 포인트:</span>
                  </span>
                  <p className="line-clamp-2 text-slate-600">{item.whyJobSeekersShouldCare}</p>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.relatedCompetencies.slice(0, 2).map((comp) => (
                    <span
                      key={comp}
                      className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded"
                    >
                      #{comp}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                  <span>면접 예상 질문 확인</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
