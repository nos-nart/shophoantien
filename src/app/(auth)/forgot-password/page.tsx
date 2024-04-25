"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRef, useTransition } from "react";
import { _signIn } from "@/app/actions/sign-in";
import { toast } from "sonner";
import { useEmailStore } from "@/stores/emailStore";

export const resetPasswordRequestSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});

const Page = () => {
  const [isPending, startTransition] = useTransition();
  const { setEmail } = useEmailStore();
  const form = useForm<z.infer<typeof resetPasswordRequestSchema>>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordRequestSchema>) {
    setEmail(values.email);
    console.log(values);
  }

  return (
    <div
      className="grid lg:grid-cols-2 gap-12"
      style={{ width: "min(70ch, 100vw - 2rem)" }}
    >
      <div className="lg:grid hidden place-content-center">
        <Image src="/thinking.png" alt="thinking" width={200} height={200} />
      </div>
      <div>
        <div className="py-6">
          <h2 className="text-2xl font-bold">Lấy lại mật khẩu</h2>
          <p className="my-2 text-gray-600">
            Nhập email của bạn để lấy lại mật khẩu
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Lấy lại mật khẩu
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
