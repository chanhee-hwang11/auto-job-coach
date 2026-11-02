import React, { useState, useRef } from 'react';
import {
  UserProfile,
  CompetencyDiagnosisResult,
  JobAnalysisResult,
} from '../types';
import { SAMPLE_USER_PROFILE } from '../data/mockNews';
import { diagnoseCompetencyClientSide } from '../utils/mobilityAnalyzer';
import { safeFetchJson } from '../utils/apiClient';
import {
  UserCheck,
  Sparkles,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ArrowRight,
  Target,
  BookOpen,
  Briefcase,
  Wrench,
  GraduationCap,
  FileCheck,
  Loader2,
  HelpCircle,
  Compass,
} from 'lucide-react';

interface CompetencyDiagnosisViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  competencyDiagnosis: CompetencyDiagnosisResult | null;
  onDiagnosisSuccess: (result: CompetencyDiagnosisResult) => void;
  linkedJobAnalysis: JobAnalysisResult | null;
  targetJobText: string;
}

export const CompetencyDiagnosisView: React.FC<CompetencyDiagnosisViewProps> = ({
  userProfile,
  onUpdateProfile,
  competencyDiagnosis,
  onDiagnosisSuccess,
  linkedJobAnalysis,
  targetJobText,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdateProfile(updated);
  };

  const handleLoadSampleProfile = () => {
    setFormData(SAMPLE_USER_PROFILE);
    onUpdateProfile(SAMPLE_USER_PROFILE);
    setErrorMessage(null);
  };

  const handleClear = () => {
    const emptyProfile: UserProfile = {
      major: '',
      targetJob: '',
      certifications: '',
      trainingCourses: '',
      projectExperience: '',
      internExperience: '',
      skillsAndTools: '',
    };
    setFormData(emptyProfile);
    onUpdateProfile(emptyProfile);
    setErrorMessage(null);
  };

  const handleDiagnose = async () => {
    if (!formData.major.trim() && !formData.projectExperience.trim()) {
      setErrorMessage('전공 또는 프로젝트 경험 등 최소 1개 이상의 정보를 입력하거나 "예시 프로필 불러오기"를 클릭해 주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    let targetJobContext = '';
    if (linkedJobAnalysis) {
      targetJobContext = `[분석된 목표 공고]\n기업명: ${linkedJobAnalysis.companyName}\n직무명: ${linkedJobAnalysis.jobTitle}\n` +
        `주요업무: ${linkedJobAnalysis.responsibilities?.join(', ')}\n` +
        `필수자격: ${linkedJobAnalysis.requirements?.join(', ')}\n` +
        `우대사항: ${linkedJobAnalysis.preferred?.join(', ')}\n` +
        `핵심역량 TOP5: ${linkedJobAnalysis.top5Competencies?.map(c => c.name).join(', ')}`;
    } else {
      targetJobContext = formData.targetJob || targetJobText || '현대모비스 자동차 부품 및 전장 품질관리 엔지니어';
    }

    try {
      const apiRes = await safeFetchJson<CompetencyDiagnosisResult>(
        '/api/diagnose-competency',
        {
          method: 'POST',
          body: JSON.stringify({
            userProfile: formData,
            targetJobContext,
          }),
        }
      );

      if (apiRes.ok && apiRes.data) {
        onDiagnosisSuccess(apiRes.data);
        setErrorMessage(null);
      } else {
        console.warn(`[역량 진단 API 상태: HTTP ${apiRes.status}] ${apiRes.error || '백엔드 응답 대기'}. 스마트 역량 진단 엔진으로 전환합니다.`);
        const clientData = diagnoseCompetencyClientSide(formData, targetJobContext);
        onDiagnosisSuccess(clientData);

        if (apiRes.status === 404) {
          setErrorMessage('Vercel 배포 안내: /api 서버리스 경로를 찾을 수 없어 스마트 역량 진단 엔진이 가동되었습니다. (vercel.json 반영 후 재배포 시 실시간 AI가 활성화됩니다.)');
        } else if (apiRes.status === 401) {
          setErrorMessage('Gemini API 키 안내: Vercel 대시보드(Settings > Environment Variables)에 GEMINI_API_KEY를 등록해 주세요.');
        } else if (apiRes.status === 429) {
          setErrorMessage('API 호출 한도 안내: 요청 한도를 초과하여 대체 진단 엔진이 가동되었습니다. 잠시 후 재시도 가능합니다.');
        }
      }
    } catch (err: any) {
      console.warn('Unexpected diagnosis exception, applying client-side engine:', err.message);
      const clientData = diagnoseCompetencyClientSide(formData, targetJobContext);
      onDiagnosisSuccess(clientData);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  // Helper for score gauge color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-blue-600 stroke-blue-600';
    if (score >= 65) return 'text-emerald-600 stroke-emerald-600';
    if (score >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>핵심 기능 ② 개인 맞춤형 역량 진단</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              나의 직무 역량 정밀 진단
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              본인의 전공, 자격증, 프로젝트, 실무 경험을 입력해 보세요. 채용공고의 필수 역량과
              대조하여 100점 만점 적합도, 충족 요건, 부족 역량 TOP 3를 과학적으로 분석합니다.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleLoadSampleProfile}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>품질/전장 취준생 예시 스펙 불러오기</span>
            </button>
            <button
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="입력 내용 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Linked Job Context Banner */}
        {linkedJobAnalysis && (
          <div className="mt-5 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-blue-900">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <span>
                <strong>연동된 채용공고:</strong> [{linkedJobAnalysis.companyName}] {linkedJobAnalysis.jobTitle}
              </span>
            </div>
            <span className="text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded font-bold border border-blue-200">
              기준 공고 매칭 중
            </span>
          </div>
        )}

        {/* Profile Input Form */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 전공 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>전공 및 세부 전공</span>
            </label>
            <input
              type="text"
              value={formData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              placeholder="예: 기계공학과 / 전자제어 부전공, 미래자동차융합공학 등"
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50 text-slate-900"
            />
          </div>

          {/* 희망 직무 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>희망 직무 및 목표 기업</span>
            </label>
            <input
              type="text"
              value={formData.targetJob}
              onChange={(e) => handleInputChange('targetJob', e.target.value)}
              placeholder="예: 현대모비스 / 자동차 부품 품질관리(QA/QC), 배터리 공정기술"
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50 text-slate-900"
            />
          </div>

          {/* 보유 자격증 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>보유 자격증 및 어학 점수</span>
            </label>
            <input
              type="text"
              value={formData.certifications}
              onChange={(e) => handleInputChange('certifications', e.target.value)}
              placeholder="예: 일반기계기사, 품질경영기사 필기합격, TOEIC 820점, OPIc IM3"
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50 text-slate-900"
            />
          </div>

          {/* 교육 및 수료 과정 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>교육 및 수료 과정 (대외활동/부트캠프)</span>
            </label>
            <input
              type="text"
              value={formData.trainingCourses}
              onChange={(e) => handleInputChange('trainingCourses', e.target.value)}
              placeholder="예: 현대오토에버 모빌리티 임베디드 SW 교육(80h), 미니탭 품질분석 과정"
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50 text-slate-900"
            />
          </div>

          {/* 프로젝트 경험 (Full width or multi-line) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>프로젝트 경험 (캡스톤 디자인, 동아리, 학부 연구생 등)</span>
            </label>
            <textarea
              rows={3}
              value={formData.projectExperience}
              onChange={(e) => handleInputChange('projectExperience', e.target.value)}
              placeholder="수행한 프로젝트의 주제, 본인의 역할, 사용 기술, 구체적인 정량적 성과를 적어주세요. (예: 진동 센서 기반 고장 예지 시스템 설계, CATIA 배터리 하우징 공차 해석)"
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50 text-slate-900 leading-relaxed"
            />
          </div>

          {/* 인턴십 및 실무 경험 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>인턴십 및 실무 경험 (현장실습, 아르바이트 포함)</span>
            </label>
            <textarea
              rows={2}
              value={formData.internExperience}
              onChange={(e) => handleInputChange('internExperience', e.target.value)}
              placeholder="예: 자동차 1차 협력사 하계 6주 현장 실습 (조립 라인 불량률 4M 체크시트 작성)"
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50 text-slate-900"
            />
          </div>

          {/* 활용 가능한 기술 및 프로그램 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
              <Wrench className="w-3.5 h-3.5 text-indigo-600" />
              <span>활용 가능한 기술 및 프로그램 (S/W & 계측기)</span>
            </label>
            <textarea
              rows={2}
              value={formData.skillsAndTools}
              onChange={(e) => handleInputChange('skillsAndTools', e.target.value)}
              placeholder="예: CATIA V5, SolidWorks, Minitab, 오실로스코프, Excel 피벗, Python 기초"
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50 text-slate-900"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">진단 실패: </span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Diagnosis Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            * 사용자가 입력하지 않은 경험을 지어내지 않으며, 정보 부족과 실제 역량 부족을 철저히 구분하여 분석합니다.
          </div>
          <button
            onClick={handleDiagnose}
            disabled={isLoading}
            className={`inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-indigo-500/20'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini 3.8 AI 역량 진단 중...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>내 역량 정밀 진단 실행</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Anchor */}
      <div ref={resultsRef} />

      {/* Diagnosis Results Section */}
      {competencyDiagnosis && (
        <div className="space-y-6">
          {/* Disclaimer Callout Box */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium">
                {competencyDiagnosis.disclaimer ||
                  '본 점수 및 진단 결과는 AI 분석에 기반한 취업 참고용 가이드라인이며, 실제 기업 채용 결과와는 차이가 있을 수 있습니다.'}
              </span>
            </span>
            <span className="font-bold text-[10px] bg-amber-200/60 px-2 py-0.5 rounded text-amber-800">
              참고용 지표
            </span>
          </div>

          {/* Top Score Banner: Visual Gauge + Overall Grade */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Circular Gauge */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${getScoreColor(competencyDiagnosis.fitScore)} transition-all duration-1000 stroke-current`}
                    strokeDasharray={`${competencyDiagnosis.fitScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-white">
                    {competencyDiagnosis.fitScore}
                  </span>
                  <span className="text-xs text-slate-300 block font-semibold">/100점</span>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {competencyDiagnosis.fitGrade || '종합 평가'}
                  </span>
                  <span className="text-xs text-slate-400">직무 적합도 지수</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2">
                  {formData.targetJob || '모빌리티 엔지니어링'} 지원 경쟁력 분석
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {competencyDiagnosis.scoreSummary}
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 shrink-0 flex sm:flex-col justify-around gap-2 text-center sm:text-left min-w-[160px]">
              <div>
                <span className="text-[11px] text-slate-300 block">충족된 요건</span>
                <span className="text-lg font-black text-emerald-400">
                  {competencyDiagnosis.fulfilledRequirements?.length || 0}개 항목
                </span>
              </div>
              <div className="sm:pt-2 sm:border-t sm:border-white/10">
                <span className="text-[11px] text-slate-300 block">보완/근거부족 항목</span>
                <span className="text-lg font-black text-amber-300">
                  {competencyDiagnosis.lackingOrUnsubstantiatedCompetencies?.length || 0}개 항목
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Strengths vs Fulfilled Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 현재 보유 역량 (강점) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span>현재 보유 역량 (확인된 강점)</span>
              </div>
              <div className="space-y-3">
                {competencyDiagnosis.currentCompetencies?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                  >
                    <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                    <p className="text-slate-600 leading-relaxed">{item.detail}</p>
                    <div className="text-[11px] text-blue-700 bg-blue-50/60 p-1.5 rounded font-medium mt-1">
                      📌 <strong>확인된 근거:</strong> {item.evidence}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 충족된 요구 역량 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                  <FileCheck className="w-4 h-4" />
                </span>
                <span>충족된 직무 요구 역량</span>
              </div>
              <div className="space-y-3">
                {competencyDiagnosis.fulfilledRequirements?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900">{item.requirement}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {item.matchLevel}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      매칭 경험: {item.matchedExperience}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: 부족하거나 경험 근거가 부족한 역량 (Crucial distinction!) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  부족하거나 경험 근거가 부족한 역량 분석
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                  경험 근거 부족(작성 보완)
                </span>
                <span>vs</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold">
                  실제 역량/경험 보완 필요
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              * 기재하지 않아 판별이 불가능한 항목과, 실제 모빌리티 직무 요건상 보강이 필요한 항목을
              명확히 분리하여 솔루션을 제시합니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competencyDiagnosis.lackingOrUnsubstantiatedCompetencies?.map((item, idx) => {
                const isWritingIssue = item.issueType.includes('근거') || item.issueType.includes('작성');
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isWritingIssue
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{item.competency}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isWritingIssue
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.issueType}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{item.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: 우선적으로 보완할 역량 TOP 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center space-x-2 font-extrabold text-slate-900 text-base mb-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                <Target className="w-4 h-4" />
              </span>
              <span>우선적으로 보완할 역량 TOP 3</span>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              서류 통과 및 실무 면접에서 가장 중요한 결정타가 될 3대 우선 보강 영역입니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competencyDiagnosis.priorityTop3?.map((item) => (
                <div
                  key={item.rank}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                        {item.rank}
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        TOP {item.rank} 우선순위
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mb-2">{item.name}</h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {item.whyCrucial}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-blue-900 font-medium">
                    ⚡ <strong>단기 액션:</strong> {item.actionPlan}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: 구체적인 개선 방법 및 로드맵 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center space-x-2 font-extrabold text-slate-900 text-base mb-2">
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                <Compass className="w-4 h-4" />
              </span>
              <span>구체적인 개선 방법 및 실행 로드맵</span>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              단계별로 실행할 수 있는 추천 자격증, 교육 과정 및 포트폴리오 프로젝트 가이드입니다.
            </p>

            <div className="space-y-4">
              {competencyDiagnosis.concreteImprovements?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[10px]">
                        {item.step}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    </div>
                    <p className="text-slate-600 leading-relaxed pt-1">{item.recommendation}</p>
                  </div>

                  <div className="sm:max-w-xs w-full bg-white p-3 rounded-lg border border-slate-200 shrink-0">
                    <span className="font-bold text-slate-700 block mb-0.5 text-[11px]">
                      🎯 추천 자격증/프로젝트:
                    </span>
                    <span className="text-indigo-700 font-semibold">{item.suggestedCertOrProject}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Resume Tip & Interview Defense Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 p-5 rounded-2xl border border-blue-200">
              <div className="font-bold text-blue-900 text-sm mb-2 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>자기소개서 즉시 적용 어필 포인트</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {competencyDiagnosis.resumeTip}
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 p-5 rounded-2xl border border-amber-200">
              <div className="font-bold text-amber-900 text-sm mb-2 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>실무 면접 취약점 압박 방어 전략</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {competencyDiagnosis.interviewDefenseTip}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
