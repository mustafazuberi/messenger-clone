"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription className="flex flex-row gap-x-2 items-center justify-start">
                  <Image
                    src={
                      "https://scontent.fkhi17-1.fna.fbcdn.net/v/t39.8562-6/120009688_325579128711709_1736249742330805861_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=9LEzKei6YxkAX9z9op0&_nc_ht=scontent.fkhi17-1.fna&oh=00_AfCzp3zOJcQwXI3-OPY5LNEz6oHoA01gNMoZ5C3BreY6cA&oe=6539923D"
                    }
                    width={30}
                    height={30}
                    alt="messengerLogo"
                  />
                  <p>{description}</p>
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
