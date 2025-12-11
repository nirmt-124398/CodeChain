"use client";

export default function AppHeader() {
    return (
        <header style={{
            background: 'var(--color-primary-600)',
            color: 'white',
            padding: 'var(--spacing-lg) var(--spacing-xl)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div className="container flex justify-between items-center">
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
                <nav className="flex gap-md">
                    <a href="/" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'opacity 0.2s'
                    }}>
                        Home
                    </a>
                    <a href="/upload" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'opacity 0.2s'
                    }}>
                        Create
                    </a>
                    <a href="/history" style={{
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
