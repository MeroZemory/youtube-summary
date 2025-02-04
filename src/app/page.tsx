'use client';
import { useState } from "react";
import styles from "./page.module.css";
import VideoForm from "./components/VideoForm";
import ProgressDisplay from "./components/ProgressDisplay";
import ErrorDisplay from "./components/ErrorDisplay";
import ResultDisplay from "./components/ResultDisplay";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { processVideo } from "./api/videoApi";
import { VideoResult } from "./types";
import LoginButton from "./components/LoginButton";
import AnalysisTabs from "./components/AnalysisTabs";
import AnalysisResult from "./components/AnalysisResult";
import { useAnalysisStore } from "./hooks/useAnalysisStore";

// 개발 환경에서만 기본 URL 사용
const DEFAULT_VIDEO_URL = process.env.NEXT_PUBLIC_DEFAULT_VIDEO_URL || '';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [url, setUrl] = useState(DEFAULT_VIDEO_URL);
  
  const { autoScrollEnabled, resetAutoScroll } = useAutoScroll(progress);
  const { 
    analyses, 
    selectedAnalysis, 
    selectedId, 
    setSelectedId, 
    saveAnalysis, 
    deleteAnalysis,
    findAnalysisByUrl
  } = useAnalysisStore();

  const handleSubmit = async (submittedUrl: string) => {
    try {
      // 기존 분석 결과 확인
      const existingAnalysis = findAnalysisByUrl(submittedUrl);
      if (existingAnalysis) {
        setProgress('이미 분석된 영상입니다. 저장된 결과를 불러옵니다.\n');
        setTimeout(() => setProgress(''), 2000);
        return;
      }

      setLoading(true);
      setError('');
      setProgress('');
      setResult(null);
      resetAutoScroll();
      setUrl(submittedUrl);

      await processVideo(
        submittedUrl,
        (status) => setProgress(prev => prev + status + '\n'),
        (data) => {
          setResult(data);
          setProgress('');
          saveAnalysis(submittedUrl, data);
        },
        (error) => {
          setError(error);
          setProgress('');
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>유튜브 동영상 분석</h1>
          <LoginButton />
        </div>
        
        <VideoForm onSubmit={handleSubmit} loading={loading} defaultUrl={url} />
        <ProgressDisplay progress={progress} autoScrollEnabled={autoScrollEnabled} />
        <ErrorDisplay error={error} />
        
        {analyses.length > 0 && (
          <div className={styles.analysisSection}>
            <AnalysisTabs 
              analyses={analyses} 
              selectedId={selectedId} 
              onSelect={setSelectedId} 
            />
            {selectedAnalysis && (
              <div className={styles.analysisContent}>
                <AnalysisResult analysis={selectedAnalysis} />
                <button 
                  className={styles.deleteButton}
                  onClick={() => deleteAnalysis(selectedAnalysis.id)}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}

        {result && !selectedAnalysis && <ResultDisplay result={result} />}
      </main>
    </div>
  );
}
