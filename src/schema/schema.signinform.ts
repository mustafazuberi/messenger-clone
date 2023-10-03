import * as z from "zod";

const formSchema = z.object({
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
});

export default formSchema;
