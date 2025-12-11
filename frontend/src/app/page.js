"use client";

import AppHeader from '../components/AppHeader';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: 'Banner Generator',
      description: 'Create stunning product banners optimized for Amazon, Flipkart, and Meta platforms with AI-powered design.',
      icon: '🎨'
    },
    {
      title: 'SEO Description Generator',
      description: 'Generate compelling, platform-optimized product descriptions that drive conversions and improve search rankings.',
      icon: '✍️'
    },
    {
      title: 'Platform Specs Validator',
      description: 'Automatically validate your creatives against platform requirements to ensure compliance and quality.',
      icon: '✓'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
        color: 'white',
        padding: 'var(--spacing-2xl) var(--spacing-lg)',
        textAlign: 'center'
      }}>
        <PageWrapper>
          <div className="fade-in">
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              marginBottom: 'var(--spacing-md)',
              color: 'white'
            }}>
              CodeChain — AI Creative Studio for Retail
            </h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: 'var(--spacing-xl)',
              opacity: '0.95',
              maxWidth: '700px',
              margin: '0 auto var(--spacing-xl)'
            }}>
              Generate banners & product descriptions instantly using Google Gemini.
              Automate your retail creatives in seconds.
            </p>
            <PrimaryButton
              onClick={() => router.push('/upload')}
              style={{
                background: 'white',
                color: 'var(--color-primary-600)',
                fontSize: '1.125rem',
                padding: '16px 32px',
                height: '52px'
              }}
            >
              Start Creating →
            </PrimaryButton>
          </div>
        </PageWrapper>
      </section>

      {/* Features Section */}
      <PageWrapper>
        <section style={{ marginTop: 'var(--spacing-2xl)' }}>
          <h2 className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
            Powerful Features
          </h2>

          <div className="grid grid-cols-3 gap-lg">
            {features.map((feature, index) => (
              <Card key={index} className="slide-in" style={{
                animationDelay: `${index * 0.1}s`,
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  {feature.icon}
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Architecture Section */}
        <section style={{
          marginTop: 'var(--spacing-2xl)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <h2 className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
            How It Works
          </h2>

          <Card hover={false} style={{
            background: 'linear-gradient(to bottom, #f9fafb, white)',
            padding: 'var(--spacing-xl)'
          }}>
            <div className="flex items-center justify-center gap-md" style={{
              flexWrap: 'wrap'
            }}>
              <ArchitectureStep number="1" label="Product Input" />
              <Arrow />
              <ArchitectureStep number="2" label="MCP Integration" />
              <Arrow />
              <ArchitectureStep number="3" label="AI Engine (Gemini)" />
              <Arrow />
              <ArchitectureStep number="4" label="Validator" />
              <Arrow />
              <ArchitectureStep number="5" label="Output" />
            </div>

            <p style={{
              textAlign: 'center',
              marginTop: 'var(--spacing-xl)',
              color: 'var(--color-text-body)',
              marginBottom: 0
            }}>
              Seamless integration from input to validated, platform-ready creatives
            </p>
          </Card>
        </section>
      </PageWrapper>

      {/* Footer */}
      <footer style={{
        background: 'var(--color-text-heading)',
        color: 'white',
        padding: 'var(--spacing-lg)',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Built for Hackathon 2024 | Powered by Google Gemini
        </p>
      </footer>
    </div>
  );
}

function ArchitectureStep({ number, label }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--spacing-sm)'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'var(--color-primary-600)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: '700',
        boxShadow: 'var(--shadow-card)'
      }}>
        {number}
      </div>
      <span style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'var(--color-text-heading)',
        textAlign: 'center',
        maxWidth: '100px'
      }}>
        {label}
      </span>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{
      fontSize: '1.5rem',
      color: 'var(--color-primary-600)',
      fontWeight: '700'
    }}>
      →
    </div>
  );
}
