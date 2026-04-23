import Form from '@/components/Form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketMap - Find Where Your Customers Hang Out',
  description: 'Discover the best marketing channels for your startup with real CAC data and budget allocation.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">MarketMap</h1>
            <p className="text-gray-600">Find where your customers actually hang out</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-3xl mx-auto mb-12">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stop Guessing. <span className="text-primary">Start Converting.</span>
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Most founders waste 40% of their marketing budget on the wrong channels.
              <br />
              <strong>MarketMap shows you exactly where to spend your money.</strong>
            </p>
          </section>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Get Your Platform Map
            </h3>
            <Form />
          </div>

          {/* Benefits Section */}
          <section className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h4 className="text-lg font-bold text-primary mb-3">🎯 Hero Channel</h4>
              <p className="text-gray-600">
                Identify the ONE channel that will work best for your startup with real data, not guesses.
              </p>
            </div>

            <div className="card">
              <h4 className="text-lg font-bold text-primary mb-3">💎 Hidden Goldmines</h4>
              <p className="text-gray-600">
                Discover niche platforms and communities that competitors miss (low CAC, high intent).
              </p>
            </div>

            <div className="card">
              <h4 className="text-lg font-bold text-primary mb-3">💰 Budget Breakdown</h4>
              <p className="text-gray-600">
                See exactly how much to allocate across channels (50% hero, 30% support, 20% experiments).
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="mt-12 bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-white font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Tell us about your business</h4>
                  <p className="text-gray-600">Select your business type and monthly budget</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-white font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Get your platform map</h4>
                  <p className="text-gray-600">See hero channels, support channels, and hidden goldmines</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-white font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Download your report</h4>
                  <p className="text-gray-600">Get a PDF with budget allocation and audience locations</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
