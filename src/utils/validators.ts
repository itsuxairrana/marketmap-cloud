// Form Validators

export interface FormErrors {
  category?: string;
  budget?: string;
}

export const validateForm = (category: string, budget: string): FormErrors => {
  const errors: FormErrors = {};

  // Validate category
  if (!category || category.trim() === '') {
    errors.category = 'Please select what you\'re building';
  }

  // Validate budget
  const budgetNum = Number(budget);
  if (!budget || budget.trim() === '') {
    errors.budget = 'Please enter your monthly budget';
  } else if (isNaN(budgetNum)) {
    errors.budget = 'Budget must be a number';
  } else if (budgetNum < 0) {
    errors.budget = 'Budget cannot be negative';
  } else if (budgetNum > 100000) {
    errors.budget = 'Budget cannot exceed $100,000';
  }

  return errors;
};

export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const validateBudget = (budget: number): boolean => {
  return budget >= 1000 && budget <= 1000000;
};

export const validateCategory = (category: string): boolean => {
  return !!category && category.trim().length > 0;
};
