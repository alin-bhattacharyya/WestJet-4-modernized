import { useEffect, useRef, useState } from "react";
import { useBooking } from "../../state/useBooking";
import { calculateTotals } from "../../state/booking";
import { Actions } from "./shared";
import { TripSummary } from "./TripSummary";
import { PaymentSelectField, PaymentTextField } from "./PaymentFields";
import { asset } from "./PaymentData";
import {
  CorporateCardPanel,
  PersonalCardPanel,
  SplitPanel,
} from "./PaymentPanels";
import { FlightPassCard, FlightPassDetails } from "./PaymentFlightPass";
import { CancelNotice, PaymentSummaryCard } from "./PaymentSummary";
import "./PaymentStep.css";
import "./PaymentSide.css";

const METHODS = [
  "Travel Bank",
  "Corporate Card",
  "Personal Card",
  "Flight Pass",
  "Split Payment",
];
const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];

function validate(payment, totals) {
  if (!payment.agreed)
    return "Please agree to the booking terms and fare conditions.";
  if (payment.method === "Travel Bank" && totals.card > 0)
    return "Travel Bank does not cover this booking. Choose Split Payment or a card.";
  if (payment.method === "Personal Card") {
    const digits = payment.cardNumber.replace(/\s/g, "");
    if (
      !/^\d{13,19}$/.test(digits) ||
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry) ||
      !/^\d{3,4}$/.test(payment.cvc)
    )
      return "Enter a valid demo card number, expiry (MM/YY), and security code.";
  }
  return "";
}

function MethodCard({ method, selected, onSelect }) {
  const id = `wj-payment-method-${method.replace(/\s/g, "-").toLowerCase()}`;
  return (
    <label className={`wj-payment__method ${selected ? "is-selected" : ""}`}>
      <input
        type="radio"
        name="payment-method"
        value={method}
        checked={selected}
        onChange={() => onSelect(method)}
        aria-labelledby={id}
      />
      <span className="wj-payment__method-text">
        <span id={id}>{method}</span>
        <span>Choose method</span>
      </span>
      <img
        src={asset(selected ? "icon-radio-on.svg" : "icon-radio-off.svg")}
        alt=""
        width="20"
        height="20"
      />
    </label>
  );
}

export function PaymentStep({ onBack, onContinue }) {
  const { booking, update, notify } = useBooking();
  const payment = booking.payment;
  const totals = calculateTotals(booking);
  const [error, setError] = useState("");
  const errorRef = useRef(null);
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView?.({ block: "center" });
  }, [error]);
  const flightPass = payment.method === "Flight Pass";
  const set = (key, value) => {
    update("payment", { [key]: value });
    setError("");
  };
  const submit = (event) => {
    event.preventDefault();
    const message = validate(payment, totals);
    if (message) return setError(message);
    onContinue();
  };
  const info = (text) => notify?.(text);
  const panelProps = { payment, totals, set };
  const billing = (key, label, hint) => (
    <PaymentTextField
      label={label}
      hint={hint}
      value={payment[key]}
      onChange={(value) => set(key, value)}
    />
  );
  return (
    <>
      <div className="wj-payment__heading">
        <h1>Complete your payment</h1>
        <p>
          Apply your Travel Bank funds and pay the remainder with your saved
          corporate card.
        </p>
      </div>
      <div className="wj-payment">
        <form
          id="payment-form"
          className="wj-payment__main"
          onSubmit={submit}
          noValidate
        >
          <section className="wj-payment__card" aria-labelledby="wj-payment-method-title">
            <h2 id="wj-payment-method-title">Payment method</h2>
            <div className="wj-payment__methods" role="radiogroup" aria-labelledby="wj-payment-method-title">
              {METHODS.map((method) => (
                <MethodCard
                  key={method}
                  method={method}
                  selected={payment.method === method}
                  onSelect={(value) => set("method", value)}
                />
              ))}
            </div>
            {["Travel Bank", "Split Payment"].includes(payment.method) && (
              <SplitPanel {...panelProps} />
            )}
            {payment.method === "Corporate Card" && (
              <CorporateCardPanel {...panelProps} />
            )}
            {payment.method === "Personal Card" && (
              <PersonalCardPanel {...panelProps} />
            )}
            {flightPass && (
              <FlightPassCard
                onTerms={() =>
                  info(
                    "Flight Pass terms: one credit per one-way flight on eligible routes and fares. Credits expire Dec 31, 2027.",
                  )
                }
              />
            )}
          </section>
          {flightPass ? (
            <FlightPassDetails booking={booking} totals={totals} />
          ) : (
            <section className="wj-payment__section" aria-labelledby="wj-payment-billing">
              <h2 id="wj-payment-billing" className="wj-payment__section-title">
                Billing details
              </h2>
              <div className="wj-payment__grid">
                {billing("company", "Company", "Corporate billing entity")}
                {billing("contact", "Billing contact", "Contact for this booking")}
              </div>
              {billing("address", "Billing Address")}
              <div className="wj-payment__grid">
                {billing("city", "City")}
                <PaymentSelectField
                  label="Province"
                  value={payment.province}
                  options={PROVINCES}
                  onChange={(value) => set("province", value)}
                />
                {billing("postal", "Postal code")}
              </div>
            </section>
          )}
          <section className="wj-payment__section" aria-labelledby="wj-payment-terms">
            <h2 id="wj-payment-terms" className="wj-payment__section-title">
              Terms &amp; conditions
            </h2>
            <p className="wj-payment__terms-text">
              Review your itinerary, fare conditions and payment allocation.
              Complete Booking is the final step before confirmation.
            </p>
            <label className="wj-payment__agree">
              <input
                type="checkbox"
                checked={payment.agreed}
                onChange={(event) => set("agreed", event.target.checked)}
              />
              <span className="wj-payment__checkbox" aria-hidden="true">
                <img src={asset("icon-check-white-14.svg")} alt="" width="14" height="14" />
              </span>
              I agree to the booking terms and fare conditions.
            </label>
            {error && (
              <p ref={errorRef} role="alert" className="wj-payment__error">
                {error}
              </p>
            )}
          </section>
        </form>
        <aside className="wj-payment__side">
          <TripSummary title="Your Trip Summary" showPricing={false} />
          <PaymentSummaryCard totals={totals} flightPass={flightPass} />
          <CancelNotice
            onMore={() =>
              info(
                "Cancel within 24 hours of purchase for a full refund to the original form of payment.",
              )
            }
          />
        </aside>
      </div>
      <Actions
        wide
        onBack={onBack}
        form="payment-form"
        backLabel="Back to Extras"
        label="Complete booking"
      />
    </>
  );
}
