export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
    id
}) {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="form-group">
            {label && <label htmlFor={inputId}>{label}</label>}
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="input"
            />
        </div>
    );
}
