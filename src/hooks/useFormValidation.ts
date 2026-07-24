/**
 * Custom Hook: useFormValidation
 * Manages form state, validation, and error handling
 * Reduces boilerplate in form components
 */

import { useState, useCallback, useReducer } from 'react';

export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface UseFormValidationReturn<T> {
  // State
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
  
  // Methods
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
  setSubmitting: (value: boolean) => void;
  getFieldProps: (fieldName: keyof T) => {
    value: unknown;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  };
  getFieldError: (field: keyof T) => string | undefined;
  isFieldTouched: (field: keyof T) => boolean;
  hasErrors: () => boolean;
}

type FormAction<T> =
  | { type: 'SET_FIELD'; field: keyof T; value: unknown }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'SET_TOUCHED'; field: string; touched: boolean }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'RESET' }
  | { type: 'SET_DIRTY'; value: boolean };

function formReducer<T extends Record<string, unknown>>(
  state: FormState<T>,
  action: FormAction<T>
): FormState<T> {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        isDirty: true,
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };

    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: action.touched },
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.value,
      };

    case 'RESET':
      return {
        values: state.values,
        errors: {},
        touched: {},
        isSubmitting: false,
        isDirty: false,
      };

    case 'SET_DIRTY':
      return {
        ...state,
        isDirty: action.value,
      };

    default:
      return state;
  }
}

/**
 * useFormValidation Hook
 * Provides complete form state management and validation
 *
 * @param initialValues - Initial form values
 * @param onSubmit - Callback when form is submitted
 * @returns Form state and methods
 *
 * @example
 * const { values, errors, setFieldValue, getFieldProps } = useFormValidation(
 *   { email: '', password: '' },
 *   (values) => console.log('Submit:', values)
 * );
 */
export function useFormValidation<T extends Record<string, unknown>>(
  initialValues: T,
  onSubmit?: (values: T) => Promise<void> | void
): UseFormValidationReturn<T> {
  const [state, dispatch] = useReducer(formReducer<T>, {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isDirty: false,
  });

  // Set field value
  const setFieldValue = useCallback((field: keyof T, value: unknown) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  // Set field error
  const setFieldError = useCallback((field: string, error: string) => {
    dispatch({ type: 'SET_ERROR', field, error });
  }, []);

  // Set all errors at once
  const setErrors = useCallback((errors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', errors });
  }, []);

  // Mark field as touched
  const setFieldTouched = useCallback((field: string, touched: boolean) => {
    dispatch({ type: 'SET_TOUCHED', field, touched });
  }, []);

  // Set submitting state
  const setSubmitting = useCallback((value: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', value });
  }, []);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Get field props for input binding
  const getFieldProps = useCallback(
    (fieldName: keyof T) => ({
      value: state.values[fieldName] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFieldValue(fieldName, e.target.value);
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFieldTouched(e.target.name || String(fieldName), true);
      },
    }),
    [state.values, setFieldValue, setFieldTouched]
  );

  // Get error for field (only if touched)
  const getFieldError = useCallback(
    (field: keyof T) => {
      if (state.touched[String(field)]) {
        return state.errors[String(field)];
      }
      return undefined;
    },
    [state.errors, state.touched]
  );

  // Check if field has been touched
  const isFieldTouched = useCallback(
    (field: keyof T) => {
      return state.touched[String(field)] ?? false;
    },
    [state.touched]
  );

  // Check if form has any errors
  const hasErrors = useCallback(() => {
    return Object.keys(state.errors).length > 0;
  }, [state.errors]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setErrors,
    resetForm,
    setSubmitting,
    getFieldProps,
    getFieldError,
    isFieldTouched,
    hasErrors,
  };
}
