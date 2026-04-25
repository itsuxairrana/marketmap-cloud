'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import businessTaxonomy from '@/data/business_taxonomy.json';
import rawBusinessData from '@/data/business_marketing_data.json';
import { FormState } from '@/types/business';
import { validateBudget } from '@/utils/validators';
import { trackFormSubmit } from '@/lib/analytics';

// Extract business types from the raw data structure
const businessData = (rawBusinessData as any).business_types || [];

export default function Form() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    selectedCategory: null,
    selectedSubcategory: null,
    selectedBusinessType: null,
    selectedVariant: 'online',
    selectedBudget: 10000,
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});

  // Get available subcategories based on selected category
  const subcategories = useMemo(() => {
    if (!formState.selectedCategory) return [];
    const category = businessTaxonomy.categories.find(
      (c) => c.id === formState.selectedCategory
    );
    return category?.subcategories || [];
  }, [formState.selectedCategory]);

  // Get available micro-categories/business types
  const businessTypes = useMemo(() => {
    if (!formState.selectedSubcategory) return [];
    const subcategory = businessTaxonomy.categories
      .flatMap((c) => c.subcategories)
      .find((s) => s.id === formState.selectedSubcategory);

    if (!subcategory) return [];

    // Map micro-categories to business data
    return subcategory.microcategories.map((micro) => {
      const businessItem = businessData.find(
        (b: any) => b.microcategory === micro.id
      );
      return {
        id: micro.id,
        name: micro.name,
        hasOnline: micro.variants.some((v) => v.type === 'online'),
        hasPhysical: micro.variants.some((v) => v.type === 'physical'),
        hasB2b: micro.variants.some((v) => v.type === 'b2b'),
        businessData,
      };
    });
  }, [formState.selectedSubcategory]);

  // Get available variants for selected business type
  const availableVariants = useMemo(() => {
    if (!formState.selectedBusinessType) return [];
    const businessType = businessTypes.find(
      (b) => b.id === formState.selectedBusinessType
    );

    if (!businessType) return [];

    const variants: Array<'online' | 'physical' | 'b2b'> = [];
    if (businessType.hasOnline) variants.push('online');
    if (businessType.hasPhysical) variants.push('physical');
    if (businessType.hasB2b) variants.push('b2b');

    return variants;
  }, [formState.selectedBusinessType, businessTypes]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setFormState({
      ...formState,
      selectedCategory: categoryId || null,
      selectedSubcategory: null,
      selectedBusinessType: null,
      selectedVariant: 'online',
    });
    setErrors({});
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategoryId = e.target.value;
    setFormState({
      ...formState,
      selectedSubcategory: subcategoryId || null,
      selectedBusinessType: null,
      selectedVariant: 'online',
    });
    setErrors({});
  };

  const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const businessTypeId = e.target.value;
    const selectedType = businessTypes.find((b) => b.id === businessTypeId);

    // Auto-select first available variant
    let defaultVariant: 'online' | 'physical' | 'b2b' = 'online';
    if (selectedType && !selectedType.hasOnline && selectedType.hasPhysical) {
      defaultVariant = 'physical';
    } else if (selectedType && !selectedType.hasOnline && !selectedType.hasPhysical && selectedType.hasB2b) {
      defaultVariant = 'b2b';
    }

    setFormState({
      ...formState,
      selectedBusinessType: businessTypeId || null,
      selectedVariant: defaultVariant,
    });
    setErrors({});
  };

  const handleVariantChange = (variant: 'online' | 'physical' | 'b2b') => {
    setFormState({
      ...formState,
      selectedVariant: variant,
    });
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const budget = Number(e.target.value);
    setFormState({
      ...formState,
      selectedBudget: budget,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<FormState> = {};

    if (!formState.selectedCategory) {
      newErrors.selectedCategory = 'category' as any;
    }
    if (!formState.selectedSubcategory) {
      newErrors.selectedSubcategory = 'subcategory' as any;
    }
    if (!formState.selectedBusinessType) {
      newErrors.selectedBusinessType = 'businessType' as any;
    }
    if (!validateBudget(formState.selectedBudget)) {
      newErrors.selectedBudget = 'budget' as any;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Track form submission
    trackFormSubmit(formState.selectedBusinessType as string, formState.selectedBudget);

    // Navigate to results page with business type and variant
    const url = `/result?businessId=${formState.selectedBusinessType}&variant=${formState.selectedVariant}&budget=${formState.selectedBudget}`;
    router.push(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Dropdown */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Business Category *
        </label>
        <select
          id="category"
          value={formState.selectedCategory || ''}
          onChange={handleCategoryChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.selectedCategory ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category...</option>
          {businessTaxonomy.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.selectedCategory && (
          <p className="text-red-600 text-sm mt-1">Category is required</p>
        )}
      </div>

      {/* Subcategory Dropdown */}
      <div>
        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
          Subcategory *
        </label>
        <select
          id="subcategory"
          value={formState.selectedSubcategory || ''}
          onChange={handleSubcategoryChange}
          disabled={!formState.selectedCategory}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.selectedSubcategory ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">
            {!formState.selectedCategory
              ? 'Select a category first'
              : 'Select a subcategory...'}
          </option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
        {errors.selectedSubcategory && (
          <p className="text-red-600 text-sm mt-1">Subcategory is required</p>
        )}
      </div>

      {/* Business Type Dropdown */}
      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
          Business Type *
        </label>
        <select
          id="businessType"
          value={formState.selectedBusinessType || ''}
          onChange={handleBusinessTypeChange}
          disabled={!formState.selectedSubcategory}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.selectedBusinessType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">
            {!formState.selectedSubcategory
              ? 'Select a subcategory first'
              : 'Select a business type...'}
          </option>
          {businessTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.selectedBusinessType && (
          <p className="text-red-600 text-sm mt-1">Business type is required</p>
        )}
      </div>

      {/* Variant Selection (Radio Buttons) */}
      {formState.selectedBusinessType && availableVariants.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Business Model *
          </label>
          <div className="space-y-2">
            {availableVariants.map((variant) => (
              <label key={variant} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="variant"
                  value={variant}
                  checked={formState.selectedVariant === variant}
                  onChange={() => handleVariantChange(variant)}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                />
                <span className="ml-3 text-gray-700 capitalize">
                  {variant === 'b2b' ? 'B2B / Wholesale' : `${variant} First`}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Budget Input */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Marketing Budget *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3 text-gray-500">$</span>
          <input
            id="budget"
            type="number"
            min="0"
            max="1000000"
            step="1000"
            value={formState.selectedBudget}
            onChange={handleBudgetChange}
            placeholder="10,000"
            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.selectedBudget ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        <p className="text-gray-500 text-xs mt-1">
          Budget range: $1,000 - $1,000,000
        </p>
        {errors.selectedBudget && (
          <p className="text-red-600 text-sm mt-1">Budget must be between $1,000 and $1,000,000</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!formState.selectedCategory || !formState.selectedSubcategory || !formState.selectedBusinessType}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
          !formState.selectedCategory || !formState.selectedSubcategory || !formState.selectedBusinessType
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-blue-700 active:scale-95'
        }`}
      >
        Get Your Platform Map
      </button>

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center">
        ✓ 100% free • No credit card required • Results in 10 seconds
      </p>
    </form>
  );
}
