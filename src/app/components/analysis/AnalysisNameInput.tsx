'use client';

import { useState } from 'react';
import styles from './AnalysisNameInput.module.css';

interface AnalysisNameInputProps {
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
}

export function AnalysisNameInput({
  initialName = '',
  onSubmit,
  onCancel,
  placeholder = '분석 결과 이름을 입력하세요',
  submitLabel = '저장'
}: AnalysisNameInputProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        autoFocus
      />
      <div className={styles.buttons}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!name.trim()}
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
} 