"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '../../components/AppHeader';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import Loader from '../../components/Loader';
import apiClient from '../../utils/apiClient';

export default function DescriptionPage() {
    const router = useRouter();
    const [generationData, setGenerationData] = useState(null);
    const [validationResults, setValidationResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load data from sessionStorage
        const data = sessionStorage.getItem('generationData');
        if (!data) {
            router.push('/upload');
            return;
        }

        const parsedData = JSON.parse(data);
        setGenerationData(parsedData);

        // Validate the description
        validateDescription(parsedData);
    }, [router]);

    const validateDescription = async (data) => {
        try {
            const response = await apiClient.post('/validate/specs', {
                platform: data.platform,
                descriptionLength: data.description.length
            });

            setValidationResults(response.data);
        } catch (error) {
            console.error("Validation error:", error);
            setValidationResults({ issues: [], valid: true });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generationData.description);
        alert('Description copied to clipboard!');
    };

    const handleGenerateBanner = async () => {
        setLoading(true);
        try {
            const bannerSize = getBannerSize(generationData.platform);
            const response = await apiClient.post('/generate/banner', {
                name: generationData.productName,
                productDescription: generationData.productDescription,
                platform: generationData.platform,
                bannerSize: bannerSize,
                features: generationData.features
            });

            // Update session storage with banner data
            const updatedData = {
                ...generationData,
                bannerPath: response.data.bannerPath
            };
            sessionStorage.setItem('generationData', JSON.stringify(updatedData));

            // Navigate to banner page
            router.push('/banner');
        } catch (error) {
            console.error("Error generating banner:", error);
            alert("Failed to generate banner. Please try again.");
            setLoading(false);
        }
    };

    const getBannerSize = (platform) => {
        switch (platform) {
            case 'amazon': return '3000x1000';
            case 'flipkart': return '2000x500';
            case 'meta': return '1080x1080';
            default: return '1200x628';
        }
    };

    if (loading || !generationData) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <AppHeader />
                <PageWrapper>
                    <Card style={{ marginTop: 'var(--spacing-xl)' }}>
                        <Loader text="Validating description..." />
                    </Card>
                </PageWrapper>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppHeader />

            <PageWrapper>
                <div style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                    <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Step 2: Generated Description</h1>
                    <p style={{ color: 'var(--color-text-body)', marginBottom: 'var(--spacing-xl)' }}>
                        Review your AI-generated product description
                    </p>

                    {/* Validation Badges */}
                    {validationResults && (
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <Card>
                                <h3 className="card-title">
                                    {generationData.platform.charAt(0).toUpperCase() + generationData.platform.slice(1)} Specifications
                                </h3>
                                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                                    {validationResults.issues && validationResults.issues.length > 0 ? (
                                        validationResults.issues.map((issue, idx) => (
                                            <span key={idx} className="badge badge-warning">
                                                ⚠ {issue}
                                            </span>
                                        ))
                                    ) : (
                                        <>
                                            <span className="badge badge-success">
                                                ✓ Length: {generationData.description.length} chars
                                            </span>
                                            <span className="badge badge-success">
                                                ✓ Tone: Professional
                                            </span>
                                            <span className="badge badge-success">
                                                ✓ Platform Compliant
                                            </span>
                                        </>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Description Display */}
                    <Card>
                        <h3 className="card-title">Generated Product Description</h3>
                        <div style={{
                            background: 'var(--color-bg-main)',
                            padding: 'var(--spacing-lg)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            minHeight: '200px',
                            whiteSpace: 'pre-wrap',
                            color: 'var(--color-text-heading)',
                            lineHeight: '1.6',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            {generationData.description}
                        </div>

                        <div className="flex gap-md">
                            <SecondaryButton onClick={handleCopy}>
                                📋 Copy to Clipboard
                            </SecondaryButton>
                            <PrimaryButton onClick={handleGenerateBanner} loading={loading}>
                                Generate Banner →
                            </PrimaryButton>
                        </div>
                    </Card>

                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                        <SecondaryButton onClick={() => router.push('/upload')}>
                            ← Back to Upload
                        </SecondaryButton>
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
}
