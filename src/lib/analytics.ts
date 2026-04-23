// Google Analytics 4 Event Tracking

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: url,
    });
  }
};

export const event = (action: string, params: any = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};

// Custom events for MarketMap
export const trackFormSubmit = (category: string, budget: number) => {
  event('form_submit', {
    category,
    budget_amount: budget,
  });
};

export const trackResultsView = (category: string, budget: number) => {
  event('results_viewed', {
    category,
    budget_amount: budget,
  });
};

export const trackPdfDownload = (category: string, budget: number) => {
  event('pdf_downloaded', {
    category,
    budget_amount: budget,
  });
};

export const trackEmailCapture = (category: string, budget: number) => {
  event('email_captured', {
    category,
    budget_amount: budget,
  });
};

export const trackError = (error: string, context?: string) => {
  event('error_occurred', {
    error_message: error,
    error_context: context,
  });
};

// Type declaration for window.gtag
declare global {
  interface Window {
    gtag: any;
  }
}
