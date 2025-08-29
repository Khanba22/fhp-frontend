'use client';

import { ChevronRight } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: string;
  className?: string;
}

export default function ProgressSteps({ steps, currentStep, className = '' }: ProgressStepsProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step */}
          <div
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${step.id === currentStep 
                ? 'text-white' 
                : 'text-gray-500'
              }
            `}
            style={{
              backgroundColor: step.id === currentStep 
                ? 'var(--color-dark-gray)' 
                : 'transparent'
            }}
          >
            {step.label}
          </div>
          
          {/* Separator */}
          {index < steps.length - 1 && (
            <ChevronRight 
              className="h-5 w-5 mx-2" 
              style={{ color: 'var(--color-dark-gray)' }} 
            />
          )}
        </div>
      ))}
    </div>
  );
}
