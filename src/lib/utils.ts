import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
}

export const lcKey = "SHOP_HOAN_TIEN_SIGN_UP_EMAIL";

export function generateOTP(): string {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let otp = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    const randomDigit = digits[randomIndex];
    otp += randomDigit.toString();
  }

  return otp;
}
