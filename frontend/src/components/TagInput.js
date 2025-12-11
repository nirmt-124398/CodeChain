"use client";

import { useState } from 'react';

export default function TagInput({
    label,
    tags = [],
    onTagsChange,
    placeholder = 'Type and press Enter'
}) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!tags.includes(inputValue.trim())) {
                onTagsChange([...tags, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <div className="flex flex-col gap-sm">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="input"
                />
                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-label)',
                    margin: 0,
                    fontStyle: 'italic'
                }}>
                    💡 Type a feature and press Enter to add it
                </p>
                {tags.length > 0 && (
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginTop: '8px' }}>
                        {tags.map((tag, index) => (
                            <span key={index} className="tag">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="tag-remove"
                                    aria-label={`Remove ${tag}`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
