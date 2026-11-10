import { code, directions } from "../../state/booking";
import { asset, FLIGHT_PASS_CREDITS } from "./PaymentData";


// "Toronto Pearson (YYZ)" -> "Toronto (YYZ)"
const cityLabel = (airport) => {
  const city = airport.replace(/\s*\([A-Z]{3}\)$/, "").split(" ")[0];
  return `${city} (${code(airport)})`;
};

export function FlightPassCard({ onTerms }) {
  return (
    <section className="wj-payment__pass" aria-label="WestJet Canada Flex Flight Pass">
      <span className="wj-payment__pass-image">
        <img src={asset("flight-pass-window.png")} alt="" />
      </span>
      <div className="wj-payment__pass-body">
        <span className="wj-payment__badge wj-payment__badge--lime">
          Flight Pass Number: WJ-458721
        </span>
        <h3>WestJet Canada Flex Flight Pass</h3>
        <div className="wj-payment__pass-details">
          <p className="wj-payment__pass-company">Company: North Studio</p>
          <p className="wj-payment__pass-status">
            Status
            <span className="wj-payment__badge wj-payment__badge--teal">
              Active
            </span>
          </p>
          <p className="wj-payment__pass-expiry">
            <span>Expires:</span>
            <span>Dec 31, 2027</span>
          </p>
        </div>
      </div>
      <div className="wj-payment__pass-actions">
        <span className="wj-payment__selected" role="status">
          <span className="wj-payment__selected-icon">
            <img
              src={asset("icon-check-white-button.svg")}
              alt=""
              width="15.7606"
              height="12.0976"
            />
          </span>
          Selected
        </span>
        <button type="button" className="wj-payment__terms-link" onClick={onTerms}>
          Terms and conditions
        </button>
      </div>
    </section>
  );
}

export function FlightPassDetails({ booking, totals }) {
  const routes = directions(booking).map((leg) =>
    leg === "outbound"
      ? [booking.search.origin, booking.search.destination]
      : [booking.search.destination, booking.search.origin],
  );
  const check = (
    <img src={asset("icon-check-teal-24.svg")} alt="" width="24" height="24" />
  );
  return (
    <div className="wj-payment__pass-row">
      <section className="wj-payment__box wj-payment__box--credits">
        <h3>Credits Balance</h3>
        <p className="wj-payment__credits-title">Available Credits</p>
        <div className="wj-payment__credit">
          <span>Remaining one-way flights</span>
          <span>{FLIGHT_PASS_CREDITS}</span>
        </div>
        <div className="wj-payment__credit">
          <span>Credits required for this booking</span>
          <span>{totals.credits}</span>
        </div>
        <div className="wj-payment__credit wj-payment__credit--total">
          <span>Remaining after booking</span>
          <span>{FLIGHT_PASS_CREDITS - totals.credits}</span>
        </div>
      </section>
      <section className="wj-payment__box">
        <h3>Eligibility Validation</h3>
        <ul className="wj-payment__checks">
          {routes.map(([from, to]) => (
            <li key={from}>
              {check}
              <span>Eligible Route</span>
              <span>
                {cityLabel(from)} → {cityLabel(to)}
              </span>
            </li>
          ))}
          <li>
            {check}
            <span>Eligible Fare Type</span>
            <span className="wj-payment__badge wj-payment__badge--navy">
              {booking.flights.outbound.fare}
            </span>
          </li>
          <li>
            {check}
            <span>Traveller Eligible</span>
            <span className="wj-payment__traveller">
              <img src={asset("icon-user-20.svg")} alt="" width="20" height="20" />
              {booking.traveller.firstName} {booking.traveller.surname}
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
