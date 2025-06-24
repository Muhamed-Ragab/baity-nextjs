'use client';

import { Button, Form, Input } from '@/components/heroui';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { useTranslations } from '@/lib/translates';
import { Controller } from 'react-hook-form';
import { registerAction } from '../action';
import { RegisterSchema } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { mapHeroUIFormErrors } from '@/lib/utils';

export const RegisterForm = () => {
  const t = useTranslations('auth');
  const { action, form, handleSubmitWithAction } = useHookFormAction(
    registerAction,
    zodResolver(RegisterSchema)
  );

  return (
    <Form
      onSubmit={handleSubmitWithAction}
      validationBehavior="aria"
      className="space-y-8"
      validationErrors={mapHeroUIFormErrors(form.formState.errors) ?? {}}
    >
      {form.formState.errors.root && (
        <div className="mx-auto mt-4">
          <p className="text-center text-red-600">
            {form.formState.errors.root.message}
          </p>
        </div>
      )}

      <Controller
        control={form.control}
        name="email"
        render={({ field }) => (
          <Input label={t('shared.email')} type="email" fullWidth {...field} />
        )}
      />
      <Controller
        control={form.control}
        name="password"
        render={({ field }) => (
          <PasswordInput label={t('shared.password')} fullWidth {...field} />
        )}
      />
      <Controller
        control={form.control}
        name="name"
        render={({ field }) => (
          <Input label={t('shared.name')} fullWidth {...field} />
        )}
      />
      <Controller
        control={form.control}
        name="phone"
        render={({ field }) => (
          <Input label={t('shared.phone')} fullWidth {...field} />
        )}
      />

      <Button
        color="primary"
        className="w-full font-semibold text-medium"
        variant="solid"
        size="lg"
        type="submit"
        isLoading={action.isPending}
        isDisabled={action.isPending}
      >
        {t('register.button')}
      </Button>
    </Form>
  );
};
