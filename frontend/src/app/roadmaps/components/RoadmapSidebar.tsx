import { useState, useEffect } from 'react';
import { RoadmapTab } from '../types';

interface RoadmapSidebarProps {
  tabs: RoadmapTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export function RoadmapSidebar({ 
  tabs, 
  activeTab, 
  onTabChange, 
  isMobileMenuOpen = false,
  setIsMobileMenuOpen 
}: RoadmapSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    const savedTheme = localStorage.getItem('roadmap-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('roadmap-theme', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <>
      <div 
        className={`
          group glassmorphism-sidebar
          ${isExpanded ? 'lg:w-64' : 'lg:w-16'} 
          lg:relative lg:translate-x-0 lg:block
          fixed inset-y-0 left-0 z-50 w-64 
          ${isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'} 
          backdrop-blur-xl border-r
          transform transition-all duration-500 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:flex lg:flex-col
          hover:lg:w-64 hover:shadow-2xl
          before:absolute before:inset-0 before:bg-gradient-to-b 
          ${isDarkMode ? 'before:from-blue-500/5 before:to-purple-500/5' : 'before:from-blue-500/5 before:to-indigo-500/5'}
          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onTouchStart={() => setIsExpanded(true)}
      >
        <div className={`px-4 lg:px-3 py-4 lg:py-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between relative`}>
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse-slow">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div className={`
              transition-all duration-500 ease-out overflow-hidden
              ${isExpanded ? 'lg:opacity-100 lg:w-auto lg:translate-x-0' : 'lg:opacity-0 lg:w-0 lg:-translate-x-4'}
              lg:group-hover:opacity-100 lg:group-hover:w-auto lg:group-hover:translate-x-0
            `}>
              <h1 className={`text-lg lg:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                Roadmaps
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-nowrap`}>
                Interactive paths
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className={`
              hidden lg:block p-2 rounded-lg transition-all duration-300 hover:scale-110
              ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              ${isExpanded ? 'lg:opacity-100' : 'lg:opacity-0'} lg:group-hover:opacity-100
            `}
          >
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen?.(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-2 lg:px-2 py-4 lg:py-6 overflow-y-auto">
          <div className="space-y-1 lg:space-y-2">
            <div className={`
              text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 lg:mb-4 px-2
              transition-all duration-300 ease-in-out overflow-hidden
              ${isExpanded ? 'lg:opacity-100 lg:h-auto' : 'lg:opacity-0 lg:h-0'}
              lg:group-hover:opacity-100 lg:group-hover:h-auto
            `}>
              Learning Paths
            </div>
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              
              return (
                <div key={tab.id} className="relative group/tab">
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className={`
                      w-full flex items-center rounded-xl font-medium transition-all duration-300 text-left relative overflow-hidden
                      ${isExpanded ? 'lg:px-3 lg:space-x-3' : 'lg:px-2 lg:justify-center'}
                      lg:group-hover:px-3 lg:group-hover:justify-start lg:group-hover:space-x-3
                      px-3 space-x-3 py-3 lg:py-3
                      ${isActive
                        ? `${isDarkMode 
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20' 
                            : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-lg shadow-blue-500/10'
                          }`
                        : `${isDarkMode 
                            ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          } hover:scale-105 hover:shadow-md`
                      }
                      transform hover:translate-x-1
                    `}
                    title={!isExpanded ? tab.label : undefined}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative flex-shrink-0">
                      <span className={`text-base lg:text-lg transition-transform duration-300 ${isActive ? 'scale-110' : ''} group-hover/tab:scale-125`}>
                        {tab.icon}
                      </span>
                      {isActive && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-ping"></div>
                      )}
                    </div>
                    
                    <div className={`
                      flex-1 transition-all duration-500 ease-out overflow-hidden
                      ${isExpanded ? 'lg:opacity-100 lg:w-auto lg:translate-x-0' : 'lg:opacity-0 lg:w-0 lg:-translate-x-4'}
                      lg:group-hover:opacity-100 lg:group-hover:w-auto lg:group-hover:translate-x-0
                    `}>
                      <span className="text-sm font-medium whitespace-nowrap">
                        {tab.label}
                      </span>
                    </div>
                    
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"></div>
                    )}
                  </button>
                  

                </div>
              );
            })}
          </div>
        </div>

        <div className={`
          px-2 py-4 border-t border-gray-200
          transition-all duration-300 ease-in-out overflow-hidden
          ${isExpanded ? 'lg:opacity-100' : 'lg:opacity-0'}
          lg:group-hover:opacity-100
        `}>
          <div className="flex items-center space-x-2 px-2 text-xs text-gray-500">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`
              transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
              ${isExpanded ? 'lg:opacity-100 lg:w-auto' : 'lg:opacity-0 lg:w-0'}
              lg:group-hover:opacity-100 lg:group-hover:w-auto
            `}>
              Hover to expand
            </span>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen?.(false)}
        />
      )}
    </>
  );
}