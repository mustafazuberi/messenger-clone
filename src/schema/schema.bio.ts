import * as z from "zod";

const AddBioSchema = z.object({
  bio: z.string().refine((data) => data.trim() !== "", {
    message: "Please enter bio to add.",
  }),
});

export default AddBioSchema;
