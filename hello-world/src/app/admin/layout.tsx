import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is superadmin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_superadmin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_superadmin) {
    redirect('/');
  }

  return (
    <>
      {/* Admin Header */}
      <nav className="navbar navbar-expand py-3" style={{ background: '#1a1a2e' }}>
        <div className="container-fluid px-4">
          <a href="/admin" className="navbar-brand text-white d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
            <i className="bi bi-shield-lock"></i>
            Admin Panel
          </a>
          <div className="d-flex align-items-center gap-2">
            <a href="/admin" className="btn btn-outline-light btn-sm">
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </a>
            <a href="/admin/captions" className="btn btn-outline-light btn-sm">
              <i className="bi bi-chat-square-text me-1"></i>
              Captions
            </a>
            <a href="/admin/users" className="btn btn-outline-light btn-sm">
              <i className="bi bi-people me-1"></i>
              Users
            </a>
            <a href="/" className="btn btn-outline-warning btn-sm ms-2">
              <i className="bi bi-house me-1"></i>
              Exit Admin
            </a>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
