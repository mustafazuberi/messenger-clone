import * as z from "zod";

const DOBSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

export default DOBSchema;
