const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

const MANAGE = [
  ["Change flight", "Free with FlightPass — one change included", "icon-refresh-cw-19.svg", "warning", "search"],
  ["Add services", "Baggage, meals, seats, lounge", "icon-plus-circle-19.svg", "info", "extras"],
  ["Change seats", "Seats can be changed until check-in", "icon-refresh-ccw-19.svg", "teal", "seats"],
  ["Update passenger details", "Name corrections and documents", "icon-user-check-19.svg", "orange", "travellers"],
];

function ManageRow({ title, text, icon, tone, onClick, danger = false }) {
  return (
    <button
      type="button"
      className={`wj-confirmation__manage-row ${danger ? "is-danger" : ""}`}
      onClick={onClick}
    >
      <span className={`wj-confirmation__manage-icon wj-confirmation__manage-icon--${tone}`}>
        <img src={asset(icon)} alt="" width="19" height="19" />
      </span>
      <span className="wj-confirmation__manage-text">
        <b>{title}</b>
        <span>{text}</span>
      </span>
      <img
        src={asset(danger ? "icon-chevron-right-15-error.svg" : "icon-chevron-right-15.svg")}
        alt=""
        width="15"
        height="15"
      />
    </button>
  );
}

export function ManageBox({ onEdit, onCancel }) {
  return (
    <section className="wj-confirmation__manage" aria-labelledby="wj-confirmation-manage">
      <h2 id="wj-confirmation-manage">Manage this booking</h2>
      <div className="wj-confirmation__manage-list">
        {MANAGE.map(([title, text, icon, tone, screen]) => (
          <ManageRow
            key={title}
            title={title}
            text={text}
            icon={icon}
            tone={tone}
            onClick={() => onEdit(screen)}
          />
        ))}
        <ManageRow
          danger
          title="Cancel booking"
          text="Refund calculated under fare rules"
          icon="icon-alert-circle-19.svg"
          tone="error"
          onClick={onCancel}
        />
      </div>
    </section>
  );
}

export function FlightPassBalance({ credits, onView }) {
  return (
    <section className="wj-confirmation__balance" aria-labelledby="wj-confirmation-balance">
      <span className="wj-confirmation__balance-image">
        <img src={asset("confirmation-flight-pass.jpg")} alt="" />
      </span>
      <div className="wj-confirmation__balance-body">
        <h2 id="wj-confirmation-balance">Flight Pass Balance</h2>
        <p>
          <b>{credits} credits available for future business travel.</b> View usage and manage your
          company&apos;s Flight Pass benefits.
        </p>
        <button type="button" className="wj-confirmation__primary" onClick={onView}>
          View Flight Pass
        </button>
      </div>
    </section>
  );
}

export function HelpBox({ onTicket }) {
  return (
    <section className="wj-confirmation__help" aria-labelledby="wj-confirmation-help">
      <h2 id="wj-confirmation-help">Need help with your trip?</h2>
      <a href="tel:18777377001">
        <img src={asset("icon-phone-16.svg")} alt="" width="16" height="16" />
        1-877-737-7001
      </a>
      <a href="mailto:Support@WestJet.com">
        <img src={asset("icon-mail-16.svg")} alt="" width="16" height="16" />
        Support@WestJet.com
      </a>
      <button type="button" className="wj-confirmation__primary wj-confirmation__help-button" onClick={onTicket}>
        Open a support ticket
      </button>
    </section>
  );
}
