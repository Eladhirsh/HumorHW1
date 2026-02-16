'use client';

import { useState } from 'react';
import { generatePresignedUrl, registerImageUrl, generateCaptions } from './actions';

type Caption = {
  id: string;
  content: string;
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic'];

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a JPEG, PNG, WebP, GIF, or HEIC image.');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      setCaptions([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setCaptions([]);

    try {
      // Step 1: Generate presigned URL
      setStatus('Generating upload URL...');
      const presignedResult = await generatePresignedUrl(file.type);
      if (presignedResult.error) {
        throw new Error(presignedResult.error);
      }

      // Step 2: Upload image bytes to presigned URL
      setStatus('Uploading image...');
      const uploadResponse = await fetch(presignedResult.presignedUrl!, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to storage');
      }

      // Step 3: Register image URL
      setStatus('Registering image...');
      const registerResult = await registerImageUrl(presignedResult.cdnUrl!);
      if (registerResult.error) {
        throw new Error(registerResult.error);
      }

      // Step 4: Generate captions
      setStatus('Generating captions...');
      const captionsResult = await generateCaptions(registerResult.imageId!);
      if (captionsResult.error) {
        throw new Error(captionsResult.error);
      }

      setCaptions(captionsResult.captions || []);
      setStatus('Done!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* File Input */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="imageUpload" className="form-label">
          Select an image
        </label>
        <input
          type="file"
          id="imageUpload"
          className="form-input"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          disabled={loading}
        />
        <p className="form-hint">
          Supported: JPEG, PNG, WebP, GIF, HEIC
        </p>
      </div>

      {/* Preview */}
      {preview && (
        <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
          <img
            src={preview}
            alt="Preview"
            className="image-preview"
          />
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="btn-accent"
        style={{ marginBottom: '1rem' }}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            {status}
          </>
        ) : (
          <>
            <i className="bi bi-cloud-upload"></i>
            Upload & Generate Captions
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="alert-error">
          <i className="bi bi-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Generated Captions */}
      {captions.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h5 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            <i className="bi bi-chat-quote" style={{ marginRight: '0.5rem', color: 'var(--accent-light)' }}></i>
            Generated Captions
          </h5>
          <div>
            {captions.map((caption, index) => (
              <div key={caption.id || index} className="caption-item">
                <p className="caption-text">&ldquo;{caption.content}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
