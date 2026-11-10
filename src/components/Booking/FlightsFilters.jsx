import { fares } from "../../state/booking";
import {
  aircraftTypes,
  durationDomain,
  durationLabel,
  periods,
  priceDomain,
  sortOptions,
  stopCount,
  wholeMoney,
} from "./FlightsModel";
import "./FlightsFilters.css";

const toggleIn = (list, value) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

function Check({ label, checked, onChange }) {
  return (
    <label className="wj-flights__check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="wj-flights__check-box" aria-hidden="true" />
      {label}
    </label>
  );
}

function RangeSlider({ label, domain, step, value, format, onChange }) {
  const [min, max] = domain;
  const percent = (number) => ((number - min) / (max - min)) * 100;
  return (
    <div className="wj-flights__group wj-flights__group--range">
      <div className="wj-flights__group-title">
        <h4>{label}</h4>
        <span>
          {format(value[0])} - {format(value[1])}
        </span>
      </div>
      <div className="wj-flights__slider">
        <span className="wj-flights__slider-track" />
        <span
          className="wj-flights__slider-progress"
          style={{ left: `${percent(value[0])}%`, right: `${100 - percent(value[1])}%` }}
        />
        <input
          type="range"
          aria-label={`Minimum ${label === "Price range" ? "price" : "duration"}`}
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1]), value[1]])}
        />
        <input
          type="range"
          aria-label={`Maximum ${label === "Price range" ? "price" : "duration"}`}
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0])])}
        />
      </div>
    </div>
  );
}

export function FlightsFilters({ filters, onChange, sort, onSort }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <section className="wj-flights__filters" aria-label="Filters">
      <h3>Filters</h3>
      <div className="wj-flights__groups">
        <div className="wj-flights__group">
          <h4>Stops</h4>
          <div className="wj-flights__options">
            {[0, 1].map((stops) => (
              <Check
                key={stops}
                label={`${stops ? "1 stop" : "Nonstop"} (${stopCount(stops)})`}
                checked={filters.stops.includes(stops)}
                onChange={() => set("stops", toggleIn(filters.stops, stops))}
              />
            ))}
          </div>
        </div>
        <div className="wj-flights__group">
          <h4>Departure time</h4>
          <div className="wj-flights__blocks">
            {periods.map((period) => (
              <button
                type="button"
                key={period.id}
                aria-pressed={filters.period === period.id}
                className={filters.period === period.id ? "is-active" : ""}
                onClick={() =>
                  set("period", filters.period === period.id ? "all" : period.id)
                }
              >
                {period.block}
              </button>
            ))}
          </div>
        </div>
        <div className="wj-flights__group">
          <h4>Fare</h4>
          <div className="wj-flights__options">
            {fares.map((fare) => (
              <Check
                key={fare.name}
                label={fare.name}
                checked={filters.fares.includes(fare.name)}
                onChange={() => set("fares", toggleIn(filters.fares, fare.name))}
              />
            ))}
          </div>
        </div>
        <RangeSlider
          label="Price range"
          domain={priceDomain}
          step={50}
          value={filters.price}
          format={wholeMoney}
          onChange={(value) => set("price", value)}
        />
        <RangeSlider
          label="Flight duration"
          domain={durationDomain}
          step={5}
          value={filters.duration}
          format={durationLabel}
          onChange={(value) => set("duration", value)}
        />
        <div className="wj-flights__group">
          <h4>Aircraft</h4>
          <div className="wj-flights__options">
            {aircraftTypes.map((type) => (
              <Check
                key={type}
                label={type}
                checked={filters.aircraft.includes(type)}
                onChange={() => set("aircraft", toggleIn(filters.aircraft, type))}
              />
            ))}
          </div>
        </div>
        <div className="wj-flights__commission">
          <button
            type="button"
            role="switch"
            aria-checked={filters.commission}
            aria-labelledby="wj-flights-commission"
            onClick={() => set("commission", !filters.commission)}
          >
            <img
              src={`${import.meta.env.BASE_URL}figma-assets/v3/toggle-${filters.commission ? "on" : "off"}.svg`}
              alt=""
              width="36"
              height="20"
            />
          </button>
          <span id="wj-flights-commission">Show only offers above $55 commission</span>
        </div>
        <div className="wj-flights__group">
          <h4>Sort by</h4>
          <div className="wj-flights__blocks">
            {sortOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                aria-pressed={sort === option.id}
                className={sort === option.id ? "is-active" : ""}
                onClick={() => onSort(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FlightsCompliance() {
  return (
    <div className="wj-flights__compliance" role="note">
      <img src={`${import.meta.env.BASE_URL}figma-assets/v3/icon-circle-check-success.svg`} alt="" width="18.368" height="18.368" />
      <div>
        <b>Compliant · Within company policy</b>
        <p>
          WestJet preferred · Econo fare · $636 within $800 cap · Booked at least
          7 days ahead.
        </p>
      </div>
    </div>
  );
}
