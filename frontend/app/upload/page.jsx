'use client';

import { useState } from 'react';
import apiClient from '@/utils/apiClient';

export default function UploadPage() {
  const [name, setName] = useState('');
  const [features, setFeatures] = useState('');
  const [platform, setPlatform] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDescription('');

    try {
      const response = await apiClient.post('/generate/text', {
        name,
        features: features.split(',').map((f) => f.trim()),
        platform,
      });
      setDescription(response.data.description);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Product Upload</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="features" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Features (comma separated)
          </label>
          <input
            type="text"
            id="features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="feature1, feature2, feature3"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="platform" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">Select a platform</option>
            <option value="amazon">Amazon</option>
            <option value="ebay">eBay</option>
            <option value="shopify">Shopify</option>
            <option value="etsy">Etsy</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.5rem 1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Generating...' : 'Generate Description'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '1rem', color: 'red' }}>
          {error}
        </div>
      )}

      {description && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Generated Description</h2>
          <p style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '1rem' }}>
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
