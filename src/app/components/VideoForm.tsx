'use client';
import { useState } from 'react';
import styles from '../page.module.css';

interface VideoFormProps {
  onSubmit: (url: string) => Promise<void>;
  loading: boolean;
  defaultUrl: string;
}

export default function VideoForm({ onSubmit, loading, defaultUrl }: VideoFormProps) {
  const [url, setUrl] = useState(defaultUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="유튜브 URL을 입력하세요"
        className={styles.input}
        disabled={loading}
        title={url}
      />
      <button type="submit" disabled={loading} className={styles.button}>
        {loading ? '처리 중...' : '분석하기'}
      </button>
    </form>
  );
} 