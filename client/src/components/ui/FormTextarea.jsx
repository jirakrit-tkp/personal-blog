import PropTypes from 'prop-types';

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
  ...props 
}) => {
  const baseClasses = 'px-3 py-2 rounded-md transition-colors resize-none text-base';
  
  const stateClasses = disabled || readOnly
    ? 'bg-stone-200/50 text-stone-400 border-0'
    : 'bg-white border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-stone-500';

  const labelClasses = disabled || readOnly
    ? 'block text-base font-medium text-stone-500/50 mb-2'
    : 'block text-base font-medium text-stone-500 mb-2';

  return (
    <div className="w-full">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        maxLength={maxLength}
        className={`${baseClasses} ${stateClasses} ${className}`}
        {...props}
      />
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
};

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;

