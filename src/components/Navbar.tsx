import React from 'react';
import { NavigationTab } from '../types';
import {
  Compass,
  FileSearch,
  UserCheck,
  Newspaper,
  Car,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  targetJobText: string;
  onOpenVercelGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  targetJobText,
  onOpenVercelGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: '대시보드', icon: <Compass className="w-4 h-4" /> },
    { id: 'jobAnalysis', label: '채용공고 분석', icon: <FileSearch className="w-4 h-4" /> },
    { id: 'competency', label: '역량 진단', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'industryNews', label: '산업 뉴스', icon: <Newspaper className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              onSelectTab('dashboard');
              setMobileMenuOpen(false);
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-blue-900 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  MOBILITY <span className="text-blue-600 font-black">CAREER AI</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  AI Ver 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                자동차·이차전지·전장·스마트팩토리 취업 솔루션
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Target Job Indicator & Vercel Guide */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onOpenVercelGuide && (
              <button
                onClick={onOpenVercelGuide}
                className="hidden sm:inline-flex items-center space-x-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-300 transition-colors"
                title="Vercel & GitHub 배포 시 AI 연결 가이드"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Vercel 배포 안내</span>
              </button>
            )}

            {targetJobText ? (
              <div
                onClick={() => onSelectTab('jobAnalysis')}
                className="hidden lg:flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer transition-colors"
                title="목표 공고 분석 바로가기"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium max-w-[140px] truncate">{targetJobText}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </div>
            ) : (
              <div className="hidden lg:flex items-center text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                실시간 AI 모델 연결됨
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-blue-400' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
