import { API_BASE } from './api.config';

export async function uploadImage(file: File, authHash?: string): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (authHash) {
    headers['Authorization'] = `Bearer ${authHash}`;
  }

  const res = await fetch(`${API_BASE}/posts/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    let errorMsg = res.statusText;
    try {
      const errData = await res.json();
      if (errData && errData.message) {
        errorMsg = errData.message;
      }
    } catch (_) {}
    throw new Error(`Failed to upload image: ${errorMsg}`);
  }
  return res.json();
}
