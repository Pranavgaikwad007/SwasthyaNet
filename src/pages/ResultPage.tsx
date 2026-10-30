import React from 'react';
import { ResultCard } from '../components/result/ResultCard';

export const ResultPage: React.FC = () => {
  return (
    <div className="py-4 sm:py-8 animate-in fade-in duration-150">
      <ResultCard />
    </div>
  );
};
