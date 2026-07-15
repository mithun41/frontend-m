export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const baseUrl = apiUrl.replace('/api', '');
  
  // ensure there is only one slash between baseUrl and path
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};
