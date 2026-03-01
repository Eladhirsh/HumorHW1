import { createClient } from '@/lib/supabase/server';
import ThemeToggle from './ThemeToggle';

type HumorTheme = {
  id: number;
  created_datetime_utc: string;
  name: string;
  description: string | null;
};

const humorIcons: Record<string, string> = {
  'sarcasm': 'bi-emoji-wink',
  'satire': 'bi-newspaper',
  'parody': 'bi-film',
  'irony': 'bi-arrow-repeat',
  'slapstick': 'bi-person-arms-up',
  'wit': 'bi-lightbulb',
  'pun': 'bi-chat-quote',
  'dark': 'bi-moon-stars',
  'absurd': 'bi-question-diamond',
  'observational': 'bi-eye',
  'self-deprecating': 'bi-emoji-smile-upside-down',
  'deadpan': 'bi-emoji-expressionless',
  'default': 'bi-emoji-laughing',
};

const humorImages: Record<string, string> = {
  'sarcasm': 'https://images.unsplash.com/photo-1531747056868-e1b9ad199aab?w=400&h=220&fit=crop',
  'satire': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=220&fit=crop',
  'parody': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=220&fit=crop',
  'irony': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=220&fit=crop',
  'slapstick': 'https://images.unsplash.com/photo-1525286116112-b59af0ae4a95?w=400&h=220&fit=crop',
  'wit': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=220&fit=crop',
  'pun': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=220&fit=crop',
  'dark': 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=220&fit=crop',
  'absurd': 'https://images.unsplash.com/photo-1533279443086-d1c19a186416?w=400&h=220&fit=crop',
  'observational': 'https://images.unsplash.com/photo-1502126324834-38f8e02d7160?w=400&h=220&fit=crop',
  'self-deprecating': 'https://images.unsplash.com/photo-1521543832500-49e69fb2b3ad?w=400&h=220&fit=crop',
  'deadpan': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=220&fit=crop',
  'default': 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&h=220&fit=crop',
};

function getIconForTheme(themeName: string): string {
  const lowerName = themeName.toLowerCase();
  for (const [key, icon] of Object.entries(humorIcons)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  return humorIcons.default;
}

function getImageForTheme(themeName: string): string {
  const lowerName = themeName.toLowerCase();
  for (const [key, image] of Object.entries(humorImages)) {
    if (key !== 'default' && lowerName.includes(key)) {
      return image;
    }
  }
  return humorImages.default;
}

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: themes, error } = await supabase
    .from('humor_themes')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return (
      <main>
        <nav className="app-navbar">
          <div className="container">
            <span className="nav-brand">
              <i className="bi bi-emoji-laughing"></i>
              Humor Hub
            </span>
          </div>
        </nav>

        <section className="hero-section">
          <div className="hero-icon">
            <i className="bi bi-emoji-frown"></i>
          </div>
          <h1 className="hero-title">Oops!</h1>
          <p className="hero-subtitle">Something went wrong loading themes</p>
        </section>

        <div className="content-container">
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="error-container">
              <div className="error-icon">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
              <h2 className="error-title">Error Loading Themes</h2>
              <p className="error-message">
                <i className="bi bi-info-circle" style={{ marginRight: '0.5rem' }}></i>
                {error.message}
              </p>
              <a href="/" className="btn-accent" style={{ display: 'inline-flex', width: 'auto', marginTop: '1.5rem' }}>
                <i className="bi bi-arrow-clockwise"></i>
                Try Again
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
            <a href="/upload" className="nav-btn">
              <i className="bi bi-cloud-upload"></i>
              <span>Upload</span>
            </a>
            <a href="/captions" className="nav-btn">
              <i className="bi bi-chat-square-quote"></i>
              <span>Rate</span>
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
          <i className="bi bi-emoji-laughing"></i>
        </div>
        <h1 className="hero-title">Humor Themes</h1>
        <p className="hero-subtitle">
          Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'friend'}! Explore the many flavors of comedy.
        </p>
      </section>

      {/* Content */}
      <div className="content-container">
        {/* Stats */}
        {themes && themes.length > 0 && (
          <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span className="theme-badge">
              <i className="bi bi-collection"></i>
              {themes.length} {themes.length === 1 ? 'Theme' : 'Themes'}
            </span>
            <span className="theme-badge">
              <i className="bi bi-stars"></i>
              Curated Collection
            </span>
          </div>
        )}

        {/* Theme Grid */}
        <div className="grid grid-3">
          {themes?.map((theme: HumorTheme, index: number) => (
            <div
              key={theme.id}
              className={`slide-up delay-${Math.min(index + 1, 5)}`}
              style={{ opacity: 0 }}
            >
              <a href="/captions" className="theme-card-link">
                <div className="theme-card" style={{ height: '100%' }}>
                  <div className="card-image">
                    <img
                      src={getImageForTheme(theme.name)}
                      alt={theme.name}
                      loading="lazy"
                    />
                    <div className="card-image-overlay">
                      <div className="card-icon">
                        <i className={`bi ${getIconForTheme(theme.name)}`}></i>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h2 className="card-title">{theme.name}</h2>
                    {theme.description && (
                      <p className="card-description">{theme.description}</p>
                    )}
                    <div className="card-meta">
                      <i className="bi bi-calendar3"></i>
                      <span>
                        {new Date(theme.created_datetime_utc).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!themes || themes.length === 0) && (
          <div className="fade-in" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="empty-state">
              <div className="empty-icon">
                <i className="bi bi-inbox"></i>
              </div>
              <h3 className="empty-title">No Themes Yet</h3>
              <p className="empty-text">
                Humor themes will appear here once they are added to the collection.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rating Cloud Bubble */}
      <div className="rating-cloud">
        <a href="/captions">
          <i className="bi bi-star-fill"></i>
          Come rate me!
        </a>
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
