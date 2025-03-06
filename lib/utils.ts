export function createImageUrl(filename: string, size: 'w500' | 'w700' | "original") {
  return `https://image.tmdb.org/t/p/${size}/${filename}`
}