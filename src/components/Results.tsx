'use client';

import { useState } from 'react';
import { BudgetData } from '@/types';
import { generatePDF, downloadPDF } from '@/utils/pdf-generator';
import { trackPdfDownload } from '@/lib/analytics';

interface ResultsProps {
  data: BudgetData;
  archetype: any;
}

export default function Results({ data, archetype }: ResultsProps) {
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleDownloadPDF = () => {
    try {
      setIsPdfGenerating(true);
      const doc = generatePDF(data, archetype);
      downloadPDF(doc, data.category);
      
      // Track event
      trackPdfDownload(data.category, data.budget);

      // Show email capture form after PDF downloads
      setTimeout(() => {
        setShowEmailForm(true);
      }, 1000);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Error downloading PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const HeroChannel = data.hero_channel;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Channel */}
      {HeroChannel && (
        <div className="card mb-8 border-l-4 border-primary">
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-3">
              🎯 HERO CHANNEL
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              {HeroChannel.platform}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-600 mb-3">{HeroChannel.why_it_works}</p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>CAC:</strong> {HeroChannel.typical_cac}
                </p>
                <p>
                  <strong>Conversion Rate:</strong> {HeroChannel.conversion_rate}
                </p>
                <p>
                  <strong>Time to First Lead:</strong> {HeroChannel.time_to_first_lead}
                </p>
                <p>
                  <strong>Effort Level:</strong> {HeroChannel.effort_level}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-3">Budget Allocation</h4>
              <p className="text-3xl font-bold text-primary mb-1">
                ${data.budget_breakdown.hero.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm">(50% of your budget)</p>
            </div>
          </div>

          {HeroChannel.example_companies.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Examples of Success:</h4>
              <p className="text-gray-600 text-sm">
                {HeroChannel.example_companies.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Support Channels */}
      {data.support_channels.length > 0 && (
        <div className="card mb-8">
          <div className="mb-6">
            <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
              📊 SUPPORT CHANNELS (30%)
            </span>
            <h3 className="text-xl font-bold text-gray-900">
              Budget: ${data.budget_breakdown.support.toLocaleString()}/month
            </h3>
          </div>

          <div className="space-y-4">
            {data.support_channels.map((channel, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">{channel.platform}</h4>
                <p className="text-gray-600 text-sm mb-3">{channel.why_it_works}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">
                      <strong>CAC:</strong> {channel.typical_cac}
                    </p>
                    <p className="text-gray-600">
                      <strong>Conversion Rate:</strong> {channel.conversion_rate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden Goldmines */}
      {data.hidden_goldmines.length > 0 && (
        <div className="card mb-8">
          <div className="mb-6">
            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
              💎 HIDDEN GOLDMINES (20%)
            </span>
            <h3 className="text-xl font-bold text-gray-900">
              Budget: ${data.budget_breakdown.experiments.toLocaleString()}/month
            </h3>
          </div>

          <div className="space-y-4">
            {data.hidden_goldmines.map((goldmine, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">{goldmine.platform}</h4>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Why Hidden:</strong> {goldmine.why_hidden}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Why Goldmine:</strong> {goldmine.why_goldmine}
                </p>
                {goldmine.typical_cac && (
                  <p className="text-gray-600 text-sm mt-2">
                    <strong>CAC:</strong> {goldmine.typical_cac}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleDownloadPDF}
          disabled={isPdfGenerating}
          className={`w-full btn-primary ${isPdfGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPdfGenerating ? 'Generating PDF...' : '📥 Download Full Report (PDF)'}
        </button>

        {showEmailForm && (
          <div className="card bg-blue-50">
            <h4 className="font-bold text-gray-900 mb-3">Get Weekly Updates</h4>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to get platform updates and marketing tips every week.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="w-full btn-secondary text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
