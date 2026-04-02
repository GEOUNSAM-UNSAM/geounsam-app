import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function AuthInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  error = '',
  ...inputProps
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="flex flex-col gap-2">
      <label className="font-saira text-sm leading-6 text-neutral-extra-dark">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={`w-full h-10 bg-neutral-white rounded-xl pl-5 font-saira text-base leading-6 text-neutral-extra-dark placeholder:text-neutral-main ${error ? 'border border-error' : 'border border-identity'} ${isPassword ? 'pr-10' : 'pr-4'}`}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff size={16} color="#A7A9AC" />
            ) : (
              <Eye size={16} color="#A7A9AC" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="font-saira text-sm leading-5 text-error">{error}</p>
      )}
    </div>
  )
}
