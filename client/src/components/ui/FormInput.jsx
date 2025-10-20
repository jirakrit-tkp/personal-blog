import { useState } from 'react';
import { Eye } from 'lucide-react';
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
  hasError = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  const baseClasses = 'px-3 py-2 rounded-md transition-colors text-base';
  
  const stateClasses = disabled || readOnly
    ? 'bg-stone-200/50 text-stone-400 border-0'
    : hasError
      ? 'bg-white border-2 border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
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
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`${baseClasses} ${stateClasses} ${isPasswordType ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {isPasswordType && !disabled && !readOnly && (
          <button
            type="button"
            onPointerDown={() => setShowPassword(true)}
            onPointerUp={() => setShowPassword(false)}
            onPointerLeave={() => setShowPassword(false)}
            onPointerCancel={() => setShowPassword(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
            tabIndex={-1}
          >
            <Eye className="w-5 h-5" />
          </button>
        )}
      </div>
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
  hasError: PropTypes.bool,
};

FormInput.displayName = 'FormInput';

export default FormInput;

