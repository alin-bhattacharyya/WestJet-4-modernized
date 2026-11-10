import { CheckOption, SelectField, TextField } from "./TravellersFields";

const COUNTRY_CODES = [
  ["+1", "+1 Canada"],
  ["+44", "+44 United Kingdom"],
  ["+49", "+49 Germany"],
  ["+91", "+91 India"],
];

export function TravellersContact({ traveller, set, isMissing }) {
  return (
    <section className="wj-travellers__card" aria-labelledby="wj-travellers-contact">
      <div className="wj-travellers__section-header">
        <h2 id="wj-travellers-contact" className="wj-travellers__section-title">
          Contact details
        </h2>
      </div>
      <p className="wj-travellers__text">
        Used for booking confirmation, schedule changes and disruption notices.
      </p>
      <div className="wj-travellers__row">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={traveller.email}
          invalid={isMissing("email")}
          onChange={(value) => set("email", value)}
        />
        <TextField
          label="Confirm email"
          type="email"
          autoComplete="email"
          value={traveller.confirmEmail}
          invalid={isMissing("confirmEmail")}
          onChange={(value) => set("confirmEmail", value)}
        />
      </div>
      <div className="wj-travellers__row">
        <SelectField
          label="Country code"
          className="wj-travellers__field--country"
          options={COUNTRY_CODES}
          value={traveller.countryCode}
          onChange={(value) => set("countryCode", value)}
        />
        <TextField
          label="Mobile number"
          type="tel"
          autoComplete="tel-national"
          value={traveller.phone}
          invalid={isMissing("phone")}
          onChange={(value) => set("phone", value)}
        />
      </div>
      <div className="wj-travellers__row">
        <TextField
          label="Emergency contact name"
          value={traveller.emergencyName}
          onChange={(value) => set("emergencyName", value)}
        />
        <TextField
          label="Emergency number"
          type="tel"
          value={traveller.emergencyPhone}
          onChange={(value) => set("emergencyPhone", value)}
        />
      </div>
      <div className="wj-travellers__checks">
        <CheckOption
          label="Send booking updates by SMS"
          checked={traveller.sms}
          onChange={(value) => set("sms", value)}
        />
        <CheckOption
          label="Send a copy of the confirmation to my agency inbox"
          checked={traveller.agency}
          onChange={(value) => set("agency", value)}
        />
      </div>
    </section>
  );
}
