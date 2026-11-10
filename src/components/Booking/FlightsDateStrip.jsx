import { useState } from "react";
import { datePrice, money } from "../../state/booking";
import { addDays, stripLabel } from "./FlightsModel";

export function FlightsDateStrip({ label, anchor, selected, earliest, onSelect }) {
  const [start, setStart] = useState(() => addDays(anchor, -2));
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  return (
    <div className="wj-flights__dates">
      <button
        type="button"
        className="wj-flights__date-arrow"
        aria-label="Previous dates"
        onClick={() => setStart(addDays(start, -7))}
      >
        <img src={`${import.meta.env.BASE_URL}figma-assets/v3/icon-chevron-left-20-teal.svg`} alt="" width="20" height="20" />
      </button>
      <div className="wj-flights__date-tabs" role="group" aria-label={label}>
        {days.map((date) => {
          const price = datePrice(date);
          const unavailable = price === null || (earliest && date < earliest);
          return (
            <button
              type="button"
              key={date}
              aria-pressed={date === selected}
              disabled={unavailable}
              className={`wj-flights__date ${date === selected ? "is-active" : ""}`}
              onClick={() => onSelect(date)}
            >
              <span className="wj-flights__date-text">
                <span className="wj-flights__date-day">{stripLabel(date)}</span>
                <span className="wj-flights__date-price">
                  {unavailable ? "-" : money(price)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="wj-flights__date-arrow"
        aria-label="Next dates"
        onClick={() => setStart(addDays(start, 7))}
      >
        <img src={`${import.meta.env.BASE_URL}figma-assets/v3/icon-chevron-right-20-teal.svg`} alt="" width="20" height="20" />
      </button>
    </div>
  );
}
