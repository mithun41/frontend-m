export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  let cleaned = path;
  if (cleaned.includes("http%3A") || cleaned.includes("https%3A")) {
    try {
      cleaned = decodeURIComponent(cleaned);
    } catch {
      // ignore
    }
  }
  if (cleaned.startsWith('blob:') || cleaned.startsWith('data:')) return cleaned;
  
  const httpIdx = cleaned.indexOf("http");
  if (httpIdx !== -1) {
    return cleaned.substring(httpIdx);
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const baseUrl = apiUrl.replace('/api', '');
  
  return `${baseUrl}${cleaned.startsWith('/') ? cleaned : `/${cleaned}`}`;
};
