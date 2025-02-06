'use client';

import { useState, useEffect } from 'react';
import { SavedAnalysis, AnalysisResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'youtube-summary-analyses';

export function useAnalysisStore() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 로컬 스토리지에서 저장된 분석 결과 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnalyses(parsed);
        if (parsed.length > 0) {
          setSelectedId(parsed[0].id);
        }
      } catch (error) {
        console.error('Failed to load analyses:', error);
      }
    }
  }, []);

  const addAnalysis = (videoUrl: string, result: AnalysisResult) => {
    const videoInfoRaw = result?.videoInfoRaw;
    
    let name = '새 분석';
    if (typeof videoInfoRaw === 'object' && videoInfoRaw !== null) {
      if ("title" in videoInfoRaw && typeof videoInfoRaw.title === 'string') {
        name = videoInfoRaw.title;
      }
    }

    const newAnalysis: SavedAnalysis = {
      id: uuidv4(),
      name,
      videoUrl,
      result,
      createdAt: Date.now()
    };

    const updatedAnalyses = [...analyses, newAnalysis];
    setAnalyses(updatedAnalyses);
    setSelectedId(newAnalysis.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
    return newAnalysis.id;
  };

  const updateAnalysisName = (id: string, name: string) => {
    const updatedAnalyses = analyses.map(analysis => 
      analysis.id === id ? { ...analysis, name } : analysis
    );
    setAnalyses(updatedAnalyses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
  };

  const deleteAnalysis = (id: string) => {
    const currentIndex = analyses.findIndex(analysis => analysis.id === id);
    const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
    setAnalyses(updatedAnalyses);

    // 삭제된 항목이 현재 선택된 항목인 경우
    if (selectedId === id) {
      if (updatedAnalyses.length === 0) {
        // 더 이상 분석 결과가 없는 경우
        setSelectedId(null);
      } else if (currentIndex < updatedAnalyses.length) {
        // 현재 위치에 다른 항목이 있는 경우 (우측 탭)
        setSelectedId(updatedAnalyses[currentIndex].id);
      } else {
        // 현재 위치에 항목이 없는 경우 (마지막 항목이었던 경우)
        setSelectedId(updatedAnalyses[currentIndex - 1].id);
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
  };

  const getSelectedAnalysis = () => {
    return analyses.find(analysis => analysis.id === selectedId) || null;
  };

  const clearAnalyses = () => {
    setAnalyses([]);
    setSelectedId(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    analyses,
    selectedId,
    setSelectedId,
    addAnalysis,
    updateAnalysisName,
    deleteAnalysis,
    getSelectedAnalysis,
    clearAnalyses,
  };
} 