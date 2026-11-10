import { discoverPasses, helpTopics, passAsset } from "./flightPassData";
import "./FlightPassSections.css";

const columns = [
  "Booking date",
  "Route",
  "Travel date",
  "Booking ref",
  "Booking status",
  "Credits redeemed",
  "Trip",
];

export function RedemptionActivity({ pass, notify }) {
  return (
    <section className="wj-pass__activity" aria-labelledby="wj-pass-activity-title">
      <div className="wj-pass__section-header">
        <h2 id="wj-pass-activity-title" className="wj-pass__section-title">
          Redemption activity
        </h2>
        <p className="wj-pass__section-note">
          {pass.name} · {pass.redeemed} credits redeemed
        </p>
      </div>
      <table className="wj-pass__table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pass.activity.map(([booked, route, travel, reference, status, credits]) => (
            <tr key={reference}>
              <td>{booked}</td>
              <td className="wj-pass__strong">{route}</td>
              <td>{travel}</td>
              <td className="wj-pass__strong">{reference}</td>
              <td>{status}</td>
              <td>{credits}</td>
              <td>
                <button
                  type="button"
                  className="wj-pass__link"
                  aria-label={`View trip ${reference}`}
                  onClick={() =>
                    notify(
                      `Booking ${reference} (${route}, ${travel}) is a sample Flight Pass booking. Contact your travel administrator to manage it.`,
                    )
                  }
                >
                  View trip
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="wj-pass__small">
        Credits redeemed show bookings made with this pass. Booking status is shown separately
        and does not change your balance. Credit treatment after a change or cancellation
        depends on the pass terms.
      </p>
    </section>
  );
}

export function PassHelp({ notify }) {
  return (
    <aside className="wj-pass__help" aria-labelledby="wj-pass-help-title">
      <h2 id="wj-pass-help-title" className="wj-pass__section-title">
        Need help with your pass?
      </h2>
      <p className="wj-pass__help-lead">Quick answers about credits, eligibility and changes.</p>
      {helpTopics.map(([label, answer]) => (
        <button
          key={label}
          type="button"
          className="wj-pass__help-link"
          onClick={() => notify(`${label} ${answer}`)}
        >
          <span>{label}</span>
          <img src={passAsset("pass-icon-chev-16.svg")} alt="" width="16" height="16" />
        </button>
      ))}
    </aside>
  );
}

export function DiscoverPasses({ onBook, notify }) {
  return (
    <section className="wj-pass__discover" aria-labelledby="wj-pass-discover-title">
      <div className="wj-pass__discover-header">
        <div className="wj-pass__discover-heading">
          <h2 id="wj-pass-discover-title" className="wj-pass__section-title">
            Discover your next Flight Pass
          </h2>
          <p>
            Explore passes for other routes. Each pass keeps its own credits and expiry date.
          </p>
        </div>
        <button
          type="button"
          className="wj-pass__link"
          onClick={() =>
            notify(
              "All Flight Passes: contact your travel administrator to compare and buy passes for your company.",
            )
          }
        >
          View all Flight Passes
          <img src={passAsset("pass-icon-chev-16.svg")} alt="" width="16" height="16" />
        </button>
      </div>
      <div className="wj-pass__cards">
        {discoverPasses.map((item) => (
          <article key={item.name} className="wj-pass__card">
            <img className="wj-pass__card-image" src={passAsset(item.image)} alt="" />
            <div className="wj-pass__card-body">
              <h3>{item.name}</h3>
              <p>{item.coverage}</p>
              <dl className="wj-pass__card-facts">
                {[
                  ["Credit bundle", item.credits],
                  ["Validity", "12 months"],
                  ["Price", "[Price TBC]"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                className="wj-pass__button wj-pass__button--outline wj-pass__button--block"
                aria-label={`Explore pass: ${item.name}`}
                onClick={onBook}
              >
                Explore pass
                <img src={passAsset("pass-icon-arrow-16.svg")} alt="" width="16" height="16" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
