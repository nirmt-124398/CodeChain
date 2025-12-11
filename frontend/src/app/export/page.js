"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '../../components/AppHeader';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';

export default function ExportPage() {
    const router = useRouter();
    const [generationData, setGenerationData] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem('generationData');
        if (!data) {
            router.push('/upload');
            return;
        }

        setGenerationData(JSON.parse(data));
    }, [router]);

    const handleDownloadDescription = () => {
        const blob = new Blob([generationData.description], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${generationData.productName.replace(/\s+/g, '_')}_description.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadBanner = async () => {
        try {
            const response = await fetch(`http://localhost:5000/uploads/${generationData.bannerPath}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = generationData.bannerPath;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading banner:', error);
            alert('Failed to download banner. Please try again.');
        }
    };

    const handleDownloadSpecs = () => {
        const specs = {
            productName: generationData.productName,
            platform: generationData.platform,
            features: generationData.features,
            descriptionLength: generationData.description.length,
            bannerPath: generationData.bannerPath,
            generatedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(specs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${generationData.productName.replace(/\s+/g, '_')}_specs.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleCreateNew = () => {
        sessionStorage.removeItem('generationData');
        router.push('/upload');
    };

    if (!generationData) {
        return null;
    }

    const assets = [
        {
            icon: '📄',
            title: 'Product Description',
            description: `${generationData.description.length} characters`,
            action: handleDownloadDescription,
            color: 'var(--color-success)'
        },
        {
            icon: '🎨',
            title: 'Banner Image',
            description: `${generationData.platform} optimized`,
            action: handleDownloadBanner,
            color: 'var(--color-primary-600)'
        },
        {
            icon: '📊',
            title: 'Specifications Report',
            description: 'JSON format',
            action: handleDownloadSpecs,
            color: 'var(--color-warning)'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppHeader />

            <PageWrapper>
                <div style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                    {/* Success Header */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: 'var(--spacing-2xl)'
                    }}>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            ✓
                        </div>
                        <h1 style={{
                            color: 'var(--color-success)',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            Export Complete!
                        </h1>
                        <p style={{
                            color: 'var(--color-text-body)',
                            fontSize: '1.125rem'
                        }}>
                            Your retail creatives are ready for download
                        </p>
                    </div>

                    {/* Assets Grid */}
                    <div className="grid grid-cols-3 gap-lg" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        {assets.map((asset, index) => (
                            <Card key={index} className="fade-in" style={{
                                animationDelay: `${index * 0.1}s`,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                                onClick={asset.action}>
                                <div style={{
                                    fontSize: '3rem',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    {asset.icon}
                                </div>
                                <h3 className="card-title">{asset.title}</h3>
                                <p className="card-description" style={{ marginBottom: 'var(--spacing-md)' }}>
                                    {asset.description}
                                </p>
                                <span className="badge badge-success">
                                    ✓ Ready
                                </span>
                            </Card>
                        ))}
                    </div>

                    {/* Product Summary */}
                    <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <h3 className="card-title">Generation Summary</h3>
                        <div className="grid grid-cols-2 gap-md">
                            <div>
                                <label>Product Name</label>
                                <p style={{
                                    color: 'var(--color-text-heading)',
                                    fontWeight: '600',
                                    margin: 0
                                }}>
                                    {generationData.productName}
                                </p>
                            </div>
                            <div>
                                <label>Platform</label>
                                <p style={{
                                    color: 'var(--color-text-heading)',
                                    fontWeight: '600',
                                    margin: 0,
                                    textTransform: 'capitalize'
                                }}>
                                    {generationData.platform}
                                </p>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>Features</label>
                                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                                    {generationData.features.map((feature, idx) => (
                                        <span key={idx} className="tag">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-md justify-center">
                        <PrimaryButton onClick={handleCreateNew}>
                            ✨ Create New Product
                        </PrimaryButton>
                        <PrimaryButton onClick={() => router.push('/')}>
                            🏠 Back to Home
                        </PrimaryButton>
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
}
