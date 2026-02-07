'use server';

import { createClient } from '@/lib/supabase/server';

const API_BASE_URL = 'https://api.almostcrackd.ai';

export async function generatePresignedUrl(contentType: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return { error: 'Not authenticated' };
  }

  const response = await fetch(`${API_BASE_URL}/pipeline/generate-presigned-url`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contentType }),
  });

  if (!response.ok) {
    const text = await response.text();
    return { error: `Failed to generate presigned URL: ${text}` };
  }

  const data = await response.json();
  return { presignedUrl: data.presignedUrl, cdnUrl: data.cdnUrl };
}

export async function registerImageUrl(cdnUrl: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return { error: 'Not authenticated' };
  }

  const response = await fetch(`${API_BASE_URL}/pipeline/upload-image-from-url`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
  });

  if (!response.ok) {
    const text = await response.text();
    return { error: `Failed to register image: ${text}` };
  }

  const data = await response.json();
  return { imageId: data.imageId };
}

export async function generateCaptions(imageId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return { error: 'Not authenticated' };
  }

  const response = await fetch(`${API_BASE_URL}/pipeline/generate-captions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageId }),
  });

  if (!response.ok) {
    const text = await response.text();
    return { error: `Failed to generate captions: ${text}` };
  }

  const data = await response.json();
  return { captions: data };
}
