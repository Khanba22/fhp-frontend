'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Upload, Eye, Download, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function HelpPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/');
  };

  const features = [
    {
      icon: <Upload className="h-6 w-6 text-blue-600" />,
      title: "Document Upload",
      description: "Upload your technical documents in PDF, DOC, or DOCX format. Maximum file size is 50MB per document."
    },
    {
      icon: <FileText className="h-6 w-6 text-green-600" />,
      title: "AI Analysis",
      description: "Our AI analyzes your documents for grammar, technical accuracy, clarity, and professional presentation."
    },
    {
      icon: <Eye className="h-6 w-6 text-purple-600" />,
      title: "Review Results",
      description: "View detailed analysis results with categorized suggestions and inline text improvements."
    },
    {
      icon: <Download className="h-6 w-6 text-orange-600" />,
      title: "Export Reports",
      description: "Download comprehensive PDF reports with all analysis results and recommendations."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Create New Project",
      description: "Click the '+ New Project' button on the dashboard to start a new document analysis."
    },
    {
      number: "2",
      title: "Upload Documents",
      description: "Upload your draft report and optionally a cover document. Enter your Gemini API key for processing."
    },
    {
      number: "3",
      title: "Wait for Processing",
      description: "The system will analyze your documents. This typically takes 2-5 minutes depending on document length."
    },
    {
      number: "4",
      title: "Review Results",
      description: "View the analysis results, including categorized issues, suggestions, and an executive summary."
    },
    {
      number: "5",
      title: "Export Report",
      description: "Download a comprehensive PDF report with all findings and recommendations."
    }
  ];

  const tips = [
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      text: "Ensure your documents are in supported formats (PDF, DOC, DOCX)"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      text: "Keep file sizes under 50MB for optimal processing speed"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      text: "Use clear, well-structured documents for better analysis results"
    },
    {
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      text: "Processing time may vary based on document complexity and length"
    },
    {
      icon: <Info className="h-5 w-5 text-blue-600" />,
      text: "All uploaded documents are encrypted and automatically deleted after 30 days"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Documentation</h1>
          <p className="text-xl text-gray-600">
            Learn how to use FHP Group&apos;s document analysis platform effectively
          </p>
        </div>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Use Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use the Platform</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Practices & Tips</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <ul className="space-y-4">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {tip.icon}
                  </div>
                  <span className="text-gray-700">{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Support Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Need More Help?</h2>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Contact Support</h3>
            <p className="text-blue-800 mb-4">
              If you&apos;re experiencing issues or have questions not covered in this guide, our support team is here to help.
            </p>
            <div className="space-y-2 text-blue-800">
              <p><strong>Email:</strong> support@fhpgroup.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What file formats are supported?</h3>
              <p className="text-gray-600">We support PDF, DOC, and DOCX files. The maximum file size is 50MB per document.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does analysis take?</h3>
              <p className="text-gray-600">Analysis typically takes 2-5 minutes depending on document length and complexity. You&apos;ll see a progress indicator during processing.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-600">Yes, all uploaded documents are encrypted and processed securely. Files are automatically deleted after 30 days for your privacy.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What types of analysis are performed?</h3>
              <p className="text-gray-600">Our AI analyzes documents for grammar, technical accuracy, clarity, formatting, internal consistency, professionalism, and risk mitigation.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
