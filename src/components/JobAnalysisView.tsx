import React, { useState, useRef } from 'react';
import { JobAnalysisResult } from '../types';
import { SAMPLE_JOB_POSTINGS } from '../data/mockNews';
import { analyzeJobClientSide } from '../utils/mobilityAnalyzer';
import {
  FileSearch,
  Sparkles,
  RotateCcw,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Zap,
} from 'lucide-react';

interface JobAnalysisViewProps {
  jobAnalysis: JobAnalysisResult | null;
  onAnalysisSuccess: (result: JobAnalysisResult, originalText: string) => void;
  onProceedToDiagnosis: (jobResult: JobAnalysisResult) => void;
}

export const JobAnalysisView: React.FC<JobAnalysisViewProps> = ({
  jobAnalysis,
  onAnalysisSuccess,
  onProceedToDiagnosis,
}) => {
  const [jobText, setJobText] = useState(SAMPLE_JOB_POSTINGS[0].content);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [modelBadge, setModelBadge] = useState<string>('Gemini 3.1 AI');
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-fill sample job posting
  const handleLoadSample = (index: number = 0) => {
    setJobText(SAMPLE_JOB_POSTINGS[index].content);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setJobText('');
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!jobText.trim()) {
      setErrorMessage('채용공고 텍스트를 먼저 입력하거나 아래의 예시 버튼을 클릭해 주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobText }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const json = await response.json();
        if (json.success && json.data) {
          if (json.modelUsed) {
            setModelBadge(json.modelUsed.includes('3.1') ? 'Gemini 3.1 Flash' : 'Gemini AI');
          } else {
            setModelBadge('모빌리티 직무 분석');
          }
          onAnalysisSuccess(json.data, jobText);
          return;
        }
      }
      throw new Error('API 서버 연결 또는 응답 형식 문제');
    } catch (err: any) {
      console.warn('Backend API unavailable (Vercel/Static mode), applying client-side engine:', err);
      // Seamlessly analyze client-side so it NEVER fails on Vercel or GitHub!
      const clientData = analyzeJobClientSide(jobText);
      setModelBadge('스마트 직무 분석 (Vercel 호환 모드)');
      onAnalysisSuccess(clientData, jobText);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  const handleCopyAnalysis = () => {
    if (!jobAnalysis) return;
    const textToCopy = `[${jobAnalysis.companyName}] ${jobAnalysis.jobTitle}\n\n` +
      `■ 주요 업무:\n${jobAnalysis.responsibilities?.map((r) => `- ${r}`).join('\n')}\n\n` +
      `■ 핵심 역량 TOP 5:\n${jobAnalysis.top5Competencies?.map((c) => `${c.rank}. ${c.name} (${c.importance}): ${c.description}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>핵심 기능 ① Gemini AI 채용공고 정밀 분석</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              채용공고 AI 분석
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              관심 있는 모빌리티 기업의 채용공고를 붙여넣으세요. 실무 면접관 관점에서
              주요 업무, 필수 요건, 우대 사항, 핵심 역량 TOP 5를 즉시 도출합니다.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {jobText && (
              <button
                onClick={handleClear}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors flex items-center space-x-1 border border-slate-200"
                title="입력 내용 지우기"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>지우기</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Sample Selector Pills */}
        <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>원클릭 가상 채용공고 예시 불러오기:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_JOB_POSTINGS.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => handleLoadSample(idx)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all shadow-2xs"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
            <span>채용공고 텍스트 (직접 붙여넣거나 위 예시 선택)</span>
            <span className="text-slate-400 font-normal text-[11px]">
              글자 수: {jobText.length.toLocaleString()}자
            </span>
          </label>
          <textarea
            rows={7}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="채용 사이트(현대차 채용, 사람인, 잡코리아 등)의 공고 본문을 복사하여 붙여넣으세요. 예: 담당업무, 지원자격, 우대사항 등"
            className="w-full text-xs font-sans p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50 text-slate-900 placeholder:text-slate-400 leading-relaxed transition-all"
          />

          {errorMessage && (
            <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">안내: </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              💡 실무 팁: 자격요건과 우대사항이 포함되어 있을수록 면접관의 중점 평가 포인트가 정밀하게 도출됩니다.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className={`inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
                isLoading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/20'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini AI 초고속 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>채용공고 AI 분석 시작</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results Anchor */}
      <div ref={resultsRef} />

      {/* Analysis Results Display */}
      {jobAnalysis && (
        <div className="space-y-6">
          {/* Result Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-1">
                <Building2 className="w-4 h-4" />
                <span>{jobAnalysis.companyName || '모빌리티 대표 기업'}</span>
                <span>•</span>
                <span className="text-slate-300">{jobAnalysis.jobField || '자동차 부품 및 전장'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {modelBadge} 분석완료
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                {jobAnalysis.jobTitle || '모집 직무'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Gemini AI가 채용공고를 심층 분석하여 추출한 7가지 핵심 직무 명세입니다.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleCopyAnalysis}
                className="px-3.5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white border border-white/20 flex items-center space-x-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사 완료' : '결과 복사'}</span>
              </button>

              <button
                onClick={() => onProceedToDiagnosis(jobAnalysis)}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md flex items-center space-x-1.5 transition-all group"
              >
                <span>이 공고로 내 역량 진단하기</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* 4 Core Requirement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. 주요 업무 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>1. 주요 업무 (Responsibilities)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {jobAnalysis.responsibilities?.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. 필수 자격 요건 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span>2. 필수 자격 요건 (Requirements)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {jobAnalysis.requirements?.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. 우대 사항 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
                  <Award className="w-4 h-4" />
                </div>
                <span>3. 우대 사항 (Preferred Qualifications)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {jobAnalysis.preferred?.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. 요구 기술 및 도구 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                  <Cpu className="w-4 h-4" />
                </div>
                <span>4. 요구 기술 및 직무 도구 (Technical Skills)</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {jobAnalysis.technicalSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Core Competencies TOP 5 Table & Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Layers className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    핵심 역량 TOP 5 (Key Competencies)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  합격을 가르는 5대 핵심 직무 역량의 순위와 실무 적용 맥락을 정리했습니다.
                </p>
              </div>

              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg self-start sm:self-auto border border-blue-200">
                1위~5위 체계적 가중치 분석
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-800 text-[11px] uppercase border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">순위</th>
                    <th className="py-3 px-4 w-44">역량명</th>
                    <th className="py-3 px-4 w-28">분야</th>
                    <th className="py-3 px-4 w-28">중요도</th>
                    <th className="py-3 px-4">선정 이유 및 실무 적용 맥락</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {jobAnalysis.top5Competencies?.map((comp) => (
                    <tr key={comp.rank} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs">
                          {comp.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{comp.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {comp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {comp.importance}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                        {comp.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {jobAnalysis.top5Competencies?.map((comp) => (
                <div
                  key={comp.rank}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        {comp.rank}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{comp.name}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {comp.importance}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">분야: {comp.category}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{comp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluator's Key Points & Trend Insight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Key Evaluation Points */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <span>채용공고에서 중요하게 보는 핵심 평가 요소</span>
              </div>
              <div className="space-y-3">
                {jobAnalysis.keyEvaluationPoints?.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60 text-xs text-slate-800 leading-relaxed flex items-start space-x-2"
                  >
                    <span className="font-bold text-emerald-700 shrink-0">Point {idx + 1}.</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobility Trend & Interview Topics */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100">
                  <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <span>모빌리티 산업 트렌드 인사이트 & 면접 팁</span>
                </div>

                {jobAnalysis.mobilityTrendInsight && (
                  <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4">
                    <span className="font-bold text-blue-900 block mb-1">
                      💡 최신 산업 관점 (SDV/전동화 연계)
                    </span>
                    {jobAnalysis.mobilityTrendInsight}
                  </div>
                )}

                {jobAnalysis.recommendedInterviewTopics && (
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      🎙️ 추천 면접 예상 질문 주제
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {jobAnalysis.recommendedInterviewTopics.map((topic, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onProceedToDiagnosis(jobAnalysis)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <span>이 채용공고와 내 역량 대조하기</span>
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
