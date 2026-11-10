// Left (wide) column of the home dashboard.
import { useState } from "react";
import { activities, asset, paymentOptions } from "./dashboardData";
import { ActionButton, ListRow, StatusBadge, TextButton } from "./DashboardParts";

export function UpcomingTrip({ onManage }) {
  return (
    <section className="wj-home__panel wj-home__upcoming" aria-labelledby="wj-home-upcoming">
      <header className="wj-home__panel-header">
        <h2 id="wj-home-upcoming">Upcoming trip</h2>
        <TextButton onClick={onManage}>Manage Trip</TextButton>
      </header>
      <article className="wj-home__trip-hero">
        <div className="wj-home__trip-top">
          <span>Upcoming trip · Confirmed · Econo</span>
          <img src={asset("icon-plane-white-20.svg")} alt="" width="17.34" height="17.34" />
        </div>
        <h3>Toronto ⇄ Vancouver</h3>
        <p className="wj-home__trip-route">YYZ → YVR · 27 Oct 2026 · Return 29 Oct 2026</p>
        <p className="wj-home__trip-meta">WestJet · Maya Thompson · All times local</p>
        <p className="wj-home__trip-price">
          <b>CAD 684</b> <span>roundtrip, taxes included</span>
        </p>
      </article>
    </section>
  );
}

export function SummerPromo({ onDetails }) {
  return (
    <section className="wj-home__summer" aria-label="Early Summer 2026 Campaign">
      <div>
        <h2>Early Summer 2026 Campaign</h2>
        <p>Earn 2% extra commission on AYT/DLM/BJV bookings until 30 April. Terms apply.</p>
      </div>
      <ActionButton onClick={onDetails}>View details</ActionButton>
    </section>
  );
}

export function PaymentOptions({ onManage, onSelect }) {
  return (
    <section className="wj-home__card wj-home__payments" aria-labelledby="wj-home-payments">
      <header className="wj-home__panel-header">
        <h2 id="wj-home-payments">Payment options</h2>
        <TextButton onClick={onManage}>Manage</TextButton>
      </header>
      <div className="wj-home__rows">
        {paymentOptions.map((option) => (
          <ListRow
            key={option.name}
            icon="icon-credit-card-19.svg"
            title={option.name}
            onClick={() => onSelect(option.name)}
          >
            {option.badge ? <StatusBadge>{option.badge}</StatusBadge> : <small>{option.detail}</small>}
          </ListRow>
        ))}
      </div>
    </section>
  );
}

export function RecentActivity() {
  const [filter, setFilter] = useState("");
  const visible = activities.filter((item) =>
    `${item.title} ${item.detail}`.toLowerCase().includes(filter.trim().toLowerCase()),
  );
  return (
    <section className="wj-home__activity" aria-labelledby="wj-home-activity">
      <header className="wj-home__activity-header">
        <div>
          <h2 id="wj-home-activity">Recent Activity</h2>
          <p>Last Month</p>
        </div>
        <label className="wj-home__filter">
          <input
            aria-label="Filter activity"
            placeholder="Filter activity..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          <img src={asset("icon-search-16.svg")} alt="" width="16" height="16" />
        </label>
      </header>
      <ol className="wj-home__activity-list">
        {visible.map((item) => (
          <li key={item.title}>
            <img src={asset(`activity-indicator-${item.tone}.svg`)} alt="" width="32" height="32" />
            <div>
              <b>{item.title}</b>
              <span>{item.detail}</span>
            </div>
            <span className="wj-home__pill">{item.time}</span>
          </li>
        ))}
        {!visible.length && <li className="wj-home__empty">No activity matches “{filter}”.</li>}
      </ol>
    </section>
  );
}
