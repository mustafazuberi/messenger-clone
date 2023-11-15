import * as z from "zod";

const GenderSchema = z.object({
  gender: z.string().refine((value) => !!value, {
    message: "Gender is required.",
  }),
});

export default GenderSchema;
