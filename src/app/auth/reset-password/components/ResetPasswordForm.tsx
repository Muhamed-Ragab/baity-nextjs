'use client';

import { Button, Form, addToast } from '@/components/heroui';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { PasswordInput } from '@/components/shared/PasswordInput';

import { resetPasswordAction } from '../action';

export const ResetPasswordForm = () => {
  const { handleSubmit, control, formState } = useForm();
  const [error, setError] = useState<Record<string, string[]> | null>();

  const onSubmit = async (data: object) => {
    const searchParams = new URLSearchParams(location.search);

    const { error } = await resetPasswordAction({
      ...data,
      token: searchParams.get('token'),
    });

    if (error) {
      setError(error);
      return;
    }

    addToast({
      title: 'Password reset successfully',
      description: 'Check your email',
      color: 'success',
    });

    redirect('/auth/login');
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      validationErrors={error ?? {}}
      validationBehavior='aria'
      className='space-y-8'
    >
      {error?.form && (
        <div className='mx-auto mt-4'>
          {error.form.map((error) => (
            <p key={error} className='text-center text-red-600'>
              {error}
            </p>
          ))}
        </div>
      )}
      {error?.token && (
        <div className='mx-auto mt-4'>
          {error.token.map((error) => (
            <p key={error} className='text-center text-red-600'>
              {error}
            </p>
          ))}
        </div>
      )}

      <Controller
        control={control}
        name='password'
        render={({ field }) => <PasswordInput label='Password' fullWidth {...field} />}
      />
      <Controller
        control={control}
        name='confirmPassword'
        render={({ field }) => <PasswordInput label='Confirm Password' fullWidth {...field} />}
      />

      <Button
        color='primary'
        className='w-full font-semibold text-medium'
        variant='solid'
        size='lg'
        type='submit'
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
      >
        Reset
      </Button>
    </Form>
  );
};
