import { z } from "zod";

export const loginSchema = z.object({
  emailOrPhone: z.string().email("Enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(10, "Enter a valid phone number"),

    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "Must include uppercase letter")
      .regex(/[a-z]/, "Must include lowercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must include special character"),  
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),  
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept Terms & Conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;