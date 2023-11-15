import * as z from "zod";

const FullNameSchema = z.object({
  fullName: z
    .string()
    .min(6, {
      message: "Full Name must be at least 6 characters.",
    })
    .max(30, {
      message: "Full name must not exceed 16 characters.",
    }),
});

export default FullNameSchema;
