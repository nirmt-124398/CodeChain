export default function Loader({ size = 'medium', text = '' }) {
    return (
        <div className="flex flex-col items-center justify-center gap-md">
            <div className={`loader ${size === 'small' ? 'loader-small' : ''}`} />
            {text && <p style={{ color: 'var(--color-text-body)', margin: 0 }}>{text}</p>}
        </div>
    );
}
