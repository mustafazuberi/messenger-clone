import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-600">
      <Card className="w-[420px]">
        <CardHeader className="text-center">
          <CardTitle className="lg:text-7xl text-4xl text-gray-700 dark:text-gray-300">
            404
          </CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300">
            The page you’re looking for doesn’t exist.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/messages">Go To Chat</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
