"use client";

import { useState, useEffect } from 'react';
import AppHeader from '../../components/AppHeader';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';

export default function History() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/history');
            const data = await response.json();

            if (data.success) {
                setProducts(data.products);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to load history');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = (filepath, filename) => {
        const link = document.createElement('a');
        link.href = `http://localhost:5000${filepath}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
            <AppHeader />

            <PageWrapper>
                <div style={{ marginTop: 'var(--spacing-xl)' }}>
                    <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Product History</h1>
                    <p style={{ color: 'var(--color-text-body)', marginBottom: 'var(--spacing-xl)' }}>
                        View all your previously generated products
                    </p>

                    {/* Search Bar */}
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                            <p>Loading history...</p>
                        </div>
                    )}

                    {error && (
                        <Card style={{ background: '#fee', border: '1px solid #fcc' }}>
                            <p style={{ color: '#c00', margin: 0 }}>Error: {error}</p>
                        </Card>
                    )}

                    {!loading && !error && filteredProducts.length === 0 && (
                        <Card>
                            <p style={{ textAlign: 'center', color: 'var(--color-text-body)', margin: 0 }}>
                                {searchTerm ? 'No products found matching your search' : 'No products generated yet. Start creating!'}
                            </p>
                        </Card>
                    )}

                    {/* Products Grid */}
                    <div className="grid grid-cols-3 gap-lg">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} style={{ overflow: 'hidden' }}>
                                {/* Banner Preview */}
                                {product.files.banner && (
                                    <div style={{
                                        width: '100%',
                                        height: '200px',
                                        background: 'var(--color-background)',
                                        marginBottom: 'var(--spacing-md)',
                                        borderRadius: 'var(--border-radius-sm)',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={`http://localhost:5000${product.files.banner.path}`}
                                            alt={product.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Product Info */}
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    marginBottom: 'var(--spacing-sm)',
                                    textTransform: 'capitalize'
                                }}>
                                    {product.name}
                                </h3>

                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--color-text-body)',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    Generated: {new Date(product.timestamp).toLocaleDateString()}
                                </p>

                                {/* Download Buttons */}
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                    {product.files.description && (
                                        <button
                                            onClick={() => downloadFile(product.files.description.path, product.files.description.filename)}
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                background: 'var(--color-primary-600)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 'var(--border-radius-sm)',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            📄 Description
                                        </button>
                                    )}

                                    {product.files.banner && (
                                        <button
                                            onClick={() => downloadFile(product.files.banner.path, product.files.banner.filename)}
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                background: 'var(--color-primary-600)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 'var(--border-radius-sm)',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            🖼️ Banner
                                        </button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
}
