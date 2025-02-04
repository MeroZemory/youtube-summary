'use client';

import { useState } from 'react';
import { SavedAnalysis } from '../../types';
import styles from './AnalysisTabs.module.css';
import { AnalysisNameInput } from './AnalysisNameInput';

interface TabsProps {
  analyses: SavedAnalysis[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function AnalysisTabs({ analyses, selectedId, onSelect, onRename }: TabsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleRename = (id: string, name: string) => {
    onRename(id, name);
    setEditingId(null);
  };

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabList}>
        {analyses.map((analysis) => (
          <div key={analysis.id} className={styles.tabWrapper}>
            {editingId === analysis.id ? (
              <AnalysisNameInput
                initialName={analysis.name}
                onSubmit={(name) => handleRename(analysis.id, name)}
                onCancel={() => setEditingId(null)}
                submitLabel="변경"
              />
            ) : (
              <button
                className={`${styles.tab} ${selectedId === analysis.id ? styles.selected : ''}`}
                onClick={() => onSelect(analysis.id)}
              >
                <div className={styles.tabContent}>
                  <div className={styles.tabTitle}>
                    {analysis.name}
                    <button
                      className={styles.renameButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(analysis.id);
                      }}
                      title="이름 변경"
                    >
                      ✎
                    </button>
                  </div>
                  <div className={styles.tabDate}>
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 