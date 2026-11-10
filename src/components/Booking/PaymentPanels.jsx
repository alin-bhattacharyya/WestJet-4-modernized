import { useState } from "react";
import { money } from "../../state/booking";
import {
  PaymentSelectField,
  PaymentTextField,
  SummaryRow,
} from "./PaymentFields";

const TRAVEL_BANK_BALANCE = 5000;
const SAVED_CARDS = ["Corporate Visa ••••1842"];

function SavedCardFields({ payment, set }) {
  return (
    <div className="wj-payment__grid">
      <PaymentSelectField
        label="Saved corporate card"
        value={payment.savedCard || SAVED_CARDS[0]}
        options={SAVED_CARDS}
        onChange={(value) => set("savedCard", value)}
        hint="Northstar Studio · Approved payment method"
      />
      <PaymentTextField
        label="Expiry"
        value="09/28"
        readOnly
        icon="icon-calendar-days-18.svg"
        hint="Saved card · Details masked"
      />
    </div>
  );
}

// Reads as formatted money; switches to the raw number while editing.
function BankAmountInput({ id, value, onChange }) {
  const [draft, setDraft] = useState(null);
  return (
    <input
      id={id}
      className="wj-payment__amount"
      type="text"
      inputMode="decimal"
      value={draft ?? money(value)}
      onFocus={() => setDraft(String(value))}
      onBlur={() => setDraft(null)}
      onChange={(event) => {
        const next = event.target.value.replace(/[^\d.]/g, "");
        setDraft(next);
        onChange(next);
      }}
    />
  );
}

function TravelBankRows({ totals, set, split }) {
  return (
    <div className="wj-payment__rows">
      <SummaryRow
        label="Travel Bank available"
        value={money(TRAVEL_BANK_BALANCE)}
      />
      <div className="wj-payment__row">
        <label htmlFor="wj-payment-bank">Amount applied from Travel Bank</label>
        <BankAmountInput
          id="wj-payment-bank"
          value={totals.bank}
          onChange={(value) => set("bank", value)}
        />
      </div>
      <SummaryRow
        label="Remaining BANK BALANCE"
        value={money(TRAVEL_BANK_BALANCE - totals.bank)}
      />
      <SummaryRow
        strong
        label={split ? "Remaining TO PAY · Corporate Visa" : "Remaining TO PAY"}
        value={money(totals.card)}
      />
    </div>
  );
}

function Panel({ title, text, children }) {
  return (
    <section className="wj-payment__panel" aria-label={title}>
      <h3>{title}</h3>
      <p className="wj-payment__panel-text">{text}</p>
      {children}
    </section>
  );
}

export function SplitPanel({ payment, totals, set }) {
  const split = payment.method === "Split Payment";
  return (
    <Panel
      title={`${payment.method} · ${money(totals.total)} total`}
      text={
        split
          ? "Travel Bank is applied first. Your saved Corporate Visa covers the remainder."
          : "Travel Bank funds are applied to the full booking amount."
      }
    >
      <TravelBankRows totals={totals} set={set} split={split} />
      {split && <SavedCardFields payment={payment} set={set} />}
    </Panel>
  );
}

export function CorporateCardPanel({ payment, totals, set }) {
  return (
    <Panel
      title={`Corporate Card · ${money(totals.total)} total`}
      text="Your saved Corporate Visa is charged for the full booking amount."
    >
      <div className="wj-payment__rows">
        <SummaryRow
          strong
          label="Amount to pay · Corporate Visa"
          value={money(totals.total)}
        />
      </div>
      <SavedCardFields payment={payment} set={set} />
    </Panel>
  );
}

export function PersonalCardPanel({ payment, totals, set }) {
  return (
    <Panel
      title={`Personal Card · ${money(totals.total)} total`}
      text="Demo only. Use test details; card fields are never saved in the draft."
    >
      <div className="wj-payment__grid wj-payment__grid--card">
        <PaymentTextField
          label="Cardholder name"
          value={payment.cardName}
          autoComplete="off"
          onChange={(value) => set("cardName", value)}
        />
        <PaymentTextField
          label="Card number"
          value={payment.cardNumber}
          autoComplete="off"
          inputMode="numeric"
          onChange={(value) => set("cardNumber", value)}
        />
      </div>
      <div className="wj-payment__grid wj-payment__grid--card">
        <PaymentTextField
          label="Expiry (MM/YY)"
          value={payment.expiry}
          autoComplete="off"
          maxLength={5}
          onChange={(value) => set("expiry", value)}
        />
        <PaymentTextField
          label="Security code"
          type="password"
          value={payment.cvc}
          autoComplete="off"
          maxLength={4}
          inputMode="numeric"
          onChange={(value) => set("cvc", value)}
        />
      </div>
    </Panel>
  );
}
