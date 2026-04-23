import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => String(o.value) === String(value));

  function handleSelect(opt) {
    onChange({ target: { value: opt.value } });
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-2 w-full" ref={ref}>
      {label && (
        <label className="text-body-s text-neutral-extra-dark">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className="w-full h-10 bg-neutral-white border border-identity rounded-xl pl-5 pr-4 flex items-center justify-between gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-identity/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={`text-body-m ${selected ? 'text-neutral-extra-dark' : 'text-neutral-main'}`}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-neutral-main transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <ul className="absolute z-10 w-full mt-1 bg-neutral-white border border-neutral-light rounded-md shadow-[0px_4px_6px_rgba(81,81,81,0.22)] py-2 max-h-48 overflow-y-auto">
            {options.length === 0 ? (
              <li className="px-4 py-[7px] text-body-m text-neutral-main">
                Sin opciones
              </li>
            ) : (
              options.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`px-4 py-[7px] cursor-pointer text-body-m ${
                    String(opt.value) === String(value)
                      ? 'bg-neutral-light text-neutral-extra-dark'
                      : 'text-neutral-dark hover:bg-neutral-light/60'
                  }`}
                >
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
