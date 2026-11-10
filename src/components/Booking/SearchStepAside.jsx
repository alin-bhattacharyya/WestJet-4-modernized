const POLICY_REMINDERS = [
  "Preferred carrier: WestJet",
  "Economy cabin · Econo fare or above",
  "Roundtrip limit: CAD 800 per traveller",
  "Book at least 7 days ahead",
  "No approval required within policy",
];

export function SearchStepAside() {
  return (
    <aside className="wj-search__aside">
      <section className="wj-search__benefits" aria-labelledby="wj-search-benefits">
        <div className="wj-search__benefits-title">
          <h2 id="wj-search-benefits">Corporate benefits</h2>
          <span className="wj-search__briefcase" aria-hidden="true">
            <img
              src={`${import.meta.env.BASE_URL}figma-assets/v3/icon-briefcase-white.svg`}
              alt=""
              width="18.3682"
              height="16.7"
            />
          </span>
        </div>
        <dl className="wj-search__benefit-rows">
          <div>
            <dt>Base-fare discount</dt>
            <dd>10%</dd>
          </div>
          <div>
            <dt>Travel Bank available</dt>
            <dd>CAD 250</dd>
          </div>
        </dl>
        <p className="wj-search__benefits-note">
          Corporate discounts are applied automatically to eligible fares.
          Discount applies to base fare only. Taxes and fees are shown
          separately.
        </p>
      </section>
      <section className="wj-search__policy" aria-labelledby="wj-search-policy">
        <h2 id="wj-search-policy">Travel policy reminders</h2>
        <ul>
          {POLICY_REMINDERS.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </section>
      <section className="wj-search__promo">
        <img
          className="wj-search__promo-image"
          src={`${import.meta.env.BASE_URL}figma-assets/v3/home-promo-corporate.png`}
          alt=""
        />
        <div className="wj-search__promo-copy">
          <h2>Unlock Exclusive Corporate Fares</h2>
          <p>
            Save more on business travel with preferred corporate rates,
            flexible booking options, and enhanced traveler benefits.
          </p>
        </div>
        <div className="wj-search__promo-action">
          <button type="button">View details</button>
        </div>
      </section>
    </aside>
  );
}
