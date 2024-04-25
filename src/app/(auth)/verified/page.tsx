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
import { cn, formatCountDownTime } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountDown";
import { useEmailStore } from "@/stores/emailStore";
import { sendVerification } from "@/app/actions/send-verification";
import { toast } from "sonner";
import { verifyOTP } from "@/app/actions/verify-otp";
import { redirect } from "next/navigation";

const verifiedFormSchema = z.object({
  otp: z.string().min(6, {
    message: "OTP của bạn phải có 6 ký tự.",
  }),
});

const Page = () => {
  const { current, reset } = useCountdown(0, 5 * 60);
  const { email } = useEmailStore();
  const form = useForm<z.infer<typeof verifiedFormSchema>>({
    resolver: zodResolver(verifiedFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof verifiedFormSchema>) {
    if (!email) {
      // NOTE: should not/don't expect it will run to this block
      toast.error("Không tìm thấy địa chỉ email");
      return;
    }
    try {
      const result = await verifyOTP(values.otp, email);
      if (result.success) {
        toast.success("Thành công", { description: result.message });
        redirect("/sign-in");
      } else {
        toast.warning("Thất bại", { description: result.message });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error(error);
    }
  }

  async function onResendOtp() {
    // reset timer
    reset();
    if (!email) {
      toast.error("Không tìm thấy địa chỉ email");
      return;
    }
    try {
      const result = await sendVerification(email);
      toast.success("Thành công", { description: result.message });
    } catch (error) {
      toast.error("Thất bại");
    }
  }

  return (
    <div
      className="grid lg:grid-cols-2 gap-12"
      style={{ width: "min(70ch, 100vw - 2rem)" }}
    >
      <div className="lg:grid hidden place-content-center">
        <Image src="/mail-sent.png" alt="mail-sent" width={200} height={200} />
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
              name="otp"
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
            <div className="flex mt-0">
              <Button
                variant={"link"}
                type="button"
                className={cn(
                  "px-0 text-blue-500",
                  current !== "0" ? "cursor-not-allowed" : ""
                )}
                onClick={onResendOtp}
              >
                Gửi lại OTP{" "}
                {current !== "0" && formatCountDownTime(Number(current))}
              </Button>
            </div>
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
