import { useId } from "react";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// "1985-04-12" -> "12 Apr 1985"
function formatFieldDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) return "";
  const [, year, month, day] = match;
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
}

function FieldShell({ id, label, hint, className = "", children }) {
  return (
    <div className={`wj-travellers__field ${className}`}>
      <label htmlFor={id} className="wj-travellers__label">
        {label}
      </label>
      <div className="wj-travellers__boundary">{children}</div>
      {hint && <p className="wj-travellers__hint">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  invalid,
  className,
  autoComplete,
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} className={className}>
      <input
        id={id}
        type={type}
        className="wj-travellers__control"
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
  className,
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <div className="wj-travellers__select">
        <select
          id={id}
          className="wj-travellers__control"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => {
            const [optionValue, optionLabel] = Array.isArray(option)
              ? option
              : [option, option];
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        <img
          className="wj-travellers__icon"
          src={asset("icon-chevron-down-18.svg")}
          alt=""
          width="18"
          height="18"
        />
      </div>
    </FieldShell>
  );
}

// Native date input; while it is not focused the value is shown formatted
// ("12 Apr 1985") as in the design, and the picker opens on click.
export function DateField({ label, value, onChange, invalid, className }) {
  const id = useId();
  const openPicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // showPicker is unavailable or blocked; native editing still works.
    }
  };
  return (
    <FieldShell id={id} label={label} className={className}>
      <div className="wj-travellers__date">
        <input
          id={id}
          type="date"
          className="wj-travellers__control wj-travellers__date-input"
          value={value}
          aria-invalid={invalid || undefined}
          onClick={openPicker}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="wj-travellers__date-text" aria-hidden="true">
          {formatFieldDate(value)}
        </span>
        <img
          className="wj-travellers__icon"
          src={asset("icon-calendar-days-18.svg")}
          alt=""
          width="18"
          height="18"
        />
      </div>
    </FieldShell>
  );
}

export function CheckOption({ label, checked, onChange }) {
  return (
    <label className="wj-travellers__check">
      <input
        type="checkbox"
        className="wj-travellers__check-input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="wj-travellers__check-box" aria-hidden="true">
        <img
          src={asset("icon-check-white-14.svg")}
          alt=""
          width="14"
          height="14"
        />
      </span>
      <span>{label}</span>
    </label>
  );
}
