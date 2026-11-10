import { useState } from "react";

const benefits = [
  "A negotiated corporate discount on eligible WestJet base fares.",
  "Flexible changes and same-day standby on EconoFlex and PremiumFlex fares.",
  "Travel Bank credits and consolidated invoicing for Northstar Studio.",
];

export function FlightsPromo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="wj-flights__promo-wrap">
      <div className="wj-flights__promo">
        <img src={`${import.meta.env.BASE_URL}figma-assets/v3/promo-corporate-benefits.png`} alt="" />
        <div className="wj-flights__promo-text">
          <h3>Corporate Travel Benefits</h3>
          <p>
            Enjoy preferred business fares, flexible booking options, and exclusive
            savings designed for your organization.
          </p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="wj-flights-benefits"
          onClick={() => setOpen(!open)}
        >
          {open ? "Show less" : "Learn more"}
        </button>
      </div>
      {open && (
        <ul id="wj-flights-benefits" className="wj-flights__benefits">
          {benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
