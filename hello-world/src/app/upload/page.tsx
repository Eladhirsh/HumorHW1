import { createClient } from '@/lib/supabase/server';
import UploadForm from './UploadForm';

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
            <a href="/captions" className="nav-btn">
              <i className="bi bi-chat-square-quote"></i>
              <span>Rate</span>
            </a>
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
          <i className="bi bi-image"></i>
        </div>
        <h1 className="hero-title">Generate Captions</h1>
        <p className="hero-subtitle">
          Upload an image and let AI create funny captions for you
        </p>
      </section>

      {/* Content */}
      <div className="content-container">
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div className="glass-card">
            <div className="card-body">
              <UploadForm />
            </div>
          </div>
        </div>
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
