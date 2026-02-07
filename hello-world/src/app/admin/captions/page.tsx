import { createClient } from '@/lib/supabase/server';
import CaptionActions from './CaptionActions';

export default async function AdminCaptionsPage() {
  const supabase = await createClient();

  const { data: captions, error } = await supabase
    .from('captions')
    .select(`
      id,
      content,
      created_datetime_utc,
      is_public,
      is_featured,
      like_count,
      profile_id
    `)
    .order('created_datetime_utc', { ascending: false })
    .limit(100);

  return (
    <main style={{ background: '#f5f7fa', minHeight: 'calc(100vh - 60px)' }}>
      <div className="container-fluid px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">
            <i className="bi bi-chat-square-text me-2"></i>
            Captions Management
          </h1>
          <span className="badge bg-primary fs-6">
            {captions?.length || 0} captions
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
                  <th style={{ width: '50%' }}>Content</th>
                  <th>Status</th>
                  <th>Likes</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {captions?.map((caption) => (
                  <tr key={caption.id}>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '400px' }}>
                        {caption.content || '(No content)'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${caption.is_public ? 'bg-success' : 'bg-secondary'}`}>
                        {caption.is_public ? 'Public' : 'Private'}
                      </span>
                      {caption.is_featured && (
                        <span className="badge bg-warning ms-1">Featured</span>
                      )}
                    </td>
                    <td>
                      <i className="bi bi-heart-fill text-danger me-1"></i>
                      {caption.like_count}
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(caption.created_datetime_utc).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <CaptionActions captionId={caption.id} isPublic={caption.is_public} />
                    </td>
                  </tr>
                ))}
                {(!captions || captions.length === 0) && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      No captions found
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
