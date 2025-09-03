'use client';

import ProgressSteps from './ProgressSteps';

interface HeaderProps {
  currentStep: string;
  className?: string;
}

export default function Header({ currentStep, className = '' }: HeaderProps) {
  const steps = [
    { id: 'upload', label: 'Document Upload' },
    { id: 'review', label: 'Report and Summary' },
    { id: 'preview', label: 'Preview & Download' }
  ];

  return (
    <header className={`${className}`}>
      {/* Top border */}
      <div className="h-1 w-full" style={{ backgroundColor: 'var(--color-light-blue-border)' }}></div>
      
      {/* Header content */}
      <div className="max-w-7xl mx-auto px-4 py-2">
       
          {/* Navigation Steps */}
          <ProgressSteps 
            steps={steps} 
            currentStep={currentStep}
            className="lg:ml-auto"
          />
      </div>
    </header>
  );
}
