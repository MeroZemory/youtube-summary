'use client';
import styles from '../page.module.css';

interface ResultDisplayProps {
  result: {
    summary: string;
    timestamps: Array<{time: string, text: string}>;
    processingTimes: Array<{step: string, duration: number}>;
  } | null;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) return null;

  return (
    <div className={styles.result}>
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
    </div>
  );
}