import { supabase } from '@/lib/supabase';

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

function getIconForTheme(themeName: string): string {
  const lowerName = themeName.toLowerCase();
  for (const [key, icon] of Object.entries(humorIcons)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  return humorIcons.default;
}

function getCardColor(index: number): string {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ];
  return colors[index % colors.length];
}

export default async function Home() {
  const { data: themes, error } = await supabase
    .from('humor_themes')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return (
      <main>
        <section className="hero-section">
          <div className="container text-center">
            <div className="hero-icon">
              <i className="bi bi-emoji-frown text-white"></i>
            </div>
            <h1 className="hero-title">Oops!</h1>
            <p className="hero-subtitle">Something went wrong</p>
          </div>
        </section>

        <div className="container" style={{ marginTop: '2rem' }}>
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="error-container">
                <div className="error-icon">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
                <h2 className="error-title">Error Loading Themes</h2>
                <p className="error-message">
                  <i className="bi bi-info-circle me-2"></i>
                  {error.message}
                </p>
                <a
                  href="/"
                  className="btn btn-primary mt-4"
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Try Again
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container text-center">
          <div className="hero-icon">
            <i className="bi bi-emoji-laughing text-white"></i>
          </div>
          <h1 className="hero-title mb-3">Humor Themes</h1>
          <p className="hero-subtitle mb-0">
            Discover the many flavors of comedy and laughter
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Stats Bar */}
        {themes && themes.length > 0 && (
          <div className="row mb-4 fade-in">
            <div className="col-12">
              <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                <span className="theme-badge">
                  <i className="bi bi-collection me-1"></i>
                  {themes.length} {themes.length === 1 ? 'Theme' : 'Themes'}
                </span>
                <span className="theme-badge">
                  <i className="bi bi-stars me-1"></i>
                  Curated Collection
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Theme Cards Grid */}
        <div className="row g-4">
          {themes?.map((theme: HumorTheme, index: number) => (
            <div
              key={theme.id}
              className={`col-12 col-md-6 col-lg-4 slide-up delay-${Math.min(index + 1, 5)}`}
              style={{ opacity: 0 }}
            >
              <div className="theme-card h-100">
                <div className="card-body">
                  <div
                    className="card-icon"
                    style={{ background: getCardColor(index) }}
                  >
                    <i className={`bi ${getIconForTheme(theme.name)} text-white`}></i>
                  </div>
                  <h2 className="card-title">{theme.name}</h2>
                  {theme.description && (
                    <p className="card-description">{theme.description}</p>
                  )}
                  <div className="card-meta">
                    <i className="bi bi-calendar3"></i>
                    <span>
                      Added {new Date(theme.created_datetime_utc).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!themes || themes.length === 0) && (
          <div className="row justify-content-center fade-in">
            <div className="col-md-8 col-lg-6">
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
