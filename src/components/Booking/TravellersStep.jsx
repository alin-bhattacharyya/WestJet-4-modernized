import { useState } from "react";
import { useBooking } from "../../state/useBooking";
import { Actions } from "./shared";
import { OfferHeld, TripSummary } from "./TripSummary";
import { TravellersContact } from "./TravellersContact";
import { DateField, SelectField, TextField } from "./TravellersFields";
import "./TravellersStep.css";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

const REQUIRED_FIELDS = [
  ["firstName", "First name"],
  ["surname", "Surname"],
  ["birth", "Date of birth"],
  ["nationality", "Nationality"],
  ["document", "Document number"],
  ["expiry", "Expiry date"],
  ["email", "Email"],
  ["confirmEmail", "Confirm email"],
  ["phone", "Mobile number"],
];

function validate(traveller, search) {
  const missing = REQUIRED_FIELDS.filter(
    ([key]) => !String(traveller[key] ?? "").trim(),
  );
  if (missing.length)
    return {
      missing: missing.map(([key]) => key),
      message: `Please complete: ${missing.map(([, label]) => label).join(", ")}.`,
    };
  if (traveller.email.toLowerCase() !== traveller.confirmEmail.toLowerCase())
    return { missing: [], message: "Email addresses must match." };
  const lastTravelDate =
    search.tripType === "One Way" ? search.departure : search.returnDate;
  if (traveller.expiry <= lastTravelDate)
    return {
      missing: [],
      message:
        "Your travel document must be valid through the end of your trip.",
    };
  if (traveller.birth >= search.departure)
    return { missing: [], message: "Date of birth must be before departure." };
  return null;
}

export function TravellersStep({ onBack, onContinue }) {
  const { booking, update } = useBooking();
  const traveller = booking.traveller;
  const [problem, setProblem] = useState(null);
  const set = (key, value) => {
    update("traveller", { [key]: value });
    setProblem(null);
  };
  const isMissing = (key) => Boolean(problem?.missing.includes(key));
  const text = (key, label, placeholder) => (
    <TextField
      label={label}
      placeholder={placeholder}
      value={traveller[key]}
      invalid={isMissing(key)}
      onChange={(value) => set(key, value)}
    />
  );
  const submit = (event) => {
    event.preventDefault();
    const result = validate(traveller, booking.search);
    setProblem(result);
    if (!result) onContinue?.();
  };

  return (
    <>
      <div className="wj-travellers__heading">
        <h1>Enter your details</h1>
        <p>Review or add details for each guest on this booking:</p>
      </div>
      <div className="wj-travellers">
        <form
          id="traveller-form"
          className="wj-travellers__main"
          onSubmit={submit}
          noValidate
        >
          <div className="wj-travellers__note">
            <img src={asset("icon-info-indigo-16.svg")} alt="" width="16" height="16" />
            <p>Enter names exactly as they appear on the travel document.</p>
          </div>
          <section className="wj-travellers__card" aria-labelledby="wj-travellers-passenger">
            <div className="wj-travellers__section-header">
              <div className="wj-travellers__section-name">
                <img src={asset("icon-user-20.svg")} alt="" width="20" height="20" />
                <h2
                  id="wj-travellers-passenger"
                  className="wj-travellers__section-title wj-travellers__section-title--dark"
                >
                  Passenger
                </h2>
              </div>
            </div>
            <div className="wj-travellers__row">
              <SelectField
                label="Title"
                className="wj-travellers__field--title"
                options={["Mr", "Ms", "Mrs", "Dr"]}
                value={traveller.title}
                onChange={(value) => set("title", value)}
              />
              {text("firstName", "First name")}
              {text("middleName", "Middle name (optional)", "Middle name (optional)")}
              {text("surname", "Surname")}
            </div>
            <div className="wj-travellers__row">
              <DateField
                label="Date of birth"
                value={traveller.birth}
                invalid={isMissing("birth")}
                onChange={(value) => set("birth", value)}
              />
              <SelectField
                label="Gender"
                options={["Female", "Male", "Unspecified"]}
                value={traveller.gender}
                onChange={(value) => set("gender", value)}
              />
              {text("nationality", "Nationality")}
            </div>
            <div className="wj-travellers__row">
              <SelectField
                label="Document Type"
                options={["Passport", "National ID"]}
                value={traveller.documentType}
                onChange={(value) => set("documentType", value)}
              />
              {text("document", "Document number")}
              <DateField
                label="Expiry date"
                value={traveller.expiry}
                invalid={isMissing("expiry")}
                onChange={(value) => set("expiry", value)}
              />
            </div>
            <div className="wj-travellers__row">
              {text("loyalty", "Loyalty program (optional)", "Loyalty program")}
              {text(
                "travelerNumber",
                "Canadian Traveler Number (optional)",
                "Canadian Traveler Number",
              )}
              {text("redress", "Redress number (optional)", "Redress number")}
            </div>
          </section>
          <TravellersContact traveller={traveller} set={set} isMissing={isMissing} />
          <section className="wj-travellers__card" aria-labelledby="wj-travellers-requests">
            <div className="wj-travellers__section-header">
              <h2 id="wj-travellers-requests" className="wj-travellers__section-title">
                Special requests
              </h2>
            </div>
            <div className="wj-travellers__row">
              <SelectField
                label="Assistance or preferences"
                hint="Review assistance needs before travel"
                options={[
                  "No special requests",
                  "Wheelchair assistance",
                  "Hearing assistance",
                  "Visual assistance",
                ]}
                value={traveller.assistance}
                onChange={(value) => set("assistance", value)}
              />
            </div>
            <p className="wj-travellers__text">
              WestJet Rewards ••••4821 is attached to {traveller.firstName}{" "}
              {traveller.surname}’s booking. Fare conditions determine reward
              eligibility.
            </p>
          </section>
          {problem && (
            <p role="alert" className="wj-travellers__error">
              {problem.message}
            </p>
          )}
        </form>
        <aside className="wj-travellers__side">
          <OfferHeld />
          <TripSummary />
        </aside>
      </div>
      <Actions
        wide
        onBack={onBack}
        form="traveller-form"
        backLabel="Back to flights"
        label="Continue"
      />
    </>
  );
}
