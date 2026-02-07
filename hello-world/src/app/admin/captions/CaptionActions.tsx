'use client';

import { useState } from 'react';
import { deleteCaption, toggleCaptionPublic } from './actions';

type Props = {
  captionId: string;
  isPublic: boolean;
};

export default function CaptionActions({ captionId, isPublic }: Props) {
  const [loading, setLoading] = useState(false);

  const handleTogglePublic = async () => {
    setLoading(true);
    await toggleCaptionPublic(captionId, !isPublic);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this caption?')) return;
    setLoading(true);
    await deleteCaption(captionId);
    setLoading(false);
  };

  return (
    <div className="btn-group btn-group-sm">
      <button
        onClick={handleTogglePublic}
        disabled={loading}
        className={`btn ${isPublic ? 'btn-outline-warning' : 'btn-outline-success'}`}
        title={isPublic ? 'Make Private' : 'Make Public'}
      >
        <i className={`bi ${isPublic ? 'bi-eye-slash' : 'bi-eye'}`}></i>
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="btn btn-outline-danger"
        title="Delete"
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
}
