import React from 'react';
import { SymptomIntakeWizard } from '../components/screening/SymptomIntakeWizard';

export const CitizenScreeningPage: React.FC = () => {
  return (
    <div className="py-4 sm:py-8 animate-in fade-in duration-150">
      <SymptomIntakeWizard channel="citizen" />
    </div>
  );
};
