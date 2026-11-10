import { Fragment } from "react";
import "./LoadingModal.css";

// Body copy is split where the Figma frames break the line.

const messages = {
  flights: [
    "Finding the Best Available Flights",
    [
      "We're searching available options, applying corporate fares, and checking eligible travel benefits for",
      "your itinerary.",
    ],
  ],
  payment: [
    "Preparing Your Payment Options",
    [
      "We're validating your corporate benefits, available balances, and eligible payment methods for",
      "this booking.",
    ],
  ],
  booking: [
    "Creating your Order",
    [
      "We're securing your reservation, issuing your ticket, and preparing your trip details.",
    ],
  ],
};

export function LoadingModal({ type = "flights" }) {
  const message = messages[type];
  return (
    <div
      className="wj-loading"
      role="status"
      aria-live="polite"
      aria-label={message ? undefined : "Loading"}
    >
      <div className="wj-loading__card">
        <span className="wj-loading__ring">
          <img src={`${import.meta.env.BASE_URL}figma-assets/v3/loading-ring.svg`} alt="" width="160" height="160" />
        </span>
        {message && (
          <div className="wj-loading__text">
            <h2>{message[0]}</h2>
            <p>
              {message[1].map((line, index) => (
                <Fragment key={line}>
                  {index > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
