'use client';

import { Header } from '@/UI';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with navigation */}
      <Header currentStep="preview" />
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page title and description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-dark-gray)' }}>
            Document Analysis Complete
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-medium-gray)' }}>
            Your document has been successfully analyzed. You can now view the results and download the report.
          </p>
        </div>

        {/* Success message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
          <div className="text-green-600 text-lg font-medium mb-2">
            ✅ Analysis Completed Successfully
          </div>
          <p className="text-green-700">
            Your Technical Due Diligence document has been processed and analyzed by our AI system.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Analysis Report
          </button>
          <button
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Download PDF Report
          </button>
          <button
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Start New Analysis
          </button>
        </div>

        {/* Summary information */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: 'var(--color-tertiary)' }}>
            <div className="text-2xl font-bold mb-2" style={{ color: 'var(--color-dark-gray)' }}>
              15
            </div>
            <div className="text-sm" style={{ color: 'var(--color-medium-gray)' }}>
              Issues Found
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: 'var(--color-tertiary)' }}>
            <div className="text-2xl font-bold mb-2" style={{ color: 'var(--color-dark-gray)' }}>
              92%
            </div>
            <div className="text-sm" style={{ color: 'var(--color-medium-gray)' }}>
              Quality Score
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: 'var(--color-tertiary)' }}>
            <div className="text-2xl font-bold mb-2" style={{ color: 'var(--color-dark-gray)' }}>
              2m 34s
            </div>
            <div className="text-sm" style={{ color: 'var(--color-medium-gray)' }}>
              Processing Time
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-dark-gray)' }}>
            Next Steps
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--color-medium-gray)' }}>
            <li>• Review the detailed analysis report</li>
            <li>• Address any critical issues identified</li>
            <li>• Download the final report for your records</li>
            <li>• Share results with your team if needed</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
