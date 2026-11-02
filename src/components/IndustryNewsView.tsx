import React, { useState } from 'react';
import { MobilityNewsItem, NewsCategory } from '../types';
import { MOCK_NEWS_DATA } from '../data/mockNews';
import {
  Newspaper,
  Search,
  Building2,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertCircle,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';

interface IndustryNewsViewProps {
  selectedNewsItem: MobilityNewsItem | null;
}

export const IndustryNewsView: React.FC<IndustryNewsViewProps> = ({ selectedNewsItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>(
    selectedNewsItem ? selectedNewsItem.category : '전체'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedInterviewIds, setExpandedInterviewIds] = useState<Record<string, boolean>>({});

  const categories: NewsCategory[] = [
    '전체',
    '자동차',
    '이차전지',
    '자동차 부품 및 전장',
    '전기차 및 자율주행',
    '스마트팩토리',
    '품질 및 제조기술',
  ];

  const filteredNews = MOCK_NEWS_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === '전체' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.relatedIndustriesAndCompanies.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      item.relatedCompetencies.some((comp) =>
        comp.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const toggleInterviewQuestions = (id: string) => {
    setExpandedInterviewIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-semibold mb-2 border border-cyan-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>핵심 기능 ③ 최신 모빌리티 산업 뉴스 & 면접 대비</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          모빌리티 산업 뉴스 & 면접 인사이트
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          자동차·이차전지·전장·자율주행·스마트팩토리 6대 분야의 핵심 기술 이슈와 함께,
          실제 면접관이 이를 지원자에게 어떤 질문으로 검증하는지 핵심 답변 힌트와 함께 학습하세요.
        </p>

        {/* Mandatory Sample Data Notice Callout */}
        <div className="mt-5 p-3.5 bg-amber-50/80 border border-amber-300/80 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold">[예시 데이터 안내] </span>
            <span>
              본 뉴스는 모빌리티 취업 준비생의 트렌드 파악 및 면접 질문 대비 학습을 위해
              산업 표준 기술을 기반으로 구성된 <strong>가상의 예시 데이터</strong>입니다.
              실제 언론사 출처 기사나 외부 링크가 아니므로 면접 답변 프레임워크 학습용으로 활용해 주세요.
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="기술 키워드 검색 (예: SDV, LFP, IATF 16949, PLC, 현대모비스, 센서 융합 등)"
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800 self-center px-2 py-1"
            >
              검색어 초기화
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* News Cards List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            총 <strong>{filteredNews.length}</strong>개의 산업 뉴스 [예시 데이터]
          </span>
          <span className="text-[11px]">카테고리: {selectedCategory}</span>
        </div>

        {filteredNews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Newspaper className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">일치하는 뉴스가 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">
              다른 검색어를 입력하거나 다른 카테고리를 선택해 보세요.
            </p>
          </div>
        ) : (
          filteredNews.map((news) => {
            const isExpanded = expandedInterviewIds[news.id];
            return (
              <article
                key={news.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-4"
              >
                {/* Header: Category Badge + Date + Title */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {news.category}
                    </span>
                    <span className="text-slate-400 font-medium text-[11px]">{news.date}</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {news.title}
                  </h2>
                </div>

                {/* 1. 핵심 내용 요약 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-800 block mb-2 flex items-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>핵심 내용 요약</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {news.summary.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. 관련 산업 및 기업 */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-bold text-slate-700 flex items-center space-x-1 mr-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>관련 산업 및 주요 기업:</span>
                  </span>
                  {news.relatedIndustriesAndCompanies.map((comp) => (
                    <span
                      key={comp}
                      className="px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-800 border border-slate-200"
                    >
                      {comp}
                    </span>
                  ))}
                </div>

                {/* 3. 취업 준비생이 주목해야 할 이유 */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 text-xs">
                  <div className="font-bold text-blue-900 mb-1 flex items-center space-x-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>취업 준비생이 주목해야 할 이유 (채용 시장 시사점)</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed pl-5">
                    {news.whyJobSeekersShouldCare}
                  </p>
                </div>

                {/* 4. 관련 직무 역량 태그 */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                  <span className="font-bold text-slate-700 flex items-center space-x-1 mr-1">
                    <Tag className="w-3.5 h-3.5 text-indigo-500" />
                    <span>관련 직무 역량:</span>
                  </span>
                  {news.relatedCompetencies.map((comp) => (
                    <span
                      key={comp}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200"
                    >
                      #{comp}
                    </span>
                  ))}
                </div>

                {/* 5. 면접 예상 질문 & 답변 팁 (Expandable Accordion) */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => toggleInterviewQuestions(news.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100/70 hover:bg-slate-100 transition-colors text-xs font-bold text-slate-800"
                  >
                    <span className="flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span>이 기사 관련 면접 예상 질문 & 합격 답변 힌트</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                        {news.interviewQuestions.length}문항
                      </span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-3 pl-2 sm:pl-4">
                      {news.interviewQuestions.map((iq, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                        >
                          <div className="font-bold text-slate-900 flex items-start space-x-2">
                            <span className="text-blue-600 shrink-0 font-extrabold">
                              Q{idx + 1}.
                            </span>
                            <span className="leading-snug">{iq.question}</span>
                          </div>
                          <div className="pl-6 text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                            <span className="font-bold text-emerald-800 text-[11px] block mb-0.5">
                              💡 모범 답변 구조 및 차별화 팁:
                            </span>
                            {iq.hint}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
