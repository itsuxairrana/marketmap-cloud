// API Helper Functions

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

export const errorResponse = (error: string): ApiResponse<null> => {
  return {
    success: false,
    error,
  };
};

export const getSessionId = (): string => {
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
  return '';
};

export const validateBudget = (budget: any): boolean => {
  const num = Number(budget);
  return !isNaN(num) && num >= 0 && num <= 100000;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCategory = (category: string): boolean => {
  const validCategories = ['b2b_saas', 'dtc_ecommerce', 'indie_hackers', 'agency_service'];
  return validCategories.includes(category);
};
