'use client';

import { AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface Guideline {
  id: string;
  icon: 'warning' | 'success' | 'info';
  title: string;
  description: string;
}

interface GuidelinesProps {
  guidelines: Guideline[];
  className?: string;
}

export default function Guidelines({ guidelines, className = '' }: GuidelinesProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'warning':
        return <AlertTriangle className="h-6 w-6" style={{ color: 'var(--color-warning)' }} />;
      case 'success':
        return <CheckCircle className="h-6 w-6" style={{ color: 'var(--color-success)' }} />;
      case 'info':
        return <FileText className="h-6 w-6" style={{ color: 'var(--color-info)' }} />;
      default:
        return <FileText className="h-6 w-6" style={{ color: 'var(--color-info)' }} />;
    }
  };

  return (
    <div 
      className={`border rounded-lg p-6 bg-white ${className}`}
      style={{ 
        borderColor: 'var(--color-light-green)',
        backgroundColor: 'white'
      }}
    >
      <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--color-dark-gray)' }}>
        Upload Guidelines
      </h3>
      
      <div className="space-y-4">
        {guidelines.map((guideline) => (
          <div key={guideline.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon(guideline.icon)}
            </div>
            <div>
              <h4 className="font-medium text-sm" style={{ color: 'var(--color-dark-gray)' }}>
                {guideline.title}
              </h4>
              <p className="text-sm mt-1" style={{ color: 'var(--color-medium-gray)' }}>
                {guideline.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
