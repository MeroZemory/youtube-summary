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

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const { autoScrollEnabled, resetAutoScroll } = useAutoScroll(progress);

  const handleSubmit = async (url: string) => {
    try {
      setLoading(true);
      setError('');
      setProgress('');
      setResult(null);
      resetAutoScroll();

      await processVideo(
        url,
        (status) => setProgress(prev => prev + status + '\n'),
        (data) => {
          setResult(data);
          setProgress('');
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
        <h1>유튜브 동영상 분석</h1>
        
        <VideoForm onSubmit={handleSubmit} loading={loading} />
        <ProgressDisplay progress={progress} autoScrollEnabled={autoScrollEnabled} />
        <ErrorDisplay error={error} />
        <ResultDisplay result={result} />
      </main>
    </div>
  );
}
