import { createClient } from '@/lib/supabase/server';
import VoteButtons from './VoteButtons';

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
      {/* User Header */}
      <nav className="navbar navbar-expand py-3" style={{ background: '#1a1a2e' }}>
        <div className="container">
          <a href="/" className="navbar-brand text-white d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
            <i className="bi bi-emoji-laughing"></i>
            Humor Hub
          </a>
          <div className="d-flex align-items-center gap-3">
            <a href="/" className="btn btn-outline-light btn-sm">
              <i className="bi bi-house me-1"></i>
              Home
            </a>
            <div className="d-flex align-items-center gap-2 text-white">
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  width={32}
                  height={32}
                  style={{ borderRadius: '50%' }}
                />
              )}
              <span className="d-none d-sm-inline">{user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <form action="/auth/signout" method="post">
              <button type="submit" className="btn btn-outline-light btn-sm">
                <i className="bi bi-box-arrow-right me-1"></i>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ paddingTop: '2rem' }}>
        <div className="container text-center">
          <div className="hero-icon">
            <i className="bi bi-chat-square-quote text-white"></i>
          </div>
          <h1 className="hero-title mb-3">Rate Captions</h1>
          <p className="hero-subtitle mb-0">
            Vote on your favorite captions!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-4" style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error.message}
          </div>
        )}

        {/* Captions Grid */}
        <div className="row g-4">
          {captions?.map((caption: Caption, index: number) => (
            <div
              key={caption.id}
              className={`col-12 col-md-6 slide-up delay-${Math.min(index + 1, 5)}`}
              style={{ opacity: 0 }}
            >
              <div className="theme-card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="flex-grow-1">
                    <p className="card-description fs-5 mb-3">
                      &ldquo;{caption.content}&rdquo;
                    </p>
                    <div className="card-meta mb-3">
                      <i className="bi bi-heart-fill text-danger me-1"></i>
                      <span>{caption.like_count} likes</span>
                      <span className="mx-2">|</span>
                      <i className="bi bi-calendar3 me-1"></i>
                      <span>
                        {new Date(caption.created_datetime_utc).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="border-top pt-3">
                    <VoteButtons captionId={caption.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!captions || captions.length === 0) && !error && (
          <div className="row justify-content-center fade-in">
            <div className="col-md-8 col-lg-6">
              <div className="empty-state">
                <div className="empty-icon">
                  <i className={votedCaptionIds.length > 0 ? "bi bi-check-circle" : "bi bi-chat-square"}></i>
                </div>
                <h3 className="empty-title">
                  {votedCaptionIds.length > 0 ? "All Done!" : "No Captions Yet"}
                </h3>
                <p className="empty-text">
                  {votedCaptionIds.length > 0
                    ? "You've voted on all available captions. Check back later for more!"
                    : "Public captions will appear here once they are added."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container text-center">
          <p className="footer-text mb-0">
            <i className="bi bi-heart-fill text-danger me-1"></i>
            Made with humor in mind
          </p>
        </div>
      </footer>
    </main>
  );
}
