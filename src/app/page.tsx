'use client';
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    description: string;
    summary: string;
    timestamps: Array<{time: string, text: string}>;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.json();
        alert(`동영상 처리 중 오류가 발생했습니다. (${errorData.error})`);
      }
    } catch (error) {
      console.error('Error processing video:', error);
      alert('동영상 처리 중 오류가 발생했습니다.');
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

        {result && (
          <div className={styles.result}>
            <h2>{result.title}</h2>
            <h3>설명</h3>
            <p>{result.description}</p>
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
