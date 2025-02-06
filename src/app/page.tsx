'use client';
import { useState } from "react";
import styles from "./page.module.css";
import VideoForm from "./components/VideoForm";
import ProgressDisplay from "./components/ProgressDisplay";
import ErrorDisplay from "./components/ErrorDisplay";
import ResultDisplay from "./components/ResultDisplay";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { processVideo } from "./api/videoApi";
import { AnalysisResult, ParsedVideoInfo, zodVideoInfo } from "./types";
import LoginButton from "./components/LoginButton";
import { AnalysisTabs } from "./components/analysis/AnalysisTabs";
import { AnalysisResult as AnalysisResultComponent } from "./components/analysis/AnalysisResult";
import { AnalysisNameInput } from "./components/analysis/AnalysisNameInput";
import { useAnalysisStore } from "./hooks/useAnalysisStore";
import { message } from "antd";

// 개발 환경에서만 기본 URL 사용
const DEFAULT_VIDEO_URL = process.env.NEXT_PUBLIC_DEFAULT_VIDEO_URL || '';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [url, setUrl] = useState(DEFAULT_VIDEO_URL);
  
  const { autoScrollEnabled, resetAutoScroll } = useAutoScroll(progress);
  const { 
    analyses, 
    selectedId,
    setSelectedId,
    addAnalysis,
    updateAnalysisName,
    deleteAnalysis,
    getSelectedAnalysis,
    clearAnalyses
  } = useAnalysisStore();

  const handleSubmit = async (submittedUrl: string) => {
    try {
      // 기존 분석 결과 확인
      const existingAnalysis = analyses.find(analysis => analysis.videoUrl === submittedUrl);
      if (existingAnalysis) {
        setSelectedId(existingAnalysis.id);
        message.info('이미 분석된 영상입니다. 저장된 결과를 불러왔습니다.');
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
          addAnalysis(submittedUrl, data);
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

  const selectedAnalysis = getSelectedAnalysis();

  // 선택된 분석 결과의 videoInfoRaw을 ParsedVideoInfo로 파싱
  let parsedVideoInfo: ParsedVideoInfo | null = null;
  if (selectedAnalysis !== null) {
    const zodResult = zodVideoInfo.safeParse(selectedAnalysis.result.videoInfoRaw);
    if (!zodResult.success) {
      // 로그 출력
      console.error(`videoInfoRaw is not a valid zodVideoInfo. videoInfoRaw: ${selectedAnalysis.result.videoInfoRaw}, error: ${zodResult.error.message}`);
    }
    else {
      parsedVideoInfo = zodResult;
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>유튜브 동영상 분석</h1>
          <div className={styles.headerButtons}>
            <LoginButton />
            {analyses.length > 0 && (
              <button
                className={styles.clearButton}
                onClick={() => {
                  if (window.confirm('모든 분석 결과가 삭제됩니다. 계속하시겠습니까?')) {
                    clearAnalyses();
                    message.success('모든 분석 결과가 삭제되었습니다.');
                  }
                }}
              >
                캐시 비우기
              </button>
            )}
          </div>
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
              onRename={updateAnalysisName}
            />
            {selectedAnalysis && parsedVideoInfo && (
              <div className={styles.analysisContent}>
                <AnalysisResultComponent analysis={selectedAnalysis} videoInfo={parsedVideoInfo} />
                <button 
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.confirm('이 분석 결과를 삭제하시겠습니까?')) {
                      deleteAnalysis(selectedAnalysis.id);
                      message.success('분석 결과가 삭제되었습니다.');
                    }
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}

        {result && !selectedAnalysis && (
          <ResultDisplay 
            result={result} 
            videoInfo={parsedVideoInfo}
          />
        )}
      </main>
    </div>
  );
}
