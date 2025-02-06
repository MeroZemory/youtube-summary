'use client';
import styles from '../page.module.css';
import { AnalysisResult, ParsedVideoInfo } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult | null;
  videoInfo: ParsedVideoInfo | null;
}

export default function ResultDisplay({ result, videoInfo }: ResultDisplayProps) {
  if (!result || !videoInfo) return null;

  return (
    <div className={styles.result}>
      <div className={styles.videoInfo}>
        <h2>{videoInfo.title}</h2>
        <div className={styles.meta}>
          <span>{videoInfo.channel}</span>
          {videoInfo.duration && (
            <span>
              {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
      </div>

      <h3>요약</h3>
      <p>{result.summary}</p>

      <h3>타임스탬프</h3>
      <ul>
        {result.timestamps.map((item, index) => (
          <li key={index}>
            <span>{item.time}</span>: {item.text}
          </li>
        ))}
      </ul>

      <h3>처리 시간</h3>
      <ul>
        {result.processingTimes.map((time, index) => (
          <li key={index}>
            {time.step}: {time.duration.toFixed(2)}초
          </li>
        ))}
      </ul>
    </div>
  );
}