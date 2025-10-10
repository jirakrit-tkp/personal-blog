import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { getMarkdownHTML } from '../../lib/markdownUtils';

const FormTextarea = ({ 
  name, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  readOnly = false,
  rows = 4,
  maxLength,
  label,
  className = '',
  showCharCount = false,
  showMarkdownToolbar = false,
  ...props 
}) => {
  const textareaRef = useRef(null);
  const [viewMode, setViewMode] = useState('write'); // 'write' or 'review'

  const baseClasses = 'px-3 py-2 transition-colors resize-none text-base';
  
  // Adjust border radius based on toolbar presence
  const borderRadiusClass = showMarkdownToolbar && !disabled && !readOnly
    ? 'rounded-b-md rounded-t-none'
    : 'rounded-md';
  
  const stateClasses = disabled || readOnly
    ? 'bg-stone-200/50 text-stone-400 border-0'
    : 'bg-white border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-stone-500';

  const labelClasses = disabled || readOnly
    ? 'block text-base font-medium text-stone-500/50 mb-2'
    : 'block text-base font-medium text-stone-500 mb-2';

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = beforeText + prefix + selectedText + suffix + afterText;
    
    // Create synthetic event for onChange
    const event = {
      target: {
        name: name,
        value: newText
      }
    };
    onChange(event);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleHeading = () => insertMarkdown('## ', '');
  const handleBold = () => insertMarkdown('**', '**');
  const handleItalic = () => insertMarkdown('*', '*');

  return (
    <div className="w-full">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      {showMarkdownToolbar && !disabled && !readOnly && (
        <div className="flex justify-between items-center p-2 bg-stone-50 border border-stone-300 rounded-t-md border-b-0">
          {/* Left side: Write/Review tabs */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'write'
                  ? 'bg-white border border-stone-300 text-stone-800 font-medium'
                  : 'text-stone-600 hover:text-stone-800'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setViewMode('review')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'review'
                  ? 'bg-white border border-stone-300 text-stone-800 font-medium'
                  : 'text-stone-600 hover:text-stone-800'
              }`}
            >
              Review
            </button>
          </div>

          {/* Right side: Markdown buttons (only show in write mode) */}
          {viewMode === 'write' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleHeading}
                className="px-3 py-1 text-sm font-semibold bg-white border border-stone-300 rounded hover:bg-stone-100 transition-colors"
                title="Heading"
              >
                H
              </button>
              <button
                type="button"
                onClick={handleBold}
                className="px-3 py-1 text-sm font-bold bg-white border border-stone-300 rounded hover:bg-stone-100 transition-colors"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={handleItalic}
                className="px-3 py-1 text-sm italic bg-white border border-stone-300 rounded hover:bg-stone-100 transition-colors"
                title="Italic"
              >
                I
              </button>
            </div>
          )}
        </div>
      )}

      {/* Textarea in Write mode or when toolbar is hidden */}
      {(!showMarkdownToolbar || viewMode === 'write' || disabled || readOnly) && (
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          maxLength={maxLength}
          className={`${baseClasses} ${borderRadiusClass} ${stateClasses} ${className}`}
          {...props}
        />
      )}

      {/* Preview in Review mode */}
      {showMarkdownToolbar && viewMode === 'review' && !disabled && !readOnly && (
        <div 
          className={`${baseClasses} ${borderRadiusClass} ${stateClasses} ${className} min-h-[${rows * 24}px] overflow-y-auto`}
          dangerouslySetInnerHTML={getMarkdownHTML(value || placeholder)}
        />
      )}

      {showCharCount && maxLength && (
        <div className="mt-2 text-sm text-stone-500 text-right">
          {value.length}/{maxLength} characters
        </div>
      )}
    </div>
  );
};

FormTextarea.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  label: PropTypes.string,
  className: PropTypes.string,
  showCharCount: PropTypes.bool,
  showMarkdownToolbar: PropTypes.bool,
};

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;

