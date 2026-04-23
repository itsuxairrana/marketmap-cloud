import type { Metadata } from 'next';
import './globals.css';
import { SEO_METADATA, SITE_URL, GA_ID } from '@/lib/constants';

export const metadata: Metadata = {
  title: SEO_METADATA.title,
  description: SEO_METADATA.description,
  keywords: SEO_METADATA.keywords.join(', '),
  authors: SEO_METADATA.authors,
  openGraph: {
    title: SEO_METADATA.title,
    description: SEO_METADATA.description,
    url: SITE_URL,
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0066cc" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
            <div className="container text-center text-gray-600 text-sm">
              <p>&copy; 2026 MarketMap. Find where your customers hang out.</p>
              <p className="mt-2">
                <a href="/" className="hover:text-primary">Home</a> • 
                <a href="#about" className="hover:text-primary ml-2">About</a> • 
                <a href="#contact" className="hover:text-primary ml-2">Contact</a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
