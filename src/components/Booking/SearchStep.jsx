import { useState } from "react";
import { useBooking } from "../../state/useBooking";
import { airports } from "../../state/booking";
import { Actions } from "./shared";
import {
  SearchDate,
  SearchField,
  SearchSelect,
  SearchToggle,
  TripTabs,
} from "./SearchStepFields";
import { weekday } from "./SearchStepDates";
import { SearchStepAside } from "./SearchStepAside";
import "./SearchStep.css";

const PURPOSES = ["Client meeting", "Conference", "Training", "Internal meeting"];
const CABINS = ["Economy", "Premium"];
const CABIN_HINTS = {
  Economy: "Econo fares meet company policy",
  Premium: "Premium cabin may need approval",
};

const dateHint = (value) =>
  value ? `${weekday(value)} · Local departure date` : "Local departure date";

function validate(search) {
  if (search.origin === search.destination)
    return "Choose different departure and arrival airports.";
  if (!search.departure) return "Choose a departure date.";
  if (search.tripType !== "One Way") {
    if (!search.returnDate) return "Choose a return date.";
    if (search.returnDate < search.departure)
      return "Return date must be on or after departure.";
  }
  if (!search.purpose) return "Choose a travel purpose.";
  if (!search.reason.trim()) return "Enter a business reason for this trip.";
  return "";
}

export function SearchStep({ onContinue, onBack }) {
  const { booking, update } = useBooking();
  const s = booking.search;
  const { firstName, surname } = booking.traveller;
  const traveller = `${firstName} ${surname} · Northstar Studio`;
  const oneWay = s.tripType === "One Way";
  const [error, setError] = useState("");
  const change = (key, value) => {
    update("search", { [key]: value });
    setError("");
  };
  const submit = (event) => {
    event.preventDefault();
    const message = validate(s);
    if (message) return setError(message);
    onContinue();
  };
  return (
    <>
      <header className="wj-search__heading">
        <h1>Where is business taking you?</h1>
        <p>
          Search flights with your corporate fares and company travel policy
          already applied.
        </p>
      </header>
      <div className="wj-search__layout">
        <form
          id="flight-search"
          className="wj-search__card"
          onSubmit={submit}
          noValidate
        >
          <h2 className="wj-search__title">Book a business flight</h2>
          <TripTabs value={s.tripType} onChange={(type) => change("tripType", type)} />
          <div className="wj-search__grid">
            <SearchField id="search-origin" label="Origin" hint="Departure airport">
              <SearchSelect
                id="search-origin"
                chevron={false}
                options={airports}
                value={s.origin}
                onChange={(e) => change("origin", e.target.value)}
              />
            </SearchField>
            <SearchField
              id="search-destination"
              label="Destination"
              hint="Arrival airport"
            >
              <SearchSelect
                id="search-destination"
                chevron={false}
                options={airports}
                value={s.destination}
                onChange={(e) => change("destination", e.target.value)}
              />
            </SearchField>
            <SearchField
              id="search-travellers"
              label="Travellers"
              hint="Corporate traveller"
            >
              <SearchSelect
                id="search-travellers"
                options={["1 adult"]}
                value="1 adult"
                onChange={() => {}}
              />
            </SearchField>
            <SearchField
              id="search-departure"
              label="Departure date"
              hint={dateHint(s.departure)}
            >
              <SearchDate
                id="search-departure"
                value={s.departure}
                onChange={(e) => change("departure", e.target.value)}
              />
            </SearchField>
            <SearchField
              id="search-return"
              label="Return date"
              hint={oneWay ? "Not needed for one-way trips" : dateHint(s.returnDate)}
            >
              <SearchDate
                id="search-return"
                value={s.returnDate}
                min={s.departure}
                disabled={oneWay}
                onChange={(e) => change("returnDate", e.target.value)}
              />
            </SearchField>
            <SearchField
              id="search-cabin"
              label="Cabin class"
              hint={CABIN_HINTS[s.cabin]}
            >
              <SearchSelect
                id="search-cabin"
                options={CABINS}
                value={s.cabin}
                onChange={(e) => change("cabin", e.target.value)}
              />
            </SearchField>
          </div>
          <div className="wj-search__toggles">
            <SearchToggle
              label="Include a Car Rental"
              checked={s.car}
              onChange={(value) => change("car", value)}
            />
            <SearchToggle
              label="Flight Pass Eligible Flights"
              checked={s.passOnly}
              onChange={(value) => change("passOnly", value)}
            />
          </div>
          {s.car && (
            <p className="wj-search__notice">
              Car rental can be arranged with your travel administrator after
              your flight booking.
            </p>
          )}
          <section className="wj-search__corporate">
            <h2 className="wj-search__title">Corporate travel details</h2>
            <div className="wj-search__corporate-row">
              <SearchField
                id="search-traveller"
                className="wj-search__traveller"
                label="Corporate traveller"
                hint="Operations · CC-204 · WestJet Rewards ••••4821"
              >
                <SearchSelect
                  id="search-traveller"
                  options={[traveller]}
                  value={traveller}
                  onChange={() => {}}
                />
              </SearchField>
              <SearchField
                id="search-purpose"
                className="wj-search__purpose"
                label="Travel purpose *"
                hint="Short reason shared with your approver."
              >
                <SearchSelect
                  id="search-purpose"
                  required
                  options={PURPOSES}
                  value={s.purpose}
                  onChange={(e) => change("purpose", e.target.value)}
                />
              </SearchField>
            </div>
            <SearchField
              id="search-reason"
              className="wj-search__reason"
              label="Business reason *"
              hint="Business reason saved with your trip."
            >
              <input
                id="search-reason"
                className="wj-search__input"
                required
                aria-invalid={!s.reason.trim() || undefined}
                value={s.reason}
                onChange={(e) => change("reason", e.target.value)}
              />
            </SearchField>
          </section>
          {error && (
            <p role="alert" className="wj-search__error">
              {error}
            </p>
          )}
        </form>
        <SearchStepAside />
      </div>
      <Actions onBack={onBack} form="flight-search" label="Search flights" />
    </>
  );
}
