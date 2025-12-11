"use client";

import { useState } from 'react';

export default function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header style={{
            background: 'var(--color-primary-600)',
            color: 'white',
            padding: 'var(--spacing-lg) 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div className="header-container">
                <div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        marginBottom: '4px',
                        color: 'white'
                    }}>
                        CodeChain
                    </h1>
                    <p style={{
                        fontSize: '0.875rem',
                        opacity: '0.9',
                        margin: 0
                    }}>
                        AI Creative Studio for Retail
                    </p>
                </div>

                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isMenuOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        )}
                    </svg>
                </button>

                <nav className={`header-nav ${isMenuOpen ? 'is-open' : ''}`}>
                    <a href="/"
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: '500',
                            transition: 'opacity 0.2s'
                        }}>
                        Home
                    </a>
                    <a href="/upload"
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: '500',
                            transition: 'opacity 0.2s'
                        }}>
                        Create
                    </a>
                    <a href="/history"
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: '500',
                            transition: 'opacity 0.2s'
                        }}>
                        History
                    </a>
                </nav>
            </div>
        </header>
    );
}
