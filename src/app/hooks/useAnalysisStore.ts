'use client';

import { useState, useEffect } from 'react';
import { SavedAnalysis, VideoResult } from '../types';

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

  // 분석 결과 저장
  const saveAnalysis = (videoUrl: string, result: VideoResult, videoTitle?: string, thumbnailUrl?: string) => {
    const newAnalysis: SavedAnalysis = {
      id: Date.now().toString(),
      videoUrl,
      videoTitle,
      thumbnailUrl,
      createdAt: new Date().toISOString(),
      result,
    };

    const updatedAnalyses = [newAnalysis, ...analyses];
    setAnalyses(updatedAnalyses);
    setSelectedId(newAnalysis.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
  };

  // 분석 결과 삭제
  const deleteAnalysis = (id: string) => {
    const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
    setAnalyses(updatedAnalyses);
    if (selectedId === id) {
      setSelectedId(updatedAnalyses[0]?.id || null);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
  };

  // 선택된 분석 결과
  const selectedAnalysis = analyses.find(analysis => analysis.id === selectedId);

  return {
    analyses,
    selectedAnalysis,
    selectedId,
    setSelectedId,
    saveAnalysis,
    deleteAnalysis,
  };
} 