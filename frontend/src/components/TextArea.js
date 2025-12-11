export default function TextArea({
    label,
    value,
    onChange,
    placeholder = '',
    rows = 4,
    required = false,
    id
}) {
    const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="form-group">
            {label && <label htmlFor={textareaId}>{label}</label>}
            <textarea
                id={textareaId}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                required={required}
                className="textarea"
            />
        </div>
    );
}
