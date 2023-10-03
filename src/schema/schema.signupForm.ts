import * as z from "zod";

const formSchema = z.object({
  fullName: z
    .string()
    .min(6, {
      message: "Full Name must be at least 6 characters.",
    })
    .max(30, {
      message: "Full name must not exceed 30 characters.",
    }),

  email: z.string().email({
    message: "Invalid email address.",
  }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Password must contain at least one lowercase letter.",
    })
    .refine((value) => /[0-9]/.test(value), {
      message: "Password must contain at least one digit.",
    }),

  gender: z.string().refine((value) => !!value, {
    message: "Gender is required.",
  }),
});

export default formSchema;
