'use client';
import { useState } from 'react';
import styles from '../page.module.css';

interface VideoFormProps {
  onSubmit: (url: string) => Promise<void>;
  loading: boolean;
  defaultUrl: string;
}

const isValidYoutubeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // youtube.com 또는 youtu.be 도메인 체크
    const isYoutubeDomain = urlObj.hostname === 'www.youtube.com' || 
                           urlObj.hostname === 'youtube.com' || 
                           urlObj.hostname === 'youtu.be';
    
    // youtube.com의 경우 v 파라미터 체크
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      return isYoutubeDomain && !!videoId;
    }
    
    // youtu.be의 경우 경로에서 동영상 ID 체크
    if (urlObj.hostname === 'youtu.be') {
      return isYoutubeDomain && urlObj.pathname.length > 1;
    }

    return false;
  } catch {
    return false;
  }
};

export default function VideoForm({ onSubmit, loading, defaultUrl }: VideoFormProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('URL을 입력해주세요.');
      return;
    }

    if (!isValidYoutubeUrl(url)) {
      setError('올바른 유튜브 URL을 입력해주세요.');
      return;
    }

    setError('');
    await onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          placeholder="유튜브 URL을 입력하세요"
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          disabled={loading}
          title={url}
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
      <button 
        type="submit" 
        disabled={loading || !url.trim()} 
        className={styles.button}
      >
        {loading ? '처리 중...' : '분석하기'}
      </button>
    </form>
  );
} 