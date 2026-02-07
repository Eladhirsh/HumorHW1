'use client';

import { useState } from 'react';
import { voteOnCaption } from './actions';

export default function VoteButtons({ captionId }: { captionId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleVote = async (voteValue: number) => {
    setLoading(true);
    setMessage(null);

    const result = await voteOnCaption(captionId, voteValue);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: voteValue > 0 ? 'Upvoted!' : 'Downvoted!' });
    }

    setLoading(false);
  };

  return (
    <div className="d-flex flex-column align-items-center gap-2">
      <div className="btn-group" role="group">
        <button
          onClick={() => handleVote(1)}
          disabled={loading}
          className="btn btn-outline-success"
          title="Upvote"
        >
          <i className="bi bi-hand-thumbs-up-fill"></i>
        </button>
        <button
          onClick={() => handleVote(-1)}
          disabled={loading}
          className="btn btn-outline-danger"
          title="Downvote"
        >
          <i className="bi bi-hand-thumbs-down-fill"></i>
        </button>
      </div>
      {message && (
        <small className={message.type === 'success' ? 'text-success' : 'text-danger'}>
          {message.text}
        </small>
      )}
    </div>
  );
}
