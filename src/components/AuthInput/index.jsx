import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function AuthInput({ label, name, value, onChange, placeholder, type = 'text' }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="flex flex-col gap-2">
      <label className="font-saira text-sm text-neutral-dark">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-10 bg-neutral-white border border-identity rounded-xl pl-5 font-saira text-neutral-dark placeholder:text-neutral-light ${isPassword ? 'pr-10' : 'pr-4'}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff size={16} color="#6B7280" />
            ) : (
              <Eye size={16} color="#6B7280" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
