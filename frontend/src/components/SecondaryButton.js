export default function SecondaryButton({
    children,
    onClick,
    disabled = false,
    type = 'button',
    fullWidth = false
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-secondary ${fullWidth ? 'btn-full' : ''}`}
        >
            {children}
        </button>
    );
}
