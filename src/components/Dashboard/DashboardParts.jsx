// Shared V3 building blocks for the home dashboard and My trips.
import { asset } from "./dashboardData";

export function TextButton({ children, className = "", ...props }) {
  return (
    <button type="button" className={`wj-home__text-button ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ActionButton({ children, variant = "primary", className = "", ...props }) {
  return (
    <button
      type="button"
      className={`wj-home__action wj-home__action--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const badgeTone = { Confirmed: "success", "On Hold": "neutral", Canceled: "error", Available: "success" };
const badgeDot = { success: "dot-success.svg", neutral: "dot-neutral.svg", error: "dot-error.svg" };

export function StatusBadge({ children }) {
  const tone = badgeTone[children] || "neutral";
  return (
    <span className={`wj-home__badge wj-home__badge--${tone}`}>
      <img src={asset(badgeDot[tone])} alt="" width="8" height="8" />
      {children}
    </span>
  );
}

export function ListRow({ icon, tone = "teal", title, children, onClick, label }) {
  return (
    <button type="button" className="wj-home__row" onClick={onClick} aria-label={label}>
      <span className={`wj-home__row-icon wj-home__row-icon--${tone}`}>
        <img src={asset(icon)} alt="" width="19" height="19" />
      </span>
      <span className="wj-home__row-text">
        <b>{title}</b>
        {children}
      </span>
      <img src={asset("icon-chevron-right-15.svg")} alt="" width="15" height="15" />
    </button>
  );
}

const columns = [
  ["Passenger", 251],
  ["Route", 260],
  ["Flight", 224],
  ["Date", 168],
  ["Status", 168],
  ["", 68],
];

export function TripsTable({ title, trips, onViewAll, viewAllLabel = "View All", onRowAction }) {
  const headingId = `wj-trips-${title.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <section className="wj-home__table-card" aria-labelledby={headingId}>
      <header className="wj-home__table-header">
        <h2 id={headingId}>{title}</h2>
        {onViewAll && <TextButton onClick={onViewAll}>{viewAllLabel}</TextButton>}
      </header>
      <div className="wj-home__table-scroll">
        <table className="wj-home__table">
          <colgroup>
            {columns.map(([name, width]) => (
              <col key={name || "actions"} style={{ width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map(([name]) => (
                <th key={name || "actions"} scope="col">
                  {name === "Date" ? (
                    <span className="wj-home__sort">
                      Date
                      <img src={asset("icon-arrow-down-16.svg")} alt="" width="16" height="16" />
                    </span>
                  ) : name ? (
                    name
                  ) : (
                    <span className="sr-only">Actions</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={`${trip.flight}-${trip.passenger}`}>
                <td className="wj-home__cell-strong">{trip.passenger}</td>
                <td>{trip.route}</td>
                <td className="wj-home__cell-strong">{trip.flight}</td>
                <td>{trip.date}</td>
                <td>
                  <StatusBadge>{trip.status}</StatusBadge>
                </td>
                <td className="wj-home__cell-action">
                  <button
                    type="button"
                    aria-label={`Trip actions for ${trip.passenger}`}
                    onClick={() => onRowAction(trip)}
                  >
                    <img src={asset("icon-more-vertical-20.svg")} alt="" width="20" height="20" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
