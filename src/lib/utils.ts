import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
}

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

export function formatCountDownTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}
