import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function relativeDate(from: Date) {
  return formatDistanceToNowStrict(from, { addSuffix: true });
}

export function convertToE164(phoneNumber: string, countryCode: string = "+40"): string {
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  if (cleanNumber.startsWith("0")) {
    return countryCode + cleanNumber.substring(1);
  } else if (!cleanNumber.startsWith(countryCode)) {
    return countryCode + cleanNumber;
  }

  return "+" + cleanNumber;
}
