import PropTypes from 'prop-types';

const FormInput = ({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  readOnly = false,
  label,
  className = '',
  ...props 
}) => {
  const baseClasses = 'px-3 py-2 rounded-md transition-colors text-base';
  
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
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={`${baseClasses} ${stateClasses} ${className}`}
        {...props}
      />
    </div>
  );
};

FormInput.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
};

FormInput.displayName = 'FormInput';

export default FormInput;

