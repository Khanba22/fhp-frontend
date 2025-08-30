'use client';

interface HeaderProps {
  fileName: string;
  completionPercentage: number;
  currentStep: number;
  totalSteps: number;
}

export default function Header({ fileName, completionPercentage, currentStep, totalSteps }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* FHP Logo */}
          <div 
            className="w-12 h-12 rounded flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <span className="text-white font-bold text-lg">FHP</span>
          </div>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">FHP QA Tool</h1>
            <p className="text-sm text-gray-600">{fileName}</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-success)' }}
            ></div>
            <span className="text-sm text-gray-600">Auto-saved</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${completionPercentage}%`,
                  backgroundColor: 'var(--color-success)'
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{completionPercentage}% Complete</span>
          </div>
          
          <div className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </div>
    </header>
  );
}
