import { Fragment } from "react";
import { useBooking } from "../../state/useBooking";
import { calculateTotals, directions, legSummary, money } from "../../state/booking";
import "./TripSummary.css";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

export function OfferHeld({ time = "19:42" }) {
  return (
    <div className="wj-offer-held" role="status">
      <img src={asset("icon-info-error.svg")} alt="" width="16" height="16" />
      <p>Offer held for {time}</p>
    </div>
  );
}

export function TripSummary({ title = "Your booking", showPricing = true }) {
  const { booking } = useBooking();
  const totals = calculateTotals(booking);
  const fareName = booking.flights.outbound?.fare;
  const charges = [
    ["Fares", totals.fare],
    ["Bundle attributes", totals.bundle],
    ["Extras", totals.extras],
    ["Seats", totals.seats],
    ["Service charge", totals.service],
  ];
  return (
    <section className="wj-trip-summary" aria-label={title}>
      <h2>{title}</h2>
      {directions(booking).map((leg) => {
        const summary = legSummary(booking, leg);
        return (
          <div className="wj-trip-summary__leg" key={leg}>
            <div className="wj-trip-summary__leg-head">
              <h3>{summary.label}</h3>
              <span>{summary.number}</span>
            </div>
            <p>
              {summary.date} · {summary.stops} · {summary.duration}
            </p>
            <div className="wj-trip-summary__route">
              {summary.airports.map((airport, index) => (
                <Fragment key={`${airport}-${index}`}>
                  {index > 0 && (
                    <img
                      src={asset("icon-arrow-right-14.svg")}
                      alt="to"
                      width="14"
                      height="14"
                    />
                  )}
                  <b>{airport}</b>
                </Fragment>
              ))}
              <span>{summary.times}</span>
            </div>
          </div>
        );
      })}
      <dl className="wj-trip-summary__rows">
        <div>
          <dt>Passengers</dt>
          <dd>1 Adult</dd>
        </div>
        <div>
          <dt>Class / Offer</dt>
          <dd>{fareName}</dd>
        </div>
      </dl>
      {showPricing && (
        <>
          <dl className="wj-trip-summary__charges">
            {charges.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{money(value)}</dd>
              </div>
            ))}
          </dl>
          <div className="wj-trip-summary__total">
            <div>
              <span>Total</span>
              <b data-testid="booking-total">{money(totals.total)}</b>
            </div>
            <div className="wj-trip-summary__commission">
              <span>Commission</span>
              <b>{money(totals.commission)}</b>
            </div>
            <p>Price is confirmed at payment.</p>
          </div>
        </>
      )}
    </section>
  );
}
