"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '../../components/AppHeader';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import apiClient, { API_BASE_URL } from '../../utils/apiClient';

export default function BannerPage() {
    const router = useRouter();
    const [generationData, setGenerationData] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem('generationData');
        if (!data) {
            router.push('/upload');
            return;
        }

        const parsedData = JSON.parse(data);
        if (!parsedData.bannerPath) {
            router.push('/description');
            return;
        }

        setGenerationData(parsedData);
    }, [router]);

    const handleDownload = async () => {
        try {
            const response = await apiClient.get(`/uploads/${generationData.bannerPath}`, { responseType: 'blob' });
            const blob = response.data;
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

    const handleExport = async () => {
        try {
            // Download description
            const descBlob = new Blob([generationData.description], { type: 'text/plain' });
            const descUrl = URL.createObjectURL(descBlob);
            const descLink = document.createElement('a');
            descLink.href = descUrl;
            descLink.download = `${generationData.productName.replace(/\s+/g, '_')}_description.txt`;
            descLink.click();
            URL.revokeObjectURL(descUrl);

            // Small delay between downloads
            await new Promise(resolve => setTimeout(resolve, 300));

            // Download banner
            const response = await apiClient.get(`/uploads/${generationData.bannerPath}`, { responseType: 'blob' });
            const bannerBlob = response.data;
            const bannerUrl = URL.createObjectURL(bannerBlob);
            const bannerLink = document.createElement('a');
            bannerLink.href = bannerUrl;
            bannerLink.download = generationData.bannerPath;
            bannerLink.click();
            URL.revokeObjectURL(bannerUrl);

            // Small delay between downloads
            await new Promise(resolve => setTimeout(resolve, 300));

            // Download specs
            const specs = {
                productName: generationData.productName,
                platform: generationData.platform,
                features: generationData.features,
                descriptionLength: generationData.description.length,
                bannerPath: generationData.bannerPath,
                generatedAt: new Date().toISOString()
            };
            const specsBlob = new Blob([JSON.stringify(specs, null, 2)], { type: 'application/json' });
            const specsUrl = URL.createObjectURL(specsBlob);
            const specsLink = document.createElement('a');
            specsLink.href = specsUrl;
            specsLink.download = `${generationData.productName.replace(/\s+/g, '_')}_specs.json`;
            specsLink.click();
            URL.revokeObjectURL(specsUrl);

            alert('✅ All files downloaded successfully!');
        } catch (error) {
            console.error('Error downloading files:', error);
            alert('Failed to download some files. Please try again.');
        }
    };

    if (!generationData) {
        return null;
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppHeader />

            <PageWrapper>
                <div style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                    <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Step 3: Generated Banner</h1>
                    <p style={{ color: 'var(--color-text-body)', marginBottom: 'var(--spacing-xl)' }}>
                        Your AI-generated banner is ready for download
                    </p>

                    <div className="grid grid-cols-2 gap-lg">
                        {/* Left: Banner Preview */}
                        <Card>
                            <h3 className="card-title">Banner Preview</h3>
                            <div style={{
                                background: 'var(--color-bg-main)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border)',
                                padding: 'var(--spacing-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '400px',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={`${API_BASE_URL}/uploads/${generationData.bannerPath}`}
                                    alt="Generated Banner"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        borderRadius: 'var(--radius-sm)'
                                    }}
                                />
                            </div>
                        </Card>

                        {/* Right: Controls */}
                        <Card>
                            <h3 className="card-title">Banner Details</h3>

                            <div className="flex flex-col gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
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

                                <div>
                                    <label>Banner Size</label>
                                    <p style={{
                                        color: 'var(--color-text-heading)',
                                        fontWeight: '600',
                                        margin: 0
                                    }}>
                                        {getBannerSize(generationData.platform)}
                                    </p>
                                </div>

                                <div>
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

                            <div className="flex flex-col gap-md">
                                <PrimaryButton onClick={handleDownload} fullWidth>
                                    📥 Download Banner
                                </PrimaryButton>
                                <PrimaryButton onClick={handleExport} fullWidth>
                                    📦 Export Complete Pack →
                                </PrimaryButton>
                                <SecondaryButton onClick={() => router.push('/description')} fullWidth>
                                    ← Back to Description
                                </SecondaryButton>
                            </div>
                        </Card>
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
}

function getBannerSize(platform) {
    switch (platform) {
        case 'amazon': return '3000 × 1000 px';
        case 'flipkart': return '2000 × 500 px';
        case 'meta': return '1080 × 1080 px';
        default: return '1200 × 628 px';
    }
}
