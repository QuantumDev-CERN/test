import { RoadmapTab } from '../types';

interface RoadmapHeaderProps {
  currentTab: RoadmapTab | undefined;
  onMobileMenuToggle?: () => void;
}

export function RoadmapHeader({ currentTab, onMobileMenuToggle }: RoadmapHeaderProps) {
  if (!currentTab) return null;

  return (
    <div className="glassmorphism-header bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3 lg:py-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 -ml-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Home</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Roadmaps</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{currentTab.label}</span>
          </div>
        </div>
        

      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="text-2xl lg:text-3xl animate-float">{currentTab.icon}</span>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-ping"></div>
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {currentTab.label} Roadmap
            </h2>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Follow this path to master {currentTab.label.toLowerCase()}
            </p>
          </div>
        </div>
        

      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 shimmer-effect"></div>
    </div>
  );
}