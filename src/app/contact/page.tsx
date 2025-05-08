'use client';

import { Button, Card, CardBody, Input, Textarea, addToast } from '@/components/heroui';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/navigation';
import { sendContactEmail } from './actions';

export default function ContactUsPage() {
  const router = useRouter();
  const { loading, runAsync } = useRequest(sendContactEmail, {
    manual: true,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = Object.fromEntries(formData);

    const { success, error } = await runAsync(form);
    if (!success) {
      addToast({
        title: 'Error',
        description: error ?? 'Unknown error',
        color: 'danger',
      });
      return;
    }
    addToast({
      title: 'Success',
      description: 'Your message has been sent!',
      color: 'success',
    });
  };

  return (
    <main className='container flex min-h-screen w-full items-center justify-center'>
      <Card className='mx-auto w-full max-w-lg'>
        <CardBody>
          <h1 className='mb-6 text-center font-bold text-3xl'>Contact Us</h1>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <Input label='Name' name='name' isRequired />
            <Input label='Email' name='email' type='email' isRequired />
            <Textarea label='Message' name='message' isRequired minRows={4} />
            <div className='flex gap-2'>
              <Button
                type='button'
                variant='flat'
                color='default'
                onPress={() => router.back()}
                fullWidth
              >
                Back
              </Button>
              <Button
                type='submit'
                color='primary'
                fullWidth
                isDisabled={loading}
                isLoading={loading}
              >
                Send Message
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
