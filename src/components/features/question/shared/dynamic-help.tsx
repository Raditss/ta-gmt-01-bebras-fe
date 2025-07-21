'use client';

import { useEffect, useState } from 'react';
import { HelpOverlay } from './help-overlay';
import { QuestionTypeEnum } from '@/types/question-type.type';

interface DynamicHelpProps {
  questionType: QuestionTypeEnum;
}

export function DynamicHelp({ questionType }: DynamicHelpProps) {
  const [HelpContent, setHelpContent] = useState<React.ComponentType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHelpContent = async () => {
      try {
        setLoading(true);
        setError(null);

        switch (questionType) {
          case QuestionTypeEnum.CFG: {
            const mod = await import('./help-content/cfg-help');
            setHelpContent(() => mod.CfgHelp);
            break;
          }
          case QuestionTypeEnum.CIPHER_N: {
            const mod = await import('./help-content/cipher-n-help');
            setHelpContent(() => mod.CipherNHelp);
            break;
          }
          case QuestionTypeEnum.RING_CIPHER: {
            const mod = await import('./help-content/ring-cipher-help');
            setHelpContent(() => mod.RingCipherHelp);
            break;
          }
          case QuestionTypeEnum.ANOMALY_MONSTER: {
            const mod = await import('./help-content/anomaly-monster-help');
            setHelpContent(() => mod.AnomalyMonsterHelp);
            break;
          }
          default: {
            const mod = await import('./help-content/not-implemented');
            setHelpContent(() => mod.NotImplementedHelp);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load help content:', err);
        setError('Failed to load help content');
      } finally {
        setLoading(false);
      }
    };

    loadHelpContent();
  }, [questionType]);

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (error) {
    return null; // Don't show help if there's an error
  }

  if (!HelpContent) {
    return null; // Don't show help if no content is available
  }

  const questionTypeName = questionType
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <HelpOverlay questionType={questionTypeName}>
      <HelpContent />
    </HelpOverlay>
  );
}
