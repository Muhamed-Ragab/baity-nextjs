'use server';

import { db } from '@/db';
import { feedback } from '@/db/schemas/feedback';
import type { NewFeedback } from '@/types/feedback';
import { eq } from 'drizzle-orm';

export const createFeedback = async (newFeedback: NewFeedback) => {
  const { id, ...feedbackData } = newFeedback;
  const result = await db.insert(feedback).values(feedbackData);

  return result;
};

export const getFeedbacks = async () => {
  const result = await db.query.feedback.findMany();

  return result;
};

export const getFeedbackById = async (id: string) => {
  const result = await db.query.feedback.findFirst({
    where: eq(feedback.id, id),
  });

  return result;
};

export const updateFeedback = async (id: string, data: Partial<NewFeedback>) => {
  const result = await db.update(feedback).set(data).where(eq(feedback.id, id));

  return result;
};

export const deleteFeedback = async (id: string) => {
  const result = await db.delete(feedback).where(eq(feedback.id, id));

  return result;
};
