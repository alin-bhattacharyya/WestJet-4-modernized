import { calculateTotals, money, seatCommission, seatPrice } from "../../state/booking";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

function SelectedSeats({ booking, segments }) {
  const subtotal = segments.reduce((sum, s) => sum + seatPrice(booking.seats[s.key]), 0);
  const commission = segments.reduce((sum, s) => sum + seatCommission(booking.seats[s.key]), 0);
  return (
    <section className="wj-seats__selected" aria-labelledby="wj-seats-selected-title">
      <h2 id="wj-seats-selected-title">Selected Seats</h2>
      <ul>
        {segments.map((segment) => {
          const seat = booking.seats[segment.key];
          const [from, to] = segment.route.split(" → ");
          const extra = seatCommission(seat);
          return (
            <li key={segment.key}>
              <span className="wj-seats__selected-route">
                <b>{from}</b>
                <img src={asset("icon-arrow-right-14.svg")} alt="" width="14" height="14" />
                <b>{to}</b>
                <span className={`wj-seats__badge ${seat ? "" : "wj-seats__badge--empty"}`}>
                  {seat || "No seat"}
                </span>
              </span>
              <span className="wj-seats__selected-price">
                <b>{money(seatPrice(seat))}</b>
                {extra > 0 && <em>+${extra}</em>}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="wj-seats__rule" />
      <div className="wj-seats__subtotal">
        <span>Seats Subtotal</span>
        <span className="wj-seats__subtotal-value">
          <span>{money(subtotal)}</span>
          <em>+${commission} commission</em>
        </span>
      </div>
    </section>
  );
}

function PriceBreakdown({ booking }) {
  const totals = calculateTotals(booking);
  const rows = [
    ["Fares", totals.fare],
    ["Bundle attributes", totals.bundle],
    ["Extras", totals.extras],
    ["Seats", totals.seats],
    ["Service charge", totals.service],
  ];
  return (
    <section className="wj-seats__price" aria-label="Price summary">
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{money(value)}</dd>
          </div>
        ))}
      </dl>
      <div className="wj-seats__price-rule" />
      <div className="wj-seats__price-total">
        <span>Total Price</span>
        <b data-testid="booking-total">{money(totals.total)}</b>
      </div>
      <div className="wj-seats__price-commission">
        <span>Commission</span>
        <b>{money(totals.commission)}</b>
      </div>
    </section>
  );
}

export function SeatsSummary({ booking, segments, heldFor = "12:30" }) {
  return (
    <aside className="wj-seats__aside">
      <SelectedSeats booking={booking} segments={segments} />
      <PriceBreakdown booking={booking} />
      <div className="wj-seats__held" role="status">
        <img src={asset("icon-clock-error-14.svg")} alt="" width="14" height="14" />
        <p>Offer held for {heldFor}</p>
      </div>
      <div className="wj-seats__promo">
        <img src={asset("seats-promo-relax.jpg")} alt="" width="60" height="90" />
        <div>
          <h3>More room to relax</h3>
          <p>Choose Extended Comfort for extra legroom and priority boarding.</p>
        </div>
      </div>
    </aside>
  );
}
