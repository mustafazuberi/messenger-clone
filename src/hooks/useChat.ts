import MessageSchema from "@/schema/schema.message";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

const useChat = () => {
  const formMessage: UseFormReturn<z.infer<typeof MessageSchema>> = useForm<
    z.infer<typeof MessageSchema>
  >({
    resolver: zodResolver(MessageSchema),
  });

  const createChatRoom = () => {};

  const sendMessage = () => {};

  return { formMessage, createChatRoom, sendMessage };
};

export default useChat;
