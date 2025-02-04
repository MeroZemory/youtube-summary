'use client';
import styles from '../page.module.css';

interface ErrorDisplayProps {
  error: string;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className={styles.error}>
      <h2>오류:</h2>
      <p>{error}</p>
    </div>
  );
} 