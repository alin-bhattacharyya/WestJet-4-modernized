import { money } from "../../state/booking";
import { asset } from "./PaymentData";

export function PaymentSummaryCard({ totals, flightPass }) {
  const charges = [
    ["Fares", money(totals.fare)],
    ["Bundle attributes", money(totals.bundle)],
    ["Extras", money(totals.extras)],
    ["Seats", money(totals.seats)],
    ["Service charge", money(totals.service)],
    ...(flightPass
      ? [
          ["Flight Cost", "Covered by Flight Pass"],
          ["Taxes & Fees", "Included"],
        ]
      : []),
  ];
  const title = flightPass ? "Cost Summary" : "Payment Summary";
  return (
    <section
      className={`wj-payment__summary ${flightPass ? "wj-payment__summary--pass" : ""}`}
      aria-labelledby="wj-payment-summary-title"
    >
      <h2 id="wj-payment-summary-title">{title}</h2>
      <dl className="wj-payment__summary-rows">
        {charges.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="wj-payment__summary-line" />
      <div className="wj-payment__summary-total">
        <span>{flightPass ? "Amount Due" : "Total Price"}</span>
        <b data-testid="payment-total">
          {money(flightPass ? totals.due : totals.total)}
        </b>
      </div>
      <div className="wj-payment__summary-commission">
        <span>Commission</span>
        <b>{money(totals.commission)}</b>
      </div>
    </section>
  );
}

export function CancelNotice({ onMore }) {
  return (
    <aside className="wj-payment__notice">
      <img src={asset("icon-info-20.svg")} alt="" width="20" height="20" />
      <div>
        <p className="wj-payment__notice-title">
          Cancel within 24 hours of purchase without penalty.
        </p>
        <p className="wj-payment__notice-text">
          You will receive a full refund if you change your mind.{"  "}
          <button type="button" onClick={onMore}>
            Find out more
          </button>
        </p>
      </div>
    </aside>
  );
}
