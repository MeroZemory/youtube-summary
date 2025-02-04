'use client';

import { SavedAnalysis } from '../../types';
import styles from './AnalysisResult.module.css';

interface AnalysisResultProps {
  analysis: SavedAnalysis;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {analysis.thumbnailUrl && (
          <img 
            src={analysis.thumbnailUrl} 
            alt="비디오 썸네일" 
            className={styles.thumbnail}
          />
        )}
        <div className={styles.info}>
          <h2 className={styles.title}>{analysis.name}</h2>
          <a 
            href={analysis.videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            원본 영상 보기
          </a>
          <div className={styles.date}>
            분석일: {new Date(analysis.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h3>요약</h3>
          <p>{analysis.result.summary}</p>
        </section>

        <section className={styles.section}>
          <h3>타임스탬프</h3>
          <div className={styles.timestamps}>
            {analysis.result.timestamps.map((stamp, index) => (
              <div key={index} className={styles.timestamp}>
                <span className={styles.time}>{stamp.time}</span>
                <span className={styles.text}>{stamp.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3>처리 시간</h3>
          <div className={styles.processingTimes}>
            {analysis.result.processingTimes.map((time, index) => (
              <div key={index} className={styles.processingTime}>
                <span className={styles.step}>{time.step}</span>
                <span className={styles.duration}>{time.duration.toFixed(2)}초</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 