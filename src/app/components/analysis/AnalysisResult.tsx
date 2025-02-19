'use client';

import { SavedAnalysis, ParsedVideoInfo } from '@/app/types';
import styles from './AnalysisResult.module.css';
import Image from 'next/image';

interface AnalysisResultProps {
  analysis: SavedAnalysis;
  videoInfo: ParsedVideoInfo;
}

export function AnalysisResult({ analysis, videoInfo }: AnalysisResultProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {videoInfo.thumbnail && (
          <Image 
            src={videoInfo.thumbnail} 
            alt="비디오 썸네일"
            width={480}
            height={360}
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
          <div className={styles.videoInfo}>
            <span className={styles.channel}>{videoInfo.channel}</span>
            {videoInfo.duration && (
              <span className={styles.duration}>
                {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
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
          <h3>전체 내용</h3>
          <p>{analysis.result.fullText}</p>
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
                <div className={styles.processingTimeHeader}>
                  <span className={styles.step}>{time.step}</span>
                  <span className={styles.duration}>{time.duration.toFixed(2)}초</span>
                </div>
                <div className={styles.processingTimeDetails}>
                  <span>시작: {new Date(time.startTime).toLocaleTimeString()}</span>
                  <span>종료: {new Date(time.endTime).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
            <div className={styles.totalTime}>
              <div className={styles.totalTimeHeader}>
                <span className={styles.step}>전체 처리 시간</span>
                <span className={styles.duration}>
                  {analysis.result.processingTimes.reduce((acc, curr) => acc + curr.duration, 0).toFixed(2)}초
                </span>
              </div>
              <div className={styles.processingTimeDetails}>
                <span>시작: {new Date(analysis.result.processingTimes[0]?.startTime).toLocaleTimeString()}</span>
                <span>종료: {new Date(analysis.result.processingTimes[analysis.result.processingTimes.length - 1]?.endTime).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 