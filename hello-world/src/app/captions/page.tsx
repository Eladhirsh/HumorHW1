import { createClient } from '@/lib/supabase/server';
import VoteButtons from './VoteButtons';
import ThemeToggle from '../ThemeToggle';

type Caption = {
  id: string;
  content: string;
  created_datetime_utc: string;
  like_count: number;
};

export default async function CaptionsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Get the user's profile_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user?.id)
    .single();

  // Get caption IDs the user has already voted on
  let votedCaptionIds: string[] = [];
  if (profile) {
    const { data: votes } = await supabase
      .from('caption_votes')
      .select('caption_id')
      .eq('profile_id', profile.id);

    votedCaptionIds = votes?.map(v => v.caption_id) || [];
  }

  // Fetch captions, excluding ones the user has voted on
  let query = supabase
    .from('captions')
    .select('id, content, created_datetime_utc, like_count')
    .eq('is_public', true)
    .order('created_datetime_utc', { ascending: false })
    .limit(20);

  if (votedCaptionIds.length > 0) {
    query = query.not('id', 'in', `(${votedCaptionIds.join(',')})`);
  }

  const { data: captions, error } = await query;

  return (
    <main>
      {/* Navbar */}
      <nav className="app-navbar">
        <div className="container">
          <a href="/" className="nav-brand">
            <i className="bi bi-emoji-laughing"></i>
            Humor Hub
          </a>
          <div className="nav-actions">
            <a href="/" className="nav-btn">
              <i className="bi bi-house"></i>
              <span>Home</span>
            </a>
            <a href="/upload" className="nav-btn">
              <i className="bi bi-cloud-upload"></i>
              <span>Upload</span>
            </a>
            <ThemeToggle />
            <div className="nav-user">
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                />
              )}
              <span className="nav-user-name">{user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <form action="/auth/signout" method="post">
              <button type="submit" className="nav-btn">
                <i className="bi bi-box-arrow-right"></i>
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-icon">
          <i className="bi bi-chat-square-quote"></i>
        </div>
        <h1 className="hero-title">Rate Captions</h1>
        <p className="hero-subtitle">
          Vote on your favorite captions
        </p>
      </section>

      {/* Content */}
      <div className="content-container">
        {error && (
          <div className="alert-error" style={{ marginBottom: '1.5rem' }}>
            <i className="bi bi-exclamation-triangle"></i>
            {error.message}
          </div>
        )}

        {/* Captions Grid */}
        <div className="grid grid-2">
          {captions?.map((caption: Caption, index: number) => (
            <div
              key={caption.id}
              className={`slide-up delay-${Math.min(index + 1, 5)}`}
              style={{ opacity: 0 }}
            >
              <div className="theme-card" style={{ height: '100%' }}>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ flex: 1 }}>
                    <p className="caption-text" style={{ marginBottom: '0.75rem' }}>
                      &ldquo;{caption.content}&rdquo;
                    </p>
                    <div className="caption-meta" style={{ marginBottom: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <i className="bi bi-heart-fill" style={{ color: 'var(--danger)', fontSize: '0.7rem' }}></i>
                        {caption.like_count} likes
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <i className="bi bi-calendar3"></i>
                        {new Date(caption.created_datetime_utc).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <VoteButtons captionId={caption.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!captions || captions.length === 0) && !error && (
          <div className="fade-in" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="empty-state">
              <div className="empty-icon">
                <i className={`bi ${votedCaptionIds.length > 0 ? 'bi-check-circle' : 'bi-chat-square'}`}></i>
              </div>
              <h3 className="empty-title">
                {votedCaptionIds.length > 0 ? 'All Done!' : 'No Captions Yet'}
              </h3>
              <p className="empty-text">
                {votedCaptionIds.length > 0
                  ? "You've voted on all available captions. Check back later for more!"
                  : 'Public captions will appear here once they are added.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          Made with humor in mind
        </p>
      </footer>
    </main>
  );
}
