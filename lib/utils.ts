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

export function formatPhoneNumber(value: string) {
  const numbers = value.replace(/\D/g, ""); // Remove all non-numeric characters
  // Ensure we have up to 10 characters to work with
  const match = numbers.match(/^(\d{0,4})(\d{0,3})(\d{0,3})$/);
  if (match) {
    const part1 = match[1];
    const part2 = match[2];
    const part3 = match[3];
    // Combine the parts with spaces as needed
    return `${part1}${part2 ? " " + part2 : ""}${part3 ? " " + part3 : ""}`;
  }
  return value;
}
