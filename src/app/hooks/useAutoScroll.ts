'use client';
import { useEffect, useRef, useState } from 'react';
import styles from '../page.module.css';

type ScrollConfig = {
  readonly TARGET: {
    readonly MARGIN: number;  // 로그 컴포넌트 하단에서 얼마나 더 내려갈지
  };
};

const AUTO_SCROLL_CONFIG: ScrollConfig = {
  TARGET: {
    MARGIN: 50,  // 로그 컴포넌트 하단에서 50px 더 내려간 곳을 타겟으로
  }
} as const;

const isInAutoScrollZone = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  
  // 로그 컴포넌트의 하단이 화면 하단보다 위에 있으면 자동 스크롤 활성화
  // rect.bottom: 컴포넌트 하단의 화면 상단으로부터의 거리
  // window.innerHeight: 화면 높이
  return rect.bottom <= window.innerHeight;
};

export function useAutoScroll(progress: string) {
  const [isEnabled, setIsEnabled] = useState(true);

  // progress가 업데이트될 때마다 스크롤 처리
  useEffect(() => {
    if (!progress) return;

    const progressElement = document.querySelector(`.${styles.progress}`) as HTMLElement;
    if (!progressElement) return;

    // 자동 스크롤이 활성화되어 있을 때만 스크롤
    if (isEnabled) {
      // 로그 컴포넌트 하단에서 MARGIN만큼 더 내려간 위치로 스크롤
      const targetScroll = window.scrollY + progressElement.getBoundingClientRect().bottom - 
                          window.innerHeight + AUTO_SCROLL_CONFIG.TARGET.MARGIN;
      window.scrollTo({
        top: targetScroll,
        behavior: 'instant'
      });
    }
  }, [progress, isEnabled]);

  // 스크롤 이벤트 핸들러 설정
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const progressElement = document.querySelector(`.${styles.progress}`) as HTMLElement;
      if (!progressElement) return;

      // 현재 상태와 다를 때만 업데이트
      const newEnabled = isInAutoScrollZone(progressElement);
      if (newEnabled !== isEnabled) {
        setIsEnabled(newEnabled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEnabled]);

  return {
    autoScrollEnabled: isEnabled,
    resetAutoScroll: () => setIsEnabled(true)
  };
} 