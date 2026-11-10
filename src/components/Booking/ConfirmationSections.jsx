import { directions, legSummary, money } from "../../state/booking";
import { cityName, dateRange, longDate, maskEmail, maskEmergency, maskPhone, paidOn, transactionId } from "./ConfirmationFormat";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

function Badge({ children }) {
  return (
    <span className="wj-confirmation__badge">
      <img src={asset("dot-success.svg")} alt="" width="8" height="8" />
      {children}
    </span>
  );
}

export function BookingConfirmedCard({ booking, reference }) {
  const { search, traveller } = booking;
  const oneWay = search.tripType === "One Way";
  return (
    <section className="wj-confirmation__hero" aria-labelledby="wj-confirmation-title">
      <span className="wj-confirmation__hero-image">
        <img src={asset("confirmation-calgary.png")} alt="" />
      </span>
      <div className="wj-confirmation__hero-body">
        <div className="wj-confirmation__hero-head">
          <h2 id="wj-confirmation-title">Booking confirmed</h2>
          <Badge>TICKETED</Badge>
        </div>
        <p className="wj-confirmation__trip">
          <img src={asset("icon-user-20.svg")} alt="" width="20" height="20" />
          <span>
            {traveller.firstName} {traveller.surname} · {cityName(search.origin)}{" "}
            {oneWay ? "→" : "⇄"} {cityName(search.destination)} ·{" "}
            {dateRange(search.departure, oneWay ? null : search.returnDate)}
          </span>
        </p>
        <p className="wj-confirmation__muted">
          {oneWay ? "Your flight is confirmed" : "Both outbound and return flights confirmed"} · Booking reference
        </p>
        <div className="wj-confirmation__reference">
          <p className="wj-confirmation__muted">Reference number</p>
          <p className="wj-confirmation__code">{reference}</p>
        </div>
      </div>
    </section>
  );
}

export function ConfirmedFlights({ booking }) {
  const { search } = booking;
  return (
    <section className="wj-confirmation__card wj-confirmation__flights" aria-labelledby="wj-confirmation-flights">
      <h2 id="wj-confirmation-flights">Confirmed flights</h2>
      <p className="wj-confirmation__flights-meta">
        {search.tripType === "One Way" ? "One way" : "Roundtrip"} · {booking.flights.outbound.fare} · 1 adult · All
        times local
      </p>
      {directions(booking).map((leg) => {
        const summary = legSummary(booking, leg);
        const outbound = leg === "outbound";
        return (
          <div className="wj-confirmation__segment" key={leg}>
            <div className="wj-confirmation__segment-head">
              <h3>
                {outbound ? "Outbound" : "Return"} · {longDate(outbound ? search.departure : search.returnDate)}
              </h3>
              <Badge>Confirmed</Badge>
            </div>
            <div className="wj-confirmation__segment-body">
              <div>
                <p>
                  {outbound ? search.origin : search.destination} →{" "}
                  {outbound ? search.destination : search.origin}
                </p>
                <p className="wj-confirmation__segment-meta">
                  <b>WestJet {summary.number}</b> · {summary.stops} · {summary.duration}
                </p>
              </div>
              <p className="wj-confirmation__segment-times">{summary.times}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function PaymentBox({ booking, totals, confirmation, reference, onInvoice }) {
  const { method } = booking.payment;
  const deduction =
    method === "Flight Pass"
      ? ["WestJet Canada Flex Flight Pass", totals.total]
      : totals.bank > 0
        ? ["Travel Bank", totals.bank]
        : null;
  const details = [
    ["Method", method],
    ["Transaction ID", transactionId(reference, confirmation?.date)],
    ["Paid on", paidOn(confirmation?.date)],
    ["Invoice", booking.payment.company],
  ];
  const charges = [
    ["Fares and bundle", totals.fare + totals.bundle],
    ["Extras", totals.extras],
    ["Seats", totals.seats],
    ["Service charge", totals.service],
  ];
  return (
    <section className="wj-confirmation__card wj-confirmation__box" aria-labelledby="wj-confirmation-payment">
      <div className="wj-confirmation__box-head">
        <h2 id="wj-confirmation-payment">Payment Summary</h2>
        <button type="button" onClick={onInvoice}>
          Download invoice
        </button>
      </div>
      <div className="wj-confirmation__payment">
        <dl className="wj-confirmation__pay-col">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <dl className="wj-confirmation__pay-col wj-confirmation__pay-col--charges">
          {charges.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{money(value)}</dd>
            </div>
          ))}
          {deduction && (
            <div className="wj-confirmation__deduction">
              <dt>{deduction[0]}</dt>
              <dd>{money(-deduction[1])}</dd>
            </div>
          )}
          <div className="wj-confirmation__pay-line" />
          <div className="wj-confirmation__paid">
            <dt>Total paid</dt>
            <dd>{money(totals.total - (deduction?.[1] || 0))}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function ContactBox({ traveller, onUpdate }) {
  const items = [
    ["Email:", maskEmail(traveller.email)],
    ["Mobile:", maskPhone(traveller.countryCode, traveller.phone)],
    ["Emergency:", maskEmergency(traveller.emergencyName, traveller.emergencyPhone)],
  ];
  return (
    <section className="wj-confirmation__card wj-confirmation__box" aria-labelledby="wj-confirmation-contact">
      <div className="wj-confirmation__box-head">
        <h2 id="wj-confirmation-contact">Contact details</h2>
        <button type="button" onClick={onUpdate}>
          Update contact details
        </button>
      </div>
      <div className="wj-confirmation__contact">
        {items.map(([label, value]) => (
          <p key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </p>
        ))}
      </div>
    </section>
  );
}
