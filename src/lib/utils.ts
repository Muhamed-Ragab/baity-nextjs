import { type ClassValue, clsx } from 'clsx';
import type { FieldError, FieldErrors } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapHeroUIFormErrors<T>(
  errors: T extends FieldErrors ? T : FieldErrors<Record<string, FieldError>>
) {
  return Object.entries(errors).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      acc[key] = value.message;
      return acc;
    },
    {}
  );
}
