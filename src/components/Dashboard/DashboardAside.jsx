// Right (narrow) column of the home dashboard.
import { alertTotal, alerts, quickActions } from "./dashboardData";
import { ActionButton, ListRow, TextButton } from "./DashboardParts";
import "./DashboardAside.css";

export function CorporatePromo({ onDetails }) {
  return (
    <section className="wj-home__corporate" aria-labelledby="wj-home-corporate">
      <div>
        <h2 id="wj-home-corporate">Unlock Exclusive Corporate Fares</h2>
        <p>
          Save more on business travel with preferred corporate rates, flexible booking options, and
          enhanced traveler benefits.
        </p>
      </div>
      <ActionButton variant="outline" onClick={onDetails}>
        View details
      </ActionButton>
    </section>
  );
}

export function Alerts({ onViewAll, onSelect }) {
  return (
    <section className="wj-home__card wj-home__alerts" aria-labelledby="wj-home-alerts">
      <header className="wj-home__panel-header">
        <h2 id="wj-home-alerts">Disruptions &amp; Alerts</h2>
        <TextButton onClick={onViewAll} aria-label={`View all ${alertTotal} alerts`}>
          <span className="wj-home__count">{alertTotal}</span>
          View All
        </TextButton>
      </header>
      <div className="wj-home__rows">
        {alerts.map((alert) => (
          <ListRow
            key={alert.title}
            icon={alert.icon}
            tone={alert.tone}
            title={alert.title}
            onClick={() => onSelect(alert)}
          >
            <small>{alert.detail}</small>
          </ListRow>
        ))}
      </div>
    </section>
  );
}

export function FlightPassBalance({ onView }) {
  return (
    <section className="wj-home__pass" aria-labelledby="wj-home-pass">
      <span className="wj-home__pass-image" aria-hidden="true" />
      <div>
        <h2 id="wj-home-pass">Flight Pass Balance</h2>
        <p>
          <b>18 credits available for future business travel.</b> View usage and manage your
          company&apos;s Flight Pass benefits.
        </p>
        <ActionButton onClick={onView}>View Flight Pass</ActionButton>
      </div>
    </section>
  );
}

export function QuickActions({ onAction }) {
  return (
    <section className="wj-home__quick" aria-labelledby="wj-home-quick">
      <h2 id="wj-home-quick">Quick Actions</h2>
      <div className="wj-home__quick-grid">
        {quickActions.map((column) => (
          <div key={column[0]}>
            {column.map((label) => (
              <ActionButton
                key={label}
                variant="outline"
                onClick={() => onAction(label)}
              >
                {label}
              </ActionButton>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function TierProgress({ onInvoice }) {
  return (
    <section className="wj-home__card wj-home__tier" aria-labelledby="wj-home-tier">
      <header>
        <h2 id="wj-home-tier">Tier Progress</h2>
        <span className="wj-home__pill">Silver</span>
      </header>
      <div className="wj-home__tier-box">
        <b>3 bookings from Gold</b>
        <div
          className="wj-home__tier-bar"
          role="progressbar"
          aria-label="Progress to Gold"
          aria-valuenow={72}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span />
        </div>
        <div className="wj-home__tier-labels">
          <span>$500 more to unlock</span>
          <span>72%</span>
        </div>
      </div>
      <ActionButton variant="outline" onClick={onInvoice}>
        Download Invoice
      </ActionButton>
    </section>
  );
}
