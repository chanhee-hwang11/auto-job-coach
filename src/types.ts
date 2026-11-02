export type NavigationTab = 'dashboard' | 'jobAnalysis' | 'competency' | 'industryNews';

export interface JobAnalysisResult {
  companyName: string;
  jobTitle: string;
  jobField: string;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
  technicalSkills: string[];
  top5Competencies: {
    rank: number;
    name: string;
    category: string;
    importance: string;
    description: string;
  }[];
  keyEvaluationPoints: string[];
  mobilityTrendInsight?: string;
  recommendedInterviewTopics?: string[];
}

export interface UserProfile {
  major: string;
  targetJob: string;
  certifications: string;
  trainingCourses: string;
  projectExperience: string;
  internExperience: string;
  skillsAndTools: string;
}

export interface CompetencyDiagnosisResult {
  fitScore: number;
  fitGrade: string;
  scoreSummary: string;
  currentCompetencies: {
    title: string;
    detail: string;
    evidence: string;
  }[];
  fulfilledRequirements: {
    requirement: string;
    matchedExperience: string;
    matchLevel: string;
  }[];
  lackingOrUnsubstantiatedCompetencies: {
    competency: string;
    issueType: string;
    explanation: string;
  }[];
  priorityTop3: {
    rank: number;
    name: string;
    whyCrucial: string;
    actionPlan: string;
  }[];
  concreteImprovements: {
    step: string;
    title: string;
    recommendation: string;
    suggestedCertOrProject: string;
  }[];
  resumeTip: string;
  interviewDefenseTip: string;
  disclaimer: string;
}

export type NewsCategory =
  | '전체'
  | '자동차'
  | '이차전지'
  | '자동차 부품 및 전장'
  | '전기차 및 자율주행'
  | '스마트팩토리'
  | '품질 및 제조기술';

export interface MobilityNewsItem {
  id: string;
  category: NewsCategory;
  title: string;
  date: string;
  summary: string[];
  relatedIndustriesAndCompanies: string[];
  whyJobSeekersShouldCare: string;
  relatedCompetencies: string[];
  interviewQuestions: {
    question: string;
    hint: string;
  }[];
}
