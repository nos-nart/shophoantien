"use client";

import { z } from "zod";
import Link from "next/link";
import { redirect } from "next/navigation";
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
import { toast } from "sonner";
import { signUp } from "@/app/actions/sign-up";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { lcKey } from "@/lib/utils";
import { sendVerification } from "@/app/actions/send-verification";
import { PasswordInput } from "@/components/ui/password-input";

export const signUpFormSchema = z
  .object({
    email: z.string().trim().email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .refine(
        (val) =>
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
            val
          ),
        {
          message:
            "Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất một ký tự viết hoa, một ký tự viết thường và một ký hiệu đặc biệt",
        }
      ),
    confirmPassword: z.string(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Mật khẩu không giống nhau",
      });
    }
  });

export type SignUpType = z.infer<typeof signUpFormSchema>;

const Page = () => {
  const [_, setLocalStorage] = useLocalStorage(lcKey, "");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const isVerifiedRef = useRef<boolean | undefined>(undefined);
  const emailRef = useRef("");

  function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    isVerifiedRef.current = undefined;
    startTransition(async () => {
      try {
        const { message, success, isVerified } = await signUp(values);
        if (success) {
          toast.success("Thành công", {
            description: message,
          });
          setLocalStorage(values.email);
          redirect("/verified");
        } else {
          if (isVerifiedRef !== void 0) {
            if (isVerified === false) {
              toast.warning('Bấm vào nút "Gửi lại OTP" để xác thực tài khoản.');
              emailRef.current = values.email;
            }
            if (isVerified) {
              toast.info(
                `Tài khoản với email: ${values.email} đã được xác thực. Vui lòng đăng nhập`
              );
            }
            isVerifiedRef.current = isVerified;
            return;
          }
          toast.error("Thất bại", {
            description: message,
          });
        }
      } catch (error) {
        console.log("An error occurs");
      }
    });
  }

  async function onResendOtp() {
    await sendVerification(emailRef.current);
    redirect("/verified");
  }

  return (
    <div
      className="grid lg:grid-cols-2 gap-12"
      style={{ width: "min(70ch, 100vw - 2rem)" }}
    >
      <div className="lg:grid hidden place-content-center">
        <Image src="/monetize.png" alt="monetize" width={200} height={200} />
      </div>
      <div>
        <div className="py-6">
          <h2 className="text-2xl font-bold">Tạo tài khoản</h2>
          <p className="my-2 text-gray-600">Mua hàng hoàn tiền lên đến 80%</p>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      disabled={isPending}
                      placeholder="Mật khẩu của bạn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      id="confirm-password"
                      disabled={isPending}
                      placeholder="Nhập lại mật khẩu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Tạo tài khoản
            </Button>
            {isVerifiedRef.current === false && (
              <div className="flex mt-0">
                <Button
                  variant={"link"}
                  onClick={onResendOtp}
                  className="mt-0 px-0"
                >
                  Gửi lại OTP
                </Button>
              </div>
            )}
          </form>
        </Form>
        <p className="text-xs py-6">
          Chúng tôi coi trọng quyền riêng tư của bạn và sẽ không bao giờ gửi
          thông tin không liên quan.
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
