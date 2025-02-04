'use client';
import styles from '../page.module.css';

interface ProgressDisplayProps {
  progress: string;
  autoScrollEnabled: boolean;
}

export default function ProgressDisplay({ progress, autoScrollEnabled }: ProgressDisplayProps) {
  if (!progress) return null;

  return (
    <div className={styles.progress}>
      <h2>
        진행 상황
        <div className={styles.autoScrollStatus}>
          {autoScrollEnabled ? '자동 스크롤 활성화' : '자동 스크롤 비활성화'}
        </div>
      </h2>
      <pre>
        {progress}
      </pre>
    </div>
  );
} 