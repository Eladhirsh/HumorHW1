import { createClient } from '@/lib/supabase/server';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Fetch users with their activity counts
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, created_datetime_utc, is_superadmin, is_in_study')
    .order('created_datetime_utc', { ascending: false })
    .limit(100);

  // Get caption counts per user
  const { data: captionCounts } = await supabase
    .from('captions')
    .select('profile_id');

  // Get vote counts per user
  const { data: voteCounts } = await supabase
    .from('caption_votes')
    .select('profile_id');

  // Count captions and votes per user
  const captionsByUser = captionCounts?.reduce((acc, c) => {
    acc[c.profile_id] = (acc[c.profile_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const votesByUser = voteCounts?.reduce((acc, v) => {
    acc[v.profile_id] = (acc[v.profile_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <main style={{ background: '#f5f7fa', minHeight: 'calc(100vh - 60px)' }}>
      <div className="container-fluid px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">
            <i className="bi bi-people me-2"></i>
            Users Management
          </h1>
          <span className="badge bg-primary fs-6">
            {users?.length || 0} users
          </span>
        </div>

        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error.message}
          </div>
        )}

        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Captions</th>
                  <th>Votes</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="fw-medium">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : '(No name)'}
                      </div>
                    </td>
                    <td>
                      <small>{user.email || 'N/A'}</small>
                    </td>
                    <td>
                      {user.is_superadmin && (
                        <span className="badge bg-danger me-1">Admin</span>
                      )}
                      {user.is_in_study && (
                        <span className="badge bg-info">Study</span>
                      )}
                      {!user.is_superadmin && !user.is_in_study && (
                        <span className="badge bg-secondary">User</span>
                      )}
                    </td>
                    <td>
                      <i className="bi bi-chat-square me-1"></i>
                      {captionsByUser[user.id] || 0}
                    </td>
                    <td>
                      <i className="bi bi-hand-thumbs-up me-1"></i>
                      {votesByUser[user.id] || 0}
                    </td>
                    <td>
                      <small className="text-muted">
                        {user.created_datetime_utc
                          ? new Date(user.created_datetime_utc).toLocaleDateString()
                          : 'N/A'}
                      </small>
                    </td>
                  </tr>
                ))}
                {(!users || users.length === 0) && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
