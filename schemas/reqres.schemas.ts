import { z } from 'zod';

export const reqresUserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  avatar: z.string().url(),
});

export const usersPageSchema = z
  .object({
    page: z.number().int().positive(),
    per_page: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    total_pages: z.number().int().positive(),
    data: z.array(reqresUserSchema),
    support: z
      .object({
        url: z.string().url(),
        text: z.string().min(1),
      })
      .optional(),
  })
  .superRefine((page, context) => {
    if (page.page > page.total_pages) {
      context.addIssue({
        code: 'custom',
        message: 'Current page cannot exceed total_pages',
        path: ['page'],
      });
    }

    if (page.data.length > page.per_page) {
      context.addIssue({
        code: 'custom',
        message: 'Returned users cannot exceed per_page',
        path: ['data'],
      });
    }
  });

export const createUserPayloadSchema = z.object({
  name: z.string().min(1),
  job: z.string().min(1),
});

export const createUserResponseSchema = createUserPayloadSchema.extend({
  id: z.string().min(1),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'createdAt must be a valid timestamp',
  }),
});

export type UsersPage = z.infer<typeof usersPageSchema>;
export type CreateUserPayload = z.infer<typeof createUserPayloadSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
