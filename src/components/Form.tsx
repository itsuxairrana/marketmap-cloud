'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateForm } from '@/utils/validators';
import { trackFormSubmit } from '@/lib/analytics';
import { ARCHETYPES } from '@/lib/constants';

export default function Form() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('10000');
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors = validateForm(category, budget);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors
    setErrors({});
    setIsLoading(true);

    // Track event
    trackFormSubmit(category, Number(budget));

    // Redirect to results
    setTimeout(() => {
      router.push(`/result?category=${category}&budget=${budget}`);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          What are you building?
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setErrors({ ...errors, category: '' });
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your business type...</option>
          {Object.entries(ARCHETYPES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        {errors.category && <p className="error-message">{errors.category}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
          Monthly marketing budget ($)
        </label>
        <input
          id="budget"
          type="number"
          value={budget}
          onChange={(e) => {
            setBudget(e.target.value);
            setErrors({ ...errors, budget: '' });
          }}
          min="0"
          max="100000"
          step="100"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.budget ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your monthly budget"
        />
        {errors.budget && <p className="error-message">{errors.budget}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Loading...' : 'Get Platform Map'}
      </button>
    </form>
  );
}
