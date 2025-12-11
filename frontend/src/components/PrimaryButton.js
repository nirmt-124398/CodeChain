export default function PrimaryButton({
    children,
    onClick,
    disabled = false,
    loading = false,
    type = 'button',
    fullWidth = false
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn btn-primary ${fullWidth ? 'btn-full' : ''}`}
        >
            {loading && <span className="loader loader-small" />}
            {children}
        </button>
    );
}
