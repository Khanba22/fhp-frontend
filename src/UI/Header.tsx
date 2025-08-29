'use client';

import Image from 'next/image';
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logo.png" alt="FHP Logo" width={64} height={64} />
          </div>
          
          {/* Navigation Steps */}
          <ProgressSteps 
            steps={steps} 
            currentStep={currentStep}
            className="lg:ml-auto"
          />
        </div>
      </div>
    </header>
  );
}
