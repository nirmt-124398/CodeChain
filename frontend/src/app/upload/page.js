"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '../../components/AppHeader';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import Select from '../../components/Select';
import TagInput from '../../components/TagInput';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import PreviewPanel from '../../components/PreviewPanel';
import Loader from '../../components/Loader';
import apiClient from '../../utils/apiClient';

export default function UploadPage() {
    const router = useRouter();
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [features, setFeatures] = useState([]);
    const [platform, setPlatform] = useState('amazon');
    const [loading, setLoading] = useState(false);

    const platformOptions = [
        { value: 'amazon', label: 'Amazon' },
        { value: 'flipkart', label: 'Flipkart' },
        { value: 'meta', label: 'Meta (Facebook/Instagram)' }
    ];

    const handleGenerate = async () => {
        if (!productName || !productDescription || features.length === 0) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            // Generate Text Description
            const textResponse = await apiClient.post('/generate/text', {
                name: productName,
                productDescription: productDescription,
                features: features,
                platform
            });

            // Store data in sessionStorage to pass to next page
            sessionStorage.setItem('generationData', JSON.stringify({
                productName,
                productDescription,
                features,
                platform,
                description: textResponse.data.description
            }));

            // Navigate to description page
            router.push('/description');
        } catch (error) {
            console.error("Error generating description:", error);

            if (error.response && error.response.data) {
                const errorData = error.response.data;
                let errorMessage = errorData.message || "Failed to generate description.";

                if (errorData.details) {
                    errorMessage += `\n\nStatus: ${errorData.details.status} ${errorData.details.statusText}`;
                }

                if (errorData.solutions && errorData.solutions.length > 0) {
                    errorMessage += `\n\nSuggested Solutions:\n`;
                    errorData.solutions.forEach((sol, idx) => {
                        errorMessage += `${idx + 1}. ${sol}\n`;
                    });
                }

                alert(errorMessage);
            } else {
                alert("Failed to generate description. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppHeader />

            <PageWrapper>
                <div style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                    <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Step 1: Product Upload</h1>
                    <p style={{ color: 'var(--color-text-body)', marginBottom: 'var(--spacing-xl)' }}>
                        Enter your product details to generate AI-powered descriptions and banners
                    </p>

                    {loading ? (
                        <Card>
                            <Loader text="Generating product description..." />
                        </Card>
                    ) : (
                        <div className="grid grid-cols-2 gap-lg">
                            {/* Left: Form */}
                            <Card>
                                <h3 className="card-title">Product Information</h3>

                                <Input
                                    label="Product Name"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="e.g., SuperComfort Running Shoes"
                                    required
                                />

                                <TextArea
                                    label="Product Description"
                                    value={productDescription}
                                    onChange={(e) => setProductDescription(e.target.value)}
                                    placeholder="Describe your product in detail (e.g., materials, benefits, target audience, unique selling points...)"
                                    rows={4}
                                    required
                                />

                                <TagInput
                                    label="Features"
                                    tags={features}
                                    onTagsChange={setFeatures}
                                    placeholder="Type a feature and press Enter"
                                />

                                {features.length > 0 && (
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--color-success)',
                                        margin: '0 0 var(--spacing-md) 0',
                                        fontWeight: '500'
                                    }}>
                                        ✓ {features.length} feature{features.length !== 1 ? 's' : ''} added
                                    </p>
                                )}

                                <Select
                                    label="Platform"
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    options={platformOptions}
                                />

                                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                                    <PrimaryButton
                                        onClick={handleGenerate}
                                        disabled={!productName || !productDescription || features.length === 0}
                                        fullWidth
                                    >
                                        {!productName ? 'Enter product name first' :
                                            !productDescription ? 'Enter product description' :
                                                features.length === 0 ? 'Add at least one feature' :
                                                    'Generate Description →'}
                                    </PrimaryButton>
                                </div>

                                <div style={{ marginTop: 'var(--spacing-md)' }}>
                                    <SecondaryButton
                                        onClick={() => router.push('/')}
                                        fullWidth
                                    >
                                        ← Back to Home
                                    </SecondaryButton>
                                </div>
                            </Card>

                            {/* Right: Live Preview */}
                            <PreviewPanel
                                productName={productName}
                                features={features}
                                platform={platform}
                            />
                        </div>
                    )}
                </div>
            </PageWrapper>
        </div>
    );
}
