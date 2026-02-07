import { createClient } from '@/lib/supabase/server';
import UploadForm from './UploadForm';

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
            <a href="/captions" className="btn btn-outline-light btn-sm">
              <i className="bi bi-chat-square-quote me-1"></i>
              Rate
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
            <i className="bi bi-image text-white"></i>
          </div>
          <h1 className="hero-title mb-3">Generate Captions</h1>
          <p className="hero-subtitle mb-0">
            Upload an image and let AI create funny captions for you!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-4" style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="theme-card">
              <div className="card-body">
                <UploadForm />
              </div>
            </div>
          </div>
        </div>
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
