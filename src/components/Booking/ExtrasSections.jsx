import { useState } from "react";
import { comforts, meals, money } from "../../state/booking";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

const WEIGHT_OPTIONS = [
  { weight: 5, label: "+5 kg ($19)" },
  { weight: 10, label: "+10 kg ($38)" },
];
const MEAL_IMAGES = {
  poutine: "meal-poutine.jpg",
  salmon: "meal-salmon.jpg",
  wrap: "meal-wrap.jpg",
  beef: "meal-beef.jpg",
  bar: "meal-nanaimo-bar.png",
  kids: "meal-kids.jpg",
};

const weightCost = (weight) => (weight / 5) * 19;
const plural = (count, one, many, none) =>
  count === 0 ? none : `${count} ${count === 1 ? one : many}`;
const formatPhone = ({ countryCode, phone }) =>
  `${countryCode} ${String(phone).replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3")}`;

function Section({ title, icon, clipIcon = true, summary, price, rounded, children }) {
  const [open, setOpen] = useState(true);
  return (
    <section
      className={`wj-extras__section ${rounded ? "wj-extras__section--round" : ""}`}
      aria-label={title}
    >
      <div className="wj-extras__section-header">
        <div className="wj-extras__section-name">
          <span
            className={`wj-extras__section-icon ${clipIcon ? "wj-extras__section-icon--clip" : ""}`}
          >
            <img src={asset(icon)} alt="" width="24" height="24" />
          </span>
          <h2>{title}</h2>
          <span className="wj-extras__dot" aria-hidden="true">
            ·
          </span>
          <p>{summary}</p>
        </div>
        <div className="wj-extras__section-price">
          <b>{price}</b>
          <button
            type="button"
            className={`wj-extras__collapse ${open ? "" : "wj-extras__collapse--closed"}`}
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
            onClick={() => setOpen(!open)}
          >
            <img src={asset("icon-chevron-up-20.svg")} alt="" width="20" height="20" />
          </button>
        </div>
      </div>
      {open && children}
    </section>
  );
}

export function ExtrasBaggage({ traveller, fareName, weight, onWeight }) {
  const included =
    fareName === "PremiumFlex"
      ? "25 kg included"
      : fareName === "EconoFlex"
        ? "1 checked bag included"
        : "Carry-on included";
  return (
    <Section
      title="Baggage"
      icon="icon-luggage-24.svg"
      clipIcon={false}
      summary={weight ? "1 extra bag added" : "No extra bags"}
      price={money(weightCost(weight))}
    >
      <div className="wj-extras__table" role="table" aria-label="Baggage">
        <div className="wj-extras__table-head" role="row">
          <span role="columnheader">Passenger</span>
          <span role="columnheader">Included</span>
          <span role="columnheader">Add Extra Weight</span>
          <span role="columnheader">Cost</span>
        </div>
        <div className="wj-extras__table-row" role="row">
          <b role="cell">
            {traveller.firstName} {traveller.surname}
          </b>
          <span role="cell">{included}</span>
          <span role="cell" className="wj-extras__weights">
            {WEIGHT_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.weight}
                className={`wj-extras__weight ${weight === option.weight ? "wj-extras__weight--on" : ""}`}
                aria-pressed={weight === option.weight}
                onClick={() => onWeight(weight === option.weight ? 0 : option.weight)}
              >
                {option.label}
              </button>
            ))}
          </span>
          <b role="cell">{money(weightCost(weight))}</b>
        </div>
      </div>
    </Section>
  );
}

export function ExtrasMeals({ selected, onToggle }) {
  const total = meals
    .filter((meal) => selected.includes(meal.id))
    .reduce((sum, meal) => sum + meal.price, 0);
  return (
    <Section
      title="Meals"
      icon="icon-coffee-24.svg"
      summary={plural(selected.length, "meal selected", "meals selected", "No meals selected")}
      price={money(total)}
      rounded
    >
      <div className="wj-extras__meal-note">
        <img src={asset("icon-info-navy-16.svg")} alt="" width="16" height="16" />
        <p>
          Meals must be ordered at least 48 hours before departure. Availability
          is confirmed at payment.
        </p>
      </div>
      <div className="wj-extras__meals">
        {meals.map((meal) => {
          const added = selected.includes(meal.id);
          return (
            <article className="wj-extras__meal" key={meal.id}>
              <img
                className="wj-extras__meal-image"
                src={asset(MEAL_IMAGES[meal.id])}
                alt=""
              />
              <div className="wj-extras__meal-body">
                <div>
                  <h3>{meal.name}</h3>
                  <p>{meal.description}</p>
                </div>
                <b className="wj-extras__meal-price">Price: {money(meal.price)}</b>
                <button
                  type="button"
                  className={`wj-extras__meal-add ${added ? "wj-extras__meal-add--on" : ""}`}
                  aria-pressed={added}
                  aria-label={`${added ? "Added" : "Add"} ${meal.name}`}
                  onClick={() => onToggle(meal.id)}
                >
                  {added && (
                    <img src={asset("icon-check-white-16.svg")} alt="" width="16" height="12" />
                  )}
                  {added ? "Added" : "Add to Booking"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function ComfortRow({ name, description, price, priceClass = "", checked, disabled, onChange }) {
  return (
    <div className="wj-extras__comfort-row">
      <div className="wj-extras__comfort-details">
        <b>{name}</b>
        <p>{description}</p>
      </div>
      <span className={`wj-extras__comfort-price ${priceClass}`}>{price}</span>
      <button
        type="button"
        role="switch"
        className="wj-extras__toggle"
        aria-checked={checked}
        aria-label={name}
        disabled={disabled}
        onClick={() => onChange(!checked)}
      >
        <img
          src={asset(
            disabled ? "toggle-on-disabled.svg" : checked ? "toggle-on.svg" : "toggle-off.svg",
          )}
          alt=""
          width="36"
          height="20"
        />
      </button>
    </div>
  );
}

export function ExtrasComfort({ selected, premium, roundTrip, traveller, onToggle, onSms }) {
  const services = comforts.filter((comfort) => comfort.id !== "open" || roundTrip);
  const total = services
    .filter((comfort) => selected.includes(comfort.id))
    .reduce((sum, comfort) => sum + comfort.price, 0);
  const row = (comfort) => (
    <ComfortRow
      key={comfort.id}
      name={comfort.name}
      description={comfort.description}
      price={`${money(comfort.price)}${comfort.unit}`}
      checked={selected.includes(comfort.id)}
      onChange={() => onToggle(comfort.id)}
    />
  );
  return (
    <Section
      title="Comfort & Flexibility"
      icon="icon-shield-24.svg"
      summary={
        premium
          ? "PremiumFlex included in bundle"
          : plural(selected.length, "service selected", "services selected", "No services selected")
      }
      price={money(total)}
    >
      <div className="wj-extras__comfort">
        {premium && (
          <ComfortRow
            name="SunFlex"
            description="Change flight dates once free of charge, up to 24 hours before departure."
            price="Included"
            priceClass="wj-extras__comfort-price--included"
            checked
            disabled
            onChange={() => {}}
          />
        )}
        {services.filter((comfort) => comfort.id !== "open").map(row)}
        <ComfortRow
          name="SMS Notifications"
          description={`Flight status updates sent to ${formatPhone(traveller)}.`}
          price="Free"
          checked={traveller.sms}
          onChange={onSms}
        />
        {services.filter((comfort) => comfort.id === "open").map(row)}
      </div>
    </Section>
  );
}
