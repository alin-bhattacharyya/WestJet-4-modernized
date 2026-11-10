import { passAsset, remaining } from "./flightPassData";
import "./FlightPassSummary.css";

export function StatusChip({ status }) {
  const expired = status === "expired";
  return (
    <span className={`wj-pass__chip${expired ? " wj-pass__chip--expired" : ""}`}>
      <img
        src={passAsset(expired ? "pass-icon-clock-14.svg" : "pass-icon-check-14.svg")}
        alt=""
        width="14"
        height="14"
      />
      {expired ? "Expired" : "Active"}
    </span>
  );
}

function Fact({ icon, label, value }) {
  return (
    <div className="wj-pass__fact">
      <span className="wj-pass__fact-icon">
        <img src={passAsset(icon)} alt="" width="16" height="16" />
      </span>
      <div className="wj-pass__fact-text">
        <span>{label}</span>
        <b>{value}</b>
      </div>
    </div>
  );
}

export function PassSummary({ pass, onBook, onDetails }) {
  const left = remaining(pass);
  const expired = pass.status === "expired";
  const percent = (pass.redeemed / pass.total) * 100;
  return (
    <div className="wj-pass__summary">
      <div className="wj-pass__balance">
        <div className="wj-pass__balance-top">
          <span className="wj-pass__balance-label">
            {expired ? "Credits unused at expiry" : "Credits remaining"}
          </span>
          <div className="wj-pass__balance-number">
            <span className="wj-pass__balance-value">{left}</span>
            <span className="wj-pass__balance-total">of {pass.total} credits</span>
          </div>
        </div>
        <div className="wj-pass__usage">
          <div className="wj-pass__usage-labels">
            <span>
              {pass.redeemed} of {pass.total} credits redeemed
            </span>
            <span className="wj-pass__usage-left">
              {expired ? "Expired" : `${left} remaining`}
            </span>
          </div>
          <div
            className="wj-pass__usage-bar"
            role="progressbar"
            aria-label="Credits redeemed"
            aria-valuemin={0}
            aria-valuemax={pass.total}
            aria-valuenow={pass.redeemed}
          >
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
      <div className="wj-pass__info">
        <div className="wj-pass__info-title">
          <h3>{pass.name}</h3>
          <StatusChip status={pass.status} />
        </div>
        <p className="wj-pass__info-ref">Pass reference {pass.reference}</p>
        <div className="wj-pass__facts">
          <Fact icon="pass-icon-pin-16.svg" label="Where you can use it" value={pass.region} />
          <Fact
            icon="pass-icon-cal-16.svg"
            label="Valid"
            value={`${pass.validFrom} – ${pass.expires}`}
          />
          <Fact
            icon="pass-icon-clock-16.svg"
            label={expired ? "Expired" : "Expires"}
            value={pass.expires}
          />
          <Fact
            icon="pass-icon-ticket-16.svg"
            label="Credits"
            value={`${pass.redeemed} redeemed of ${pass.total} original`}
          />
        </div>
        <div className="wj-pass__actions">
          <button
            type="button"
            className="wj-pass__button wj-pass__button--primary"
            onClick={onBook}
            disabled={expired}
          >
            Book with this pass
            <img src={passAsset("pass-icon-arrow-white-16.svg")} alt="" width="16" height="16" />
          </button>
          <button
            type="button"
            className="wj-pass__button wj-pass__button--outline"
            onClick={onDetails}
          >
            View pass details
          </button>
        </div>
        <p className="wj-pass__note">
          {expired
            ? `This pass expired on ${pass.expires}. Unused credits can no longer be redeemed.`
            : "Redeemed credits count bookings made with this pass. They do not show completed journeys."}
        </p>
      </div>
    </div>
  );
}

const Check = ({ className }) => (
  <img
    className={className}
    src={passAsset("pass-icon-check-teal-14.svg")}
    alt=""
    width="14"
    height="14"
  />
);

export function PassDetails({ pass, onTerms, ref }) {
  const rules = [
    "Use credits on this pass’s eligible routes",
    "Use credits before the expiry date",
    "Balances are kept separately for each pass",
  ];
  return (
    <section
      ref={ref}
      tabIndex={-1}
      className="wj-pass__details"
      aria-labelledby="wj-pass-details-title"
    >
      <div className="wj-pass__details-header">
        <h3 id="wj-pass-details-title">Pass details</h3>
        <span>
          {pass.name} · {pass.reference}
        </span>
      </div>
      <div className="wj-pass__columns">
        <div className="wj-pass__column">
          <h4>Eligible routes</h4>
          <ul className="wj-pass__list">
            {pass.routes.map((route) => (
              <li key={route} className="wj-pass__route">
                <Check />
                {route}
              </li>
            ))}
          </ul>
          <p className="wj-pass__small">Sample routes for demonstration only.</p>
        </div>
        <div className="wj-pass__column">
          <h4>Validity and balance</h4>
          {[
            ["Valid from", pass.validFrom],
            [pass.status === "expired" ? "Expired" : "Expires", pass.expires],
            [
              "Credit balance",
              `${remaining(pass)} ${pass.status === "expired" ? "unused" : "remaining"} · ${pass.redeemed} redeemed · ${pass.total} original`,
            ],
          ].map(([label, value]) => (
            <div key={label} className="wj-pass__row">
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </div>
        <div className="wj-pass__column">
          <h4>What is a credit?</h4>
          <p className="wj-pass__body">
            A credit is the unit your pass uses when you book an eligible flight. Each pass
            keeps its own credit balance.
          </p>
          <p className="wj-pass__small">
            [Credits needed per booking: to be confirmed from the Flight Pass terms]
          </p>
        </div>
        <div className="wj-pass__column">
          <h4>Rules at a glance</h4>
          <ul className="wj-pass__list">
            {rules.map((rule) => (
              <li key={rule} className="wj-pass__rule">
                <Check />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="wj-pass__link" onClick={onTerms}>
            Read full terms
            <img src={passAsset("pass-icon-chev-16.svg")} alt="" width="16" height="16" />
          </button>
        </div>
      </div>
    </section>
  );
}
