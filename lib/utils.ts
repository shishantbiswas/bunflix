import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createImageUrl(filename: string, size: 'w500' | "original") {
  return `https://image.tmdb.org/t/p/${size}/${filename}`
}