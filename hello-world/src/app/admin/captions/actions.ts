'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteCaption(captionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Verify admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_superadmin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_superadmin) {
    return { error: 'Not authorized' };
  }

  const { error } = await supabase
    .from('captions')
    .delete()
    .eq('id', captionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/captions');
  return { success: true };
}

export async function toggleCaptionPublic(captionId: string, isPublic: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Verify admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_superadmin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_superadmin) {
    return { error: 'Not authorized' };
  }

  const { error } = await supabase
    .from('captions')
    .update({ is_public: isPublic })
    .eq('id', captionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/captions');
  return { success: true };
}
