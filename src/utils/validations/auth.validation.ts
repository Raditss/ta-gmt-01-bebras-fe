import { UserRole } from '@/types/user-role';
import { UserStatus } from '@/types/user-status.type';
import { z } from 'zod';

export const loginRequestSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username must contain only letters, numbers, and underscores'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
    )
});

export const registerRequestSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username must contain only letters, numbers, and underscores'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
    ),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(Object.values(UserRole) as [string, ...string[]])
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    props: z.object({
      id: z.number(),
      username: z.string(),
      name: z.string(),
      role: z.nativeEnum(UserRole),
      status: z.nativeEnum(UserStatus),
      verifiedAt: z.string().nullable()
    })
  })
});

export const registerResponseSchema = z.object({
  user: z.object({
    props: z.object({
      id: z.number(),
      username: z.string(),
      name: z.string(),
      role: z.nativeEnum(UserRole),
      status: z.nativeEnum(UserStatus),
      verifiedAt: z.date().nullable()
    })
  })
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
