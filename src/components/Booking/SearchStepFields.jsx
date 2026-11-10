import { useRef } from "react";
import { fieldDate } from "./SearchStepDates";

const CHEVRON = `${import.meta.env.BASE_URL}figma-assets/v3/icon-chevron-down-18.svg`;
const CALENDAR = `${import.meta.env.BASE_URL}figma-assets/v3/icon-calendar-days-18.svg`;
const TOGGLE_ON = `${import.meta.env.BASE_URL}figma-assets/v3/toggle-on.svg`;
const TOGGLE_OFF = `${import.meta.env.BASE_URL}figma-assets/v3/toggle-off.svg`;

export function SearchField({ id, label, hint, className = "", children }) {
  return (
    <div className={`wj-search__field ${className}`}>
      <label className="wj-search__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && <p className="wj-search__hint">{hint}</p>}
    </div>
  );
}

export function SearchSelect({ options, chevron = true, ...props }) {
  return (
    <div className="wj-search__control">
      <select
        className={`wj-search__select ${chevron ? "wj-search__select--chevron" : ""}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {chevron && (
        <span className="wj-search__icon" aria-hidden="true">
          <img src={CHEVRON} alt="" width="18" height="18" />
        </span>
      )}
    </div>
  );
}

export function SearchDate({ id, value, onChange, disabled, min }) {
  const inputRef = useRef(null);
  const openPicker = () => {
    try {
      inputRef.current?.showPicker?.();
    } catch {
      // showPicker throws when not triggered by a user gesture; typing still works.
    }
  };
  return (
    <div
      className={`wj-search__control wj-search__date ${disabled ? "is-disabled" : ""}`}
    >
      <span className="wj-search__date-text" aria-hidden="true">
        {fieldDate(value) || "Select date"}
      </span>
      <span className="wj-search__icon" aria-hidden="true">
        <img src={CALENDAR} alt="" width="18" height="18" />
      </span>
      <input
        ref={inputRef}
        id={id}
        type="date"
        className="wj-search__date-input"
        value={value}
        min={min}
        disabled={disabled}
        onClick={openPicker}
        onChange={onChange}
      />
    </div>
  );
}

export function SearchToggle({ checked, onChange, label }) {
  return (
    <label className="wj-search__toggle">
      <input
        type="checkbox"
        role="switch"
        className="wj-search__toggle-input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <img
        className="wj-search__toggle-track"
        src={checked ? TOGGLE_ON : TOGGLE_OFF}
        alt=""
        width="36"
        height="20"
      />
      <span>{label}</span>
    </label>
  );
}

const TRIP_TABS = ["Round Trip", "One Way", "Multi City"];
const UNSUPPORTED = "Multi City";

export function TripTabs({ value, onChange }) {
  return (
    <div className="wj-search__tabs" role="tablist" aria-label="Trip type">
      {TRIP_TABS.map((type) => {
        const unsupported = type === UNSUPPORTED;
        const selected = value === type;
        return (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-disabled={unsupported || undefined}
            title={unsupported ? "Multi-city trips are not available yet" : undefined}
            className={`wj-search__tab ${selected ? "is-active" : ""}`}
            onClick={() => !unsupported && onChange(type)}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}
