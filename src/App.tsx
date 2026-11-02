/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  NavigationTab,
  JobAnalysisResult,
  UserProfile,
  CompetencyDiagnosisResult,
  MobilityNewsItem,
} from './types';
import { MOCK_NEWS_DATA, SAMPLE_JOB_POSTING, SAMPLE_USER_PROFILE } from './data/mockNews';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { JobAnalysisView } from './components/JobAnalysisView';
import { CompetencyDiagnosisView } from './components/CompetencyDiagnosisView';
import { IndustryNewsView } from './components/IndustryNewsView';
import {
  Car,
  AlertCircle,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [targetJobText, setTargetJobText] = useState<string>(
    '현대모비스 전장부품 품질관리(QA/QC)'
  );

  // Job Analysis state
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysisResult | null>(null);
  const [originalJobText, setOriginalJobText] = useState<string>('');

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    major: '',
    targetJob: '현대모비스 전장부품 품질관리(QA/QC)',
    certifications: '',
    trainingCourses: '',
    projectExperience: '',
    internExperience: '',
    skillsAndTools: '',
  });

  // Competency Diagnosis state
  const [competencyDiagnosis, setCompetencyDiagnosis] =
    useState<CompetencyDiagnosisResult | null>(null);

  // Selected news item for navigation from dashboard
  const [selectedNewsItem, setSelectedNewsItem] = useState<MobilityNewsItem | null>(null);

  // Global toast notification
  const [toast, setToast] = useState<{
    message: string;
    type: 'error' | 'success' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Quick Action 1: Load sample job and analyze from dashboard
  const handleLoadSampleJobAndAnalyze = async () => {
    setCurrentTab('jobAnalysis');
    // Pre-fill
    try {
      showToast('자동차 부품 품질관리 예시 채용공고를 분석 중입니다...', 'info');
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobText: SAMPLE_JOB_POSTING }),
      });
      const json = await response.json();
      if (response.ok && json.success) {
        setJobAnalysis(json.data);
        setOriginalJobText(SAMPLE_JOB_POSTING);
        setTargetJobText(`[${json.data.companyName}] ${json.data.jobTitle}`);
        showToast('예시 공고 분석이 완료되었습니다!', 'success');
      } else {
        showToast(json.error || '분석에 실패했습니다.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || '네트워크 연결 실패', 'error');
    }
  };

  // Quick Action 2: Load sample applicant profile and diagnose from dashboard
  const handleLoadSampleProfileAndDiagnose = async () => {
    setCurrentTab('competency');
    setUserProfile(SAMPLE_USER_PROFILE);
    try {
      showToast('예시 지원자 스펙으로 역량 진단을 실행 중입니다...', 'info');
      const targetJobContext = jobAnalysis
        ? `[분석된 공고] ${jobAnalysis.companyName} ${jobAnalysis.jobTitle}`
        : SAMPLE_USER_PROFILE.targetJob;

      const response = await fetch('/api/diagnose-competency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: SAMPLE_USER_PROFILE,
          targetJobContext,
        }),
      });
      const json = await response.json();
      if (response.ok && json.success) {
        setCompetencyDiagnosis(json.data);
        showToast('역량 진단 분석이 완료되었습니다!', 'success');
      } else {
        showToast(json.error || '진단에 실패했습니다.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || '네트워크 연결 실패', 'error');
    }
  };

  // Move from Job Analysis to Diagnosis with linked job
  const handleProceedToDiagnosis = (result: JobAnalysisResult) => {
    setJobAnalysis(result);
    setUserProfile((prev) => ({
      ...prev,
      targetJob: `[${result.companyName}] ${result.jobTitle}`,
    }));
    setTargetJobText(`[${result.companyName}] ${result.jobTitle}`);
    setCurrentTab('competency');
    showToast(`'${result.companyName}' 공고 기준 역량 진단 탭으로 이동했습니다.`, 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        targetJobText={targetJobText}
      />

      {/* Global Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`p-4 rounded-xl shadow-lg border flex items-start space-x-3 text-xs ${
              toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 shrink-0 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            targetJob={targetJobText}
            onUpdateTargetJob={(job) => {
              setTargetJobText(job);
              setUserProfile((prev) => ({ ...prev, targetJob: job }));
              showToast(`목표 직무가 '${job}'(으)로 업데이트되었습니다.`, 'info');
            }}
            jobAnalysis={jobAnalysis}
            competencyDiagnosis={competencyDiagnosis}
            recommendedNews={MOCK_NEWS_DATA}
            onSelectNewsItem={(news) => {
              setSelectedNewsItem(news);
            }}
            onLoadSampleJobAndAnalyze={handleLoadSampleJobAndAnalyze}
            onLoadSampleProfileAndDiagnose={handleLoadSampleProfileAndDiagnose}
          />
        )}

        {currentTab === 'jobAnalysis' && (
          <JobAnalysisView
            jobAnalysis={jobAnalysis}
            onAnalysisSuccess={(result, text) => {
              setJobAnalysis(result);
              setOriginalJobText(text);
              setTargetJobText(`[${result.companyName}] ${result.jobTitle}`);
              showToast(
                `[${result.companyName}] ${result.jobTitle} 공고 분석이 완료되었습니다!`,
                'success'
              );
            }}
            onProceedToDiagnosis={handleProceedToDiagnosis}
          />
        )}

        {currentTab === 'competency' && (
          <CompetencyDiagnosisView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            competencyDiagnosis={competencyDiagnosis}
            onDiagnosisSuccess={(result) => {
              setCompetencyDiagnosis(result);
              showToast('직무 적합도 및 역량 진단이 완료되었습니다!', 'success');
            }}
            linkedJobAnalysis={jobAnalysis}
            targetJobText={targetJobText}
          />
        )}

        {currentTab === 'industryNews' && (
          <IndustryNewsView selectedNewsItem={selectedNewsItem} />
        )}
      </main>

      {/* Professional Mobility Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-slate-900">
                  MOBILITY <span className="text-blue-600">CAREER AI</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  모빌리티 취업 준비생을 위한 실시간 AI 채용공고 분석 및 역량 진단 플랫폼
                </p>
              </div>
            </div>

            <div className="text-center md:text-right text-[11px] text-slate-400 space-y-1">
              <p>대상 분야: 완성차 · 이차전지 · 자동차 부품 및 전장 · 스마트팩토리 · 품질 및 제조기술</p>
              <p>© 2026 MOBILITY CAREER AI. Powered by Gemini 3.8 AI Engine. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
