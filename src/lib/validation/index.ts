import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Too short" }),
  username: z.string().min(2, { message: "Too short" }),
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const SigninValidation = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Too short" })
    .max(2200, { message: "Too long" }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(2, { message: "Too short" })
    .max(100, { message: "Too long" }),
  tags: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z
    .string()
    .min(5, { message: "Too short" })
    .max(2200, { message: "Too long" }),
  username: z
    .string()
    .min(5, { message: "Too short" })
    .max(2200, { message: "Too long" }),
  email: z.email({ message: "Invalid email" }),
  bio: z
    .string()
    .min(5, { message: "Too short" })
    .max(2200, { message: "Too long" }),
});
