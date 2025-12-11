import Card from './Card';

export default function PreviewPanel({ productName, features, platform }) {
    return (
        <Card>
            <h3 className="card-title">Live Preview</h3>
            <div className="flex flex-col gap-md">
                <div>
                    <label style={{ marginBottom: '4px' }}>Product Name</label>
                    <p style={{
                        color: 'var(--color-text-heading)',
                        fontWeight: '600',
                        margin: 0
                    }}>
                        {productName || 'Not set'}
                    </p>
                </div>

                <div>
                    <label style={{ marginBottom: '4px' }}>Platform</label>
                    <p style={{
                        color: 'var(--color-text-heading)',
                        fontWeight: '600',
                        margin: 0,
                        textTransform: 'capitalize'
                    }}>
                        {platform || 'Not selected'}
                    </p>
                </div>

                <div>
                    <label style={{ marginBottom: '4px' }}>Features</label>
                    {features && features.length > 0 ? (
                        <ul style={{
                            margin: 0,
                            paddingLeft: '20px',
                            color: 'var(--color-text-body)'
                        }}>
                            {features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{
                            color: 'var(--color-text-label)',
                            fontStyle: 'italic',
                            margin: 0
                        }}>
                            No features added
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
