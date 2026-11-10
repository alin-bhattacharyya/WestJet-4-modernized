import { useState } from "react";
import { airports } from "../../state/booking";
import { useBooking } from "../../state/useBooking";
import { airportLabel, asset, collageColumns, rangeLabel } from "./dashboardData";
import "./SearchCard.css";

const emptySearch = {
  tripType: "Round Trip",
  origin: "",
  destination: "",
  departure: "",
  returnDate: "",
  passengers: "",
  cabin: "",
  car: false,
  passOnly: false,
};

function SelectField({ id, label, value, onChange, options, className = "" }) {
  return (
    <div className={`wj-home-search__field ${className}`}>
      <label className="wj-home-search__label" htmlFor={id}>
        {label}
      </label>
      <div className="wj-home-search__control">
        <select
          id={id}
          className={value === "" ? "is-empty" : ""}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="" disabled>
            Select
          </option>
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
        <img src={asset("icon-chevron-down-18.svg")} alt="" width="18" height="18" />
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="wj-home-search__toggle"
      onClick={() => onChange(!checked)}
    >
      <span className="wj-home-search__switch" aria-hidden="true" />
      {label}
    </button>
  );
}

export function SearchCard({ onBook }) {
  const { update } = useBooking();
  const [draft, setDraft] = useState(emptySearch);
  const [datesOpen, setDatesOpen] = useState(false);
  const oneWay = draft.tripType === "One Way";
  const set = (key) => (value) => setDraft((current) => ({ ...current, [key]: value }));
  const airportOptions = airports.map((airport) => [airport, airportLabel(airport)]);
  const complete =
    draft.origin &&
    draft.destination &&
    draft.origin !== draft.destination &&
    draft.departure &&
    (oneWay || (draft.returnDate && draft.returnDate >= draft.departure)) &&
    draft.passengers &&
    draft.cabin;
  const datesLabel = oneWay ? "Depart" : "Depart · Return";
  const dates = rangeLabel(draft.departure, oneWay ? "" : draft.returnDate);

  const submit = (event) => {
    event.preventDefault();
    if (!complete) return;
    const { returnDate, passengers, ...rest } = draft;
    // onBook may reset a finished booking first, so apply the search after it.
    onBook();
    update("search", {
      ...rest,
      ...(oneWay ? {} : { returnDate }),
      passengers: Number(passengers),
    });
  };

  return (
    <section className="wj-home-search" aria-labelledby="wj-home-search-welcome">
      <div className="wj-home-search__collage" aria-hidden="true">
        {collageColumns.map((column, index) => (
          <div className="wj-home-search__column" key={index}>
            {column.map((image) => (
              <div className="wj-home-search__photo" key={image.src}>
                <img src={asset(image.src)} alt="" style={image.crop} className={image.crop ? "is-cropped" : ""} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="wj-home-search__intro">
        <h1 id="wj-home-search-welcome">Welcome back, Maya</h1>
        <p>Your business travel, all in one place. Book with WestJet Biz corporate benefits.</p>
      </div>
      <h2 className="wj-home-search__title">Search flights</h2>
      <p className="wj-home-search__subtitle">Corporate fares and policy checks are applied automatically.</p>
      <form className="wj-home-search__form" onSubmit={submit}>
        <div className="wj-home-search__trip-type">
          <select
            aria-label="Trip type"
            value={draft.tripType}
            onChange={(event) => set("tripType")(event.target.value)}
          >
            <option>Round Trip</option>
            <option>One Way</option>
          </select>
          <img src={asset("icon-chevron-down-teal-17.svg")} alt="" width="17.5" height="17.5" />
        </div>
        <div className="wj-home-search__grid">
          <SelectField id="wj-home-search-from" label="From" value={draft.origin} onChange={set("origin")} options={airportOptions} />
          <SelectField id="wj-home-search-to" label="To" value={draft.destination} onChange={set("destination")} options={airportOptions} />
          <div className="wj-home-search__field wj-home-search__dates">
            <span className="wj-home-search__label" aria-hidden="true">
              {datesLabel}
            </span>
            <div className="wj-home-search__control">
              <button
                type="button"
                className={dates ? "" : "is-empty"}
                aria-expanded={datesOpen}
                aria-label={`${datesLabel}: ${dates || "Select"}`}
                onClick={() => setDatesOpen((open) => !open)}
              >
                {dates || "Select"}
              </button>
              <img src={asset("icon-calendar-days-18.svg")} alt="" width="18" height="18" />
            </div>
            {datesOpen && (
              <div className="wj-home-search__popover">
                <label>
                  Depart
                  <input type="date" value={draft.departure} onChange={(event) => set("departure")(event.target.value)} />
                </label>
                {!oneWay && (
                  <label>
                    Return
                    <input
                      type="date"
                      min={draft.departure || undefined}
                      value={draft.returnDate}
                      onChange={(event) => set("returnDate")(event.target.value)}
                    />
                  </label>
                )}
                <button type="button" onClick={() => setDatesOpen(false)}>
                  Done
                </button>
              </div>
            )}
          </div>
          <SelectField
            id="wj-home-search-passengers"
            label="Passengers"
            value={draft.passengers}
            onChange={set("passengers")}
            options={[1, 2, 3, 4, 5, 6].map((count) => [String(count), `${count} adult${count > 1 ? "s" : ""}`])}
          />
          <SelectField
            id="wj-home-search-cabin"
            label="Cabin"
            value={draft.cabin}
            onChange={set("cabin")}
            options={[["Economy", "Economy"], ["Premium", "Premium"]]}
          />
        </div>
        <div className="wj-home-search__footer">
          <div className="wj-home-search__toggles">
            <Toggle label="Include a Car Rental" checked={draft.car} onChange={set("car")} />
            <Toggle label="Flight Pass Eligible Flights" checked={draft.passOnly} onChange={set("passOnly")} />
          </div>
          <button type="submit" className="wj-home-search__submit" disabled={!complete}>
            Search flights
          </button>
        </div>
      </form>
    </section>
  );
}
