'use client';

import { Button, Form, Input, addToast } from '@/components/heroui';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { registerAction } from '../action';

export const RegisterForm = () => {
  const { handleSubmit, control, formState } = useForm();
  const [error, setError] = useState<Record<string, string[]> | null>(null);

  const onSubmit = async (data: object) => {
    setError(null);
    const result = await registerAction(data);

    if (!result.success) {
      setError(result.errors);
      return;
    }

    addToast({
      title: 'Registration successful',
      color: 'success',
    });

    redirect('/');
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
          {error.form.map((err) => (
            <p key={err} className='text-center text-red-600'>
              {err}
            </p>
          ))}
        </div>
      )}

      <Controller
        control={control}
        name='email'
        render={({ field }) => <Input label='Email' type='email' fullWidth {...field} />}
      />
      <Controller
        control={control}
        name='password'
        render={({ field }) => <PasswordInput fullWidth {...field} />}
      />
      <Controller
        control={control}
        name='name'
        render={({ field }) => <Input label='Name' fullWidth {...field} />}
      />
      <Controller
        control={control}
        name='phone'
        render={({ field }) => <Input label='Phone' fullWidth {...field} />}
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
        Register
      </Button>
    </Form>
  );
};
