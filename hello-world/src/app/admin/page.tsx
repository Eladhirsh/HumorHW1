import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [
    { count: captionsCount },
    { count: usersCount },
    { count: votesCount },
    { count: imagesCount },
  ] = await Promise.all([
    supabase.from('captions').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('caption_votes').select('*', { count: 'exact', head: true }),
    supabase.from('images').select('*', { count: 'exact', head: true }),
  ]);

  // Recent captions
  const { data: recentCaptions } = await supabase
    .from('captions')
    .select('id, content, created_datetime_utc, is_public')
    .order('created_datetime_utc', { ascending: false })
    .limit(5);

  // Recent users
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, created_datetime_utc')
    .order('created_datetime_utc', { ascending: false })
    .limit(5);

  const stats = [
    { label: 'Total Captions', value: captionsCount || 0, icon: 'bi-chat-square-text', color: '#667eea' },
    { label: 'Total Users', value: usersCount || 0, icon: 'bi-people', color: '#f093fb' },
    { label: 'Total Votes', value: votesCount || 0, icon: 'bi-hand-thumbs-up', color: '#4facfe' },
    { label: 'Total Images', value: imagesCount || 0, icon: 'bi-image', color: '#43e97b' },
  ];

  return (
    <main style={{ background: '#f5f7fa', minHeight: 'calc(100vh - 60px)' }}>
      <div className="container-fluid px-4 py-4">
        <h1 className="h3 mb-4">
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{ width: 50, height: 50, background: stat.color }}
                  >
                    <i className={`bi ${stat.icon} text-white fs-4`}></i>
                  </div>
                  <div>
                    <div className="text-muted small">{stat.label}</div>
                    <div className="h4 mb-0 fw-bold">{stat.value.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Recent Captions */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-chat-square-text me-2"></i>
                  Recent Captions
                </h5>
                <a href="/admin/captions" className="btn btn-sm btn-outline-primary">View All</a>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {recentCaptions?.map((caption) => (
                    <div key={caption.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <p className="mb-1 text-truncate" style={{ maxWidth: '80%' }}>
                          {caption.content || '(No content)'}
                        </p>
                        <span className={`badge ${caption.is_public ? 'bg-success' : 'bg-secondary'}`}>
                          {caption.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                      <small className="text-muted">
                        {new Date(caption.created_datetime_utc).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                  {(!recentCaptions || recentCaptions.length === 0) && (
                    <div className="list-group-item text-muted text-center py-4">
                      No captions yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-people me-2"></i>
                  Recent Users
                </h5>
                <a href="/admin/users" className="btn btn-sm btn-outline-primary">View All</a>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {recentUsers?.map((user) => (
                    <div key={user.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-medium">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.email || 'Unknown'}
                          </div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                        <small className="text-muted">
                          {user.created_datetime_utc
                            ? new Date(user.created_datetime_utc).toLocaleDateString()
                            : 'N/A'}
                        </small>
                      </div>
                    </div>
                  ))}
                  {(!recentUsers || recentUsers.length === 0) && (
                    <div className="list-group-item text-muted text-center py-4">
                      No users yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
