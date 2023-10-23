import { Input } from "@/components/ui/input";
import useChat from "@/hooks/useChat";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ChatRoomFooter = () => {
  const { formMessage, sendMessage } = useChat();
  return (
    <main>
      <Form {...formMessage}>
        <form
          onSubmit={formMessage.handleSubmit(sendMessage)}
          className="w-full flex flex-col gap-y-3"
        >
          {/* Full Name Input. */}
          <FormField
            control={formMessage.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Type your message..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </main>
  );
};

export default ChatRoomFooter;
