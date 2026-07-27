// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "";
  let cleaned = imagePath;
  if (cleaned.includes("http%3A") || cleaned.includes("https%3A")) {
    try {
      cleaned = decodeURIComponent(cleaned);
    } catch {
      // ignore
    }
  }
  const httpIdx = cleaned.indexOf("http");
  if (httpIdx !== -1) {
    return cleaned.substring(httpIdx);
  }
  if (cleaned.startsWith("blob:") || cleaned.startsWith("data:")) {
    return cleaned;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const baseUrl = apiUrl.replace(/\/api\/?$/, "");
  return cleaned.startsWith("/") ? `${baseUrl}${cleaned}` : `${baseUrl}/${cleaned}`;
}