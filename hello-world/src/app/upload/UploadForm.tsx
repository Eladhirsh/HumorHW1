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
      setStatus('Generating captions... (this may take a moment)');
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
      <div className="mb-4">
        <label htmlFor="imageUpload" className="form-label fw-medium">
          Select an image
        </label>
        <input
          type="file"
          id="imageUpload"
          className="form-control"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          disabled={loading}
        />
        <small className="text-muted">
          Supported: JPEG, PNG, WebP, GIF, HEIC
        </small>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-4 text-center">
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
          />
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="btn btn-primary w-100 py-2 mb-3"
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            {status}
          </>
        ) : (
          <>
            <i className="bi bi-cloud-upload me-2"></i>
            Upload & Generate Captions
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Generated Captions */}
      {captions.length > 0 && (
        <div className="mt-4">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-chat-quote me-2"></i>
            Generated Captions
          </h5>
          <div className="list-group">
            {captions.map((caption, index) => (
              <div key={caption.id || index} className="list-group-item">
                <p className="mb-0">&ldquo;{caption.content}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
