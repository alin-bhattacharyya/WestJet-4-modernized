import { Fragment } from "react";
import {
  calculateTotals,
  comforts,
  directions,
  legSummary,
  meals,
  money,
} from "../../state/booking";
import "./TripSummary.css";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

function Route({ summary }) {
  return (
    <div className="wj-trip-summary__route">
      {summary.airports.map((airport, index) => (
        <Fragment key={`${airport}-${index}`}>
          {index > 0 && (
            <img src={asset("icon-arrow-right-14.svg")} alt="to" width="14" height="14" />
          )}
          <b>{airport}</b>
        </Fragment>
      ))}
      <span>{summary.times}</span>
    </div>
  );
}

// Groups the per-direction selections into summary lines ("Both ways" when every leg has it).
function selectedExtras(booking, update) {
  const legs = directions(booking);
  const scope = (withItem) =>
    withItem.length === legs.length && legs.length > 1
      ? "Both ways"
      : withItem[0] === "outbound"
        ? "Outbound"
        : "Return";
  const patchLegs = (withItem, patch) =>
    update(
      "extras",
      Object.fromEntries(
        withItem.map((leg) => [leg, { ...booking.extras[leg], ...patch(booking.extras[leg]) }]),
      ),
    );
  const weights = [...new Set(legs.map((leg) => booking.extras[leg].weight))].filter(Boolean);
  const baggage = weights.map((weight) => {
    const withItem = legs.filter((leg) => booking.extras[leg].weight === weight);
    return {
      key: `weight-${weight}`,
      name: `+${weight} kg baggage`,
      scope: scope(withItem),
      price: money((weight / 5) * 19 * withItem.length),
      onRemove: () => patchLegs(withItem, () => ({ weight: 0 })),
    };
  });
  const listed = (catalogue, field) =>
    catalogue.flatMap((item) => {
      const withItem = legs.filter((leg) => booking.extras[leg][field].includes(item.id));
      if (!withItem.length) return [];
      return {
        key: `${field}-${item.id}`,
        name: item.name,
        scope: scope(withItem),
        price: money(item.price * withItem.length),
        onRemove: () =>
          patchLegs(withItem, (extras) => ({
            [field]: extras[field].filter((id) => id !== item.id),
          })),
      };
    });
  const premiumLegs = legs.filter((leg) => booking.flights[leg]?.fare === "PremiumFlex");
  const premium = premiumLegs.length
    ? [
        {
          key: "premium",
          name: "PremiumFlex",
          scope: premiumLegs.length === legs.length ? "Whole booking" : scope(premiumLegs),
          price: "Included",
          tone: "included",
        },
      ]
    : [];
  const sms = booking.traveller.sms
    ? [
        {
          key: "sms",
          name: "SMS notifications",
          price: "Free",
          tone: "free",
          onRemove: () => update("traveller", { sms: false }),
        },
      ]
    : [];
  return [...baggage, ...listed(meals, "meals"), ...premium, ...listed(comforts, "comfort"), ...sms];
}

export function ExtrasSummary({ booking, activeLeg, update }) {
  const totals = calculateTotals(booking);
  const items = selectedExtras(booking, update);
  const charges = [
    ["Fares (1 pax)", totals.fare],
    ["Bundle attributes", totals.bundle],
    ["Extras", totals.extras],
    ["Seats", totals.seats],
    ["Service charge", totals.service],
  ];
  return (
    <section className="wj-trip-summary wj-extras-summary" aria-label="Your booking">
      <h2>Your booking</h2>
      {directions(booking).map((leg) => {
        const summary = legSummary(booking, leg);
        return (
          <div className="wj-trip-summary__leg" key={leg}>
            <div className="wj-trip-summary__leg-head">
              <h3>{summary.label}</h3>
              <span>{summary.number}</span>
            </div>
            <Route summary={summary} />
          </div>
        );
      })}
      <div className="wj-trip-summary__leg">
        <div className="wj-trip-summary__leg-head">
          <h3>Selected Extras</h3>
        </div>
        <Route summary={legSummary(booking, activeLeg)} />
        <ul className="wj-extras-summary__items">
          {items.length === 0 && <li className="wj-extras-summary__empty">No extras selected</li>}
          {items.map((item) => (
            <li key={item.key}>
              <div className="wj-extras-summary__desc">
                <b>{item.name}</b>
                {item.scope && <span>{item.scope}</span>}
              </div>
              <div className="wj-extras-summary__price">
                <b className={item.tone ? `wj-extras-summary__price--${item.tone}` : ""}>
                  {item.price}
                </b>
                {item.onRemove ? (
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={item.onRemove}
                  >
                    <img src={asset("icon-x-14.svg")} alt="" width="14" height="14" />
                  </button>
                ) : (
                  <img src={asset("icon-x-14.svg")} alt="" width="14" height="14" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <dl className="wj-trip-summary__rows">
        <div>
          <dt>Passengers</dt>
          <dd>1 Adult</dd>
        </div>
        <div>
          <dt>Class / Offer</dt>
          <dd>{booking.flights.outbound?.fare}</dd>
        </div>
      </dl>
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
    </section>
  );
}
