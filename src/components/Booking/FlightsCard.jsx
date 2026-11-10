import { useState } from "react";
import { fares } from "../../state/booking";
import { FlightsFarePanel } from "./FlightsFarePanel";
import { wholeMoney } from "./FlightsModel";
import "./FlightsCard.css";

const cabins = ["Economy", "Premium"];
const fromPrice = (flight, cabin) =>
  flight.price +
  Math.min(...fares.filter((fare) => fare.cabin === cabin).map((fare) => fare.extra));

function Route({ flight }) {
  if (!flight.stops) {
    return (
      <div className="wj-flights__route">
        <div className="wj-flights__route-line wj-flights__route-line--direct">
          <span className="wj-flights__route-dot" />
          <span className="wj-flights__route-segment" />
          <span className="wj-flights__route-dot" />
        </div>
        <p className="wj-flights__route-via">Nonstop</p>
      </div>
    );
  }
  return (
    <div className="wj-flights__route">
      <div className="wj-flights__route-line">
        <span className="wj-flights__route-dot" />
        <span className="wj-flights__route-segment" />
        <span className="wj-flights__route-logo" />
        <span className="wj-flights__route-segment" />
        <span className="wj-flights__route-gap" />
        <span className="wj-flights__route-segment" />
        <span className="wj-flights__route-logo" />
        <span className="wj-flights__route-segment" />
        <span className="wj-flights__route-dot" />
        <span className="wj-flights__route-stop" />
      </div>
      <p className="wj-flights__route-via">
        YVR <small>47m</small>
      </p>
    </div>
  );
}

export function FlightsCard({
  flight,
  origin,
  destination,
  number,
  open,
  onOpen,
  selected,
  allowedFares,
  onSelect,
  onShowAllFares,
}) {
  const [details, setDetails] = useState(false);
  const highlighted = Boolean(open) || Boolean(selected);
  return (
    <div className="wj-flights__option">
      <article
        aria-label={`${flight.time} ${origin} to ${flight.arrival} ${destination}, ${number}`}
        className={`wj-flights__card ${highlighted ? "is-active" : ""}`}
      >
        <div className="wj-flights__card-main">
          <div className="wj-flights__card-info">
            <p className="wj-flights__card-stops">
              {flight.stops ? "1 stop" : "Nonstop"}
              <span aria-hidden="true" />
              {flight.duration}
            </p>
            <div className="wj-flights__card-times">
              <div className="wj-flights__card-end">
                <strong>{flight.time}</strong>
                <span>{origin}</span>
              </div>
              <Route flight={flight} />
              <div className="wj-flights__card-end wj-flights__card-end--arrive">
                <strong>{flight.arrival}</strong>
                <span>{destination}</span>
              </div>
            </div>
          </div>
          <div className="wj-flights__card-footer">
            <p>Includes travel operated by WestJet Airline</p>
            <button
              type="button"
              className="wj-flights__text-button"
              aria-expanded={details}
              onClick={() => setDetails(!details)}
            >
              {details ? "Hide Flight Details" : "See Flight Details"}
            </button>
          </div>
          {details && (
            <p className="wj-flights__card-details">
              {number} · {flight.aircraft} ·{" "}
              {flight.stops
                ? "47-minute connection in Vancouver (YVR)"
                : "Direct service"}{" "}
              · {flight.duration} total · All times local · Operated by WestJet Airline
            </p>
          )}
        </div>
        <div className="wj-flights__tiles">
          {cabins.map((cabin) => (
            <div
              key={cabin}
              className={`wj-flights__tile wj-flights__tile--${cabin.toLowerCase()} ${
                selected?.cabin === cabin ? "is-selected" : ""
              }`}
            >
              <b>{cabin}</b>
              <span>From</span>
              <strong>{wholeMoney(fromPrice(flight, cabin))}</strong>
              <button
                type="button"
                aria-expanded={open === cabin}
                aria-label={`View ${cabin} fares for ${flight.time} flight`}
                onClick={() => onOpen(open === cabin ? null : cabin)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </article>
      {open && (
        <FlightsFarePanel
          cabin={open}
          flight={flight}
          allowedFares={allowedFares}
          selectedFare={selected?.fare}
          onSelect={onSelect}
          onShowAllFares={onShowAllFares}
        />
      )}
    </div>
  );
}
