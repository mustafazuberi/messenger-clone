import * as z from "zod";

const MessageSchema = z.object({
  message: z.any({
    required_error: "Please enter a message to send.",
  }),
});

export default MessageSchema;
