export default function Select({
    label,
    value,
    onChange,
    options = [],
    required = false,
    id
}) {
    const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="form-group">
            {label && <label htmlFor={selectId}>{label}</label>}
            <select
                id={selectId}
                value={value}
                onChange={onChange}
                required={required}
                className="select"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
