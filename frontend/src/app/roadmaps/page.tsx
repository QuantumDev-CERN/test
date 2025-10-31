'use client';

import { useState, useEffect } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { RoadmapSidebar, RoadmapHeader, RoadmapFlow, FloatingActionButton, ParticleBackground } from './components';
import { initialRoadmapData } from './data/roadmapData';
import { ROADMAP_TABS } from './constants';
import { RoadmapCollection } from './types';

export default function RoadmapsPage() {
  const [activeTab, setActiveTab] = useState('ai');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const initialData = initialRoadmapData.ai;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);

  useEffect(() => {
    try {
      const roadmapKey = activeTab as keyof RoadmapCollection;
      const roadmapData = initialRoadmapData[roadmapKey];
      if (roadmapData && roadmapData.nodes && roadmapData.edges) {
        setNodes(roadmapData.nodes);
        setEdges(roadmapData.edges);
      }
    } catch (error) {
      console.error('Error loading roadmap data:', error);
    }
  }, [activeTab, setNodes, setEdges]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleReset = () => {
    try {
      const event = new CustomEvent('reset-view');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error dispatching reset event:', error);
    }
  };



  const handleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error handling fullscreen:', error);
    }
  };

  const currentTab = ROADMAP_TABS.find(tab => tab.id === activeTab);

  return (
    <div className="roadmaps-page h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col lg:flex-row relative overflow-hidden">
      <ParticleBackground />

      <RoadmapSidebar
        tabs={ROADMAP_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col relative z-10">
        <RoadmapHeader
          currentTab={currentTab}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <RoadmapFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgesSet={setEdges}
          onResetView={handleReset}
        />
      </div>

      <FloatingActionButton
        onReset={handleReset}
        onFullscreen={handleFullscreen}
      />

      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg transform translate-x-full opacity-0 transition-all duration-500 achievement-notification">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏆</span>
            <span className="font-medium">Achievement Unlocked!</span>
          </div>
        </div>
      </div>
    </div>
  );
}