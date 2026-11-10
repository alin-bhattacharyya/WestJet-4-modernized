import { legSummary } from "../../state/booking";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const longDate = (value) => {
  const date = new Date(`${value}T12:00:00`);
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

function DirectionCard({ booking, leg, active, onSelect }) {
  const summary = legSummary(booking, leg);
  const outbound = leg === "outbound";
  const from = outbound ? booking.search.origin : booking.search.destination;
  const to = outbound ? booking.search.destination : booking.search.origin;
  const date = outbound ? booking.search.departure : booking.search.returnDate;
  return (
    <button
      type="button"
      className={`wj-extras__direction ${active ? "wj-extras__direction--active" : ""}`}
      aria-pressed={active}
      onClick={onSelect}
    >
      <span className="wj-extras__direction-head">
        <span className="wj-extras__direction-mark" aria-hidden="true">
          {active && (
            <img src={asset("icon-check-white-10.svg")} alt="" width="10" height="10" />
          )}
        </span>
        <span>
          <span className="wj-extras__accent">{outbound ? "Outbound" : "Return"}</span>
          {` · ${longDate(date)}`}
        </span>
      </span>
      <span className="wj-extras__direction-body">
        <span className="wj-extras__direction-info">
          <span className="wj-extras__direction-route">
            {from} → {to}
          </span>
          <span className="wj-extras__direction-meta">
            <span className="wj-extras__accent">WestJet {summary.number}</span>
            {` · ${summary.stops} · ${summary.duration}`}
          </span>
        </span>
        <span className="wj-extras__direction-times">{summary.times}</span>
      </span>
    </button>
  );
}

export function ExtrasDirections({ booking, legs, active, onSelect }) {
  return (
    <div className="wj-extras__directions">
      {legs.map((leg) => (
        <DirectionCard
          key={leg}
          booking={booking}
          leg={leg}
          active={leg === active}
          onSelect={() => onSelect(leg)}
        />
      ))}
    </div>
  );
}
