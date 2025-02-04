'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../page.module.css';

export default function LoginButton() {
  // 환경 변수가 'true' 문자열일 때만 로그인 기능 활성화
  const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';
  const { data: session } = useSession(); // 조건부로 호출하면 안됨

  // 로그인 기능이 비활성화되어 있거나 세션 로딩 중이면 아무것도 렌더링하지 않음
  if (!isAuthEnabled) return null;

  // 로그인된 경우
  if (session) {
    return (
      <button 
        onClick={() => signOut()} 
        className={styles.loginButton}
      >
        로그아웃
      </button>
    );
  }

  // 로그인되지 않은 경우
  return (
    <button 
      onClick={() => signIn('google')} 
      className={styles.loginButton}
    >
      Google로 로그인
    </button>
  );
} 