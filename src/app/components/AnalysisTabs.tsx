'use client';

import { useState } from 'react';
import { SavedAnalysis } from '../types';
import styles from './AnalysisTabs.module.css';

interface AnalysisTabsProps {
  analyses: SavedAnalysis[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function AnalysisTabs({ analyses, selectedId, onSelect }: AnalysisTabsProps) {
  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabList}>
        {analyses.map((analysis) => (
          <button
            key={analysis.id}
            className={`${styles.tab} ${selectedId === analysis.id ? styles.selected : ''}`}
            onClick={() => onSelect(analysis.id)}
          >
            <div className={styles.tabContent}>
              <div className={styles.tabTitle}>
                {analysis.videoTitle || '무제'}
              </div>
              <div className={styles.tabDate}>
                {new Date(analysis.createdAt).toLocaleDateString()}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 