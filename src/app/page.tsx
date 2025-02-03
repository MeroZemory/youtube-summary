'use client';
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    timestamps: Array<{time: string, text: string}>;
    processingTimes: Array<{step: string, duration: number}>;
  } | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const progressRef = useRef<HTMLPreElement>(null);
  const isScrolledToBottom = useRef(true);

  // 스크롤 위치 체크 함수
  const checkScrollPosition = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    return Math.abs(documentHeight - windowHeight - scrollTop) < 10;
  };

  // progress가 업데이트될 때마다 스크롤 처리
  useEffect(() => {
    requestAnimationFrame(() => {
      if (isScrolledToBottom.current) {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'instant'
        });
      }
    });
  }, [progress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProgress('');
    setResult(null);
    isScrolledToBottom.current = true;

    try {
      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'complete') {
              setResult(data.data);
              setProgress('');
            } else if (data.type === 'error') {
              setError(data.error);
              setProgress('');
            } else {
              // 진행 상황 업데이트 전에 스크롤 위치 체크
              isScrolledToBottom.current = checkScrollPosition();
              setProgress(prev => prev + data.status + '\n');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing video:', error);
      setError('요청 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>유튜브 동영상 분석</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="유튜브 URL을 입력하세요"
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? '처리중...' : '분석하기'}
          </button>
        </form>

        {progress && (
          <div className={styles.progress}>
            <h2>진행 상황:</h2>
            <pre ref={progressRef}>
              {progress}
            </pre>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <h2>오류:</h2>
            <p>{error}</p>
          </div>
        )}

        {result && (
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
        )}
      </main>
    </div>
  );
}
