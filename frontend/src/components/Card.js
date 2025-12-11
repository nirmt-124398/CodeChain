export default function Card({ children, className = '', hover = true }) {
    return (
        <div className={`card ${!hover ? 'no-hover' : ''} ${className}`}>
            {children}
        </div>
    );
}
