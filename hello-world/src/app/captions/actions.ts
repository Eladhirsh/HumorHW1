'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function voteOnCaption(captionId: string, voteValue: number) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to vote' };
  }

  // Get the user's profile_id from the profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { error: 'Profile not found. Please try logging out and back in.' };
  }

  // Insert the vote
  const { error } = await supabase
    .from('caption_votes')
    .insert({
      caption_id: captionId,
      profile_id: profile.id,
      vote_value: voteValue,
      created_datetime_utc: new Date().toISOString(),
    });

  if (error) {
    // Check if it's a duplicate vote error
    if (error.code === '23505') {
      return { error: 'You have already voted on this caption' };
    }
    return { error: error.message };
  }

  revalidatePath('/captions');
  return { success: true };
}
