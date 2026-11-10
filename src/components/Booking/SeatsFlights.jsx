import { Fragment } from "react";
import { airports, code, legSummary } from "../../state/booking";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

const airportName = (airportCode) =>
  airports.find((airport) => code(airport) === airportCode) || airportCode;
const cityName = (airportCode) =>
  airportName(airportCode).split(" (")[0].split(" ")[0];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const longDate = (value) => {
  const date = new Date(`${value}T12:00:00`);
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const legEnds = (booking, leg) =>
  leg === "outbound"
    ? [booking.search.origin, booking.search.destination]
    : [booking.search.destination, booking.search.origin];

function DirectionCard({ booking, leg, active, onSelect }) {
  const summary = legSummary(booking, leg);
  const [from, to] = legEnds(booking, leg);
  const label = leg === "outbound" ? "Outbound" : "Return";
  const date = leg === "outbound" ? booking.search.departure : booking.search.returnDate;
  return (
    <button
      type="button"
      className={`wj-seats__direction ${active ? "wj-seats__direction--active" : ""}`}
      aria-pressed={active}
      onClick={onSelect}
    >
      <span className="wj-seats__direction-head">
        <span className="wj-seats__direction-mark" aria-hidden="true">
          {active && (
            <img src={asset("icon-check-white-10.svg")} alt="" width="10" height="10" />
          )}
        </span>
        <span>
          <span className="wj-seats__accent">{label}</span> · {longDate(date)}
        </span>
      </span>
      <span className="wj-seats__direction-body">
        <span className="wj-seats__direction-info">
          <span className="wj-seats__direction-route">
            {from} → {to}
          </span>
          <span className="wj-seats__direction-meta">
            <span className="wj-seats__flight-number">WestJet {summary.number}</span>
            {` · ${summary.stops} · ${summary.duration}`}
          </span>
        </span>
        <span className="wj-seats__direction-times">{summary.times}</span>
      </span>
    </button>
  );
}

function SegmentTabs({ segments, activeKey, onSelect }) {
  return (
    <div className="wj-seats__segments">
      {segments.map((segment) => {
        const [from, to] = segment.route.split(" → ");
        const active = segment.key === activeKey;
        const direction = segment.leg === "outbound" ? "Outbound" : "Return";
        return (
          <button
            type="button"
            key={segment.key}
            className={`wj-seats__segment ${active ? "wj-seats__segment--active" : ""}`}
            aria-pressed={active}
            aria-label={`${direction} flight ${from} to ${to}`}
            onClick={() => onSelect(segment)}
          >
            {[from, to].map((airportCode, index) => (
              <span className="wj-seats__segment-stop" key={`${airportCode}-${index}`}>
                <span>{cityName(airportCode)}</span>
                <span className="wj-seats__segment-code">{airportCode}</span>
              </span>
            ))}
          </button>
        );
      })}
    </div>
  );
}

export function SeatsFlights({ booking, legs, segments, activeSegment, onSelect }) {
  return (
    <div className="wj-seats__flights">
      <div className="wj-seats__directions">
        {legs.map((leg) => (
          <DirectionCard
            key={leg}
            booking={booking}
            leg={leg}
            active={activeSegment.leg === leg}
            onSelect={() => onSelect(segments.find((segment) => segment.leg === leg))}
          />
        ))}
      </div>
      <div className="wj-seats__segment-row">
        {legs.map((leg, index) => (
          <Fragment key={leg}>
            {index > 0 && <span className="wj-seats__segment-dash" aria-hidden="true" />}
            <SegmentTabs
              segments={segments.filter((segment) => segment.leg === leg)}
              activeKey={activeSegment.key}
              onSelect={onSelect}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
