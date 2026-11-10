import { periods, wholeMoney } from "./FlightsModel";

const lower = (value) => value.toLowerCase();

function SavingsText({ summary, current }) {
  const best = summary.find((item) => item.best);
  if (!best || !current) {
    return "Prices are the lowest available per adult for the selected date, including taxes.";
  }
  const saving = current.price - best.from;
  if (current.period === best.id || saving <= 0) {
    return (
      <>
        Your selected flight is already in the lowest-priced time of day.{" "}
        Prices are the lowest available per adult for the selected date,
        including taxes.
      </>
    );
  }
  return (
    <>
      {`Moving this booking to the ${lower(best.id)} saves `}
      <b>{`${wholeMoney(saving)} per adult.`}</b>
      {" Prices are the lowest available per adult for the selected date, including taxes."}
    </>
  );
}

export function FlightsBestTime({
  origin,
  destination,
  summary,
  period,
  current,
  onPeriod,
  onReset,
}) {
  return (
    <section className="wj-flights__best" aria-label="Best time to fly">
      <div className="wj-flights__best-header">
        <h2>
          Best time to fly ({origin} → {destination})
        </h2>
        <button type="button" className="wj-flights__text-button" onClick={onReset}>
          All Items
        </button>
      </div>
      <div className="wj-flights__time-cards">
        {summary
          .filter((item) => item.id !== "Night")
          .map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={period === item.id}
              className={`wj-flights__time-card ${period === item.id ? "is-active" : ""}`}
              onClick={() => onPeriod(period === item.id ? "all" : item.id)}
            >
              <span className="wj-flights__time-card-row">
                <span className="wj-flights__time-card-tag">
                  <b>{item.id}</b>
                  {item.best && <em>Best</em>}
                </span>
                <small>{periods.find((p) => p.id === item.id).hours}</small>
              </span>
              <span className="wj-flights__time-card-row wj-flights__time-card-row--price">
                <strong className={item.best ? "is-best" : ""}>
                  {item.count ? `from ${wholeMoney(item.from)}` : "No flights"}
                </strong>
                <small>
                  {item.count} {item.count === 1 ? "flight" : "flights"}
                </small>
              </span>
            </button>
          ))}
      </div>
      <p className="wj-flights__savings">
        <img src={`${import.meta.env.BASE_URL}figma-assets/v3/icon-info-navy-16.svg`} alt="" width="16" height="16" />
        <span>
          <SavingsText summary={summary} current={current} />
        </span>
      </p>
    </section>
  );
}
