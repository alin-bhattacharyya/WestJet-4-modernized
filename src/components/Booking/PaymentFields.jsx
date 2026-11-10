import { useId } from "react";
import { asset } from "./PaymentData";


function FieldShell({ id, label, hint, children }) {
  return (
    <div className="wj-payment__field">
      <label htmlFor={id} className="wj-payment__label">
        {label}
      </label>
      <div className="wj-payment__boundary">{children}</div>
      {hint && <p className="wj-payment__hint">{hint}</p>}
    </div>
  );
}

export function PaymentTextField({
  label,
  value,
  onChange,
  hint,
  icon,
  type = "text",
  autoComplete,
  maxLength,
  inputMode,
  readOnly,
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint}>
      <div className="wj-payment__control-wrap">
        <input
          id={id}
          type={type}
          className="wj-payment__control"
          value={value}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
        />
        {icon && (
          <img
            className="wj-payment__icon"
            src={asset(icon)}
            alt=""
            width="18"
            height="18"
          />
        )}
      </div>
    </FieldShell>
  );
}

export function PaymentSelectField({ label, value, onChange, options, hint }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint}>
      <div className="wj-payment__control-wrap">
        <select
          id={id}
          className="wj-payment__control wj-payment__control--select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <img
          className="wj-payment__icon"
          src={asset("icon-chevron-down-18.svg")}
          alt=""
          width="18"
          height="18"
        />
      </div>
    </FieldShell>
  );
}

export function SummaryRow({ label, value, strong = false }) {
  return (
    <div
      className={`wj-payment__row ${strong ? "wj-payment__row--strong" : ""}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
