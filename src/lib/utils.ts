// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("http") || imagePath.startsWith("blob:") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const baseUrl = apiUrl.replace(/\/api\/?$/, "");
  return imagePath.startsWith("/") ? `${baseUrl}${imagePath}` : `${baseUrl}/${imagePath}`;
}