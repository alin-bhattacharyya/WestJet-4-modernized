import { useState } from "react";
import { fares } from "../../state/booking";
import { wholeMoney } from "./FlightsModel";
import "./FlightsFarePanel.css";

const descriptions = {
  Economy:
    "Great value with a standard seat, a carry-on bag and the option to add flexibility and checked bags.",
  Premium:
    "Comfort, value and elevated guest service. Includes a seat with extra legroom, 2 checked bags, priority check-in and more.",
};

function CompareTable({ bundles }) {
  const features = [...new Set(bundles.flatMap((fare) => fare.features))];
  return (
    <table className="wj-flights__compare">
      <thead>
        <tr>
          <th scope="col">Included</th>
          {bundles.map((fare) => (
            <th scope="col" key={fare.name}>
              {fare.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {features.map((feature) => (
          <tr key={feature}>
            <th scope="row">{feature}</th>
            {bundles.map((fare) => (
              <td key={fare.name}>{fare.features.includes(feature) ? "Yes" : "-"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function FlightsFarePanel({
  cabin,
  flight,
  allowedFares,
  selectedFare,
  onSelect,
  onShowAllFares,
}) {
  const [comparing, setComparing] = useState(false);
  const cabinFares = fares.filter((fare) => fare.cabin === cabin);
  const bundles = cabinFares.filter((fare) =>
    allowedFares.some((allowed) => allowed.name === fare.name),
  );
  return (
    <section
      className="wj-flights__panel"
      aria-label={`${cabin} fares for ${flight.time} flight`}
    >
      <div className="wj-flights__panel-header">
        <div>
          <h3>{cabin}</h3>
          <p>{descriptions[cabin]}</p>
        </div>
        <button
          type="button"
          className="wj-flights__text-button"
          disabled={bundles.length < 2}
          aria-pressed={comparing}
          onClick={() => setComparing(!comparing)}
        >
          Compare
        </button>
      </div>
      <div className="wj-flights__bundles">
        {bundles.map((fare) => {
          const chosen = selectedFare === fare.name;
          return (
            <div key={fare.name} className={`wj-flights__bundle ${chosen ? "is-selected" : ""}`}>
              <h4>{fare.name}</h4>
              <p className="wj-flights__bundle-price">
                <strong>{wholeMoney(flight.price + fare.extra)}</strong>
                <span>/ per person</span>
              </p>
              <ul>
                {fare.features.map((feature) => (
                  <li key={feature}>
                    <img src={`${import.meta.env.BASE_URL}figma-assets/v3/icon-check-teal-24.svg`} alt="" width="24" height="24" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="wj-flights__bundle-footer">
                <button
                  type="button"
                  aria-pressed={chosen}
                  onClick={() => onSelect(fare.name)}
                >
                  {chosen ? "Selected" : "Select"}
                  <span className="sr-only">{` ${fare.name}`}</span>
                </button>
                <p>{fare.seatsLeft} seat(s) left at this price</p>
              </div>
            </div>
          );
        })}
        {bundles.length === 0 && (
          <div className="wj-flights__panel-empty">
            <p>
              {cabinFares.map((fare) => fare.name).join(" and ")}{" "}
              {cabinFares.length > 1 ? "are" : "is"} hidden by the Fare filter.
            </p>
            <button type="button" className="wj-flights__text-button" onClick={onShowAllFares}>
              Show all fares
            </button>
          </div>
        )}
      </div>
      {comparing && bundles.length > 1 && <CompareTable bundles={bundles} />}
    </section>
  );
}
