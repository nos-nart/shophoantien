"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReadLocalStorage } from "@/hooks/useReadLocalStorage";
import { lcKey } from "@/lib/utils";
import { redirect } from "next/navigation";

const verifiedFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const Page = () => {
  const email = useReadLocalStorage(lcKey);

  const form = useForm<z.infer<typeof verifiedFormSchema>>({
    resolver: zodResolver(verifiedFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(values: z.infer<typeof verifiedFormSchema>) {
    console.log(values);
  }

  return (
    <div
      className="grid lg:grid-cols-2 gap-12"
      style={{ width: "min(60ch, 100vw - 2rem)" }}
    >
      <div className="lg:grid hidden place-content-center">
        <Image src="/mail-sent.png" alt="test" width={200} height={200} />
      </div>
      <div>
        <div className="py-6">
          <h2 className="text-2xl font-bold">Xác thực email</h2>
          <p className="my-2 text-gray-600">
            {`Mã xác thực đã được gửi tới địa chỉ ${email ?? "email của bạn"}`}
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Xác thực</Button>
          </form>
        </Form>
        <p className="text-xs py-6">
          Lưu ý: Nếu không nhận được mã xác thực, Bạn thử kiểm tra mục{" "}
          <b>Thư rác</b> hoặc <b>Spam</b> nha
        </p>
        <div>
          Bạn đã có tài khoản?{" "}
          <Link className="text-blue-500 hover:underline" href="/sign-in">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
