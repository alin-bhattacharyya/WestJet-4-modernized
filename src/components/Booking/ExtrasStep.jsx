import { useState } from "react";
import { useBooking } from "../../state/useBooking";
import { directions, fares } from "../../state/booking";
import { Actions } from "./shared";
import { ExtrasDirections } from "./ExtrasDirections";
import { ExtrasBaggage, ExtrasComfort, ExtrasMeals } from "./ExtrasSections";
import { ExtrasSummary } from "./ExtrasSummary";
import "./ExtrasStep.css";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

function IncludedNotice({ fareName }) {
  const premium = fareName === "PremiumFlex";
  const bag = premium
    ? "25 kg baggage"
    : fares.find((fare) => fare.name === fareName)?.bag || "Carry-on included";
  return (
    <div className="wj-extras__notice wj-extras__notice--info">
      <img src={asset("icon-info-teal-20.svg")} alt="" width="20" height="20" />
      <div>
        <p className="wj-extras__notice-title">Included in {fareName} Package</p>
        <p className="wj-extras__notice-body">
          {`${bag} (1 adult)  · ${fareName} included. `}These are already paid
          for. Anything below is additional.
        </p>
      </div>
    </div>
  );
}

export function ExtrasStep({ onBack, onContinue }) {
  const { booking, update } = useBooking();
  const legs = directions(booking);
  const [selectedLeg, setLeg] = useState("outbound");
  const leg = legs.includes(selectedLeg) ? selectedLeg : legs[0];
  const legExtras = booking.extras[leg];
  const fareName = booking.flights[leg]?.fare;
  const setLegExtras = (patch) =>
    update("extras", { [leg]: { ...legExtras, ...patch } });
  const toggleIn = (key, value) =>
    setLegExtras({
      [key]: legExtras[key].includes(value)
        ? legExtras[key].filter((item) => item !== value)
        : [...legExtras[key], value],
    });

  return (
    <>
      <div className="wj-extras__heading">
        <h1>Choose extras</h1>
      </div>
      <div className="wj-extras">
        <div className="wj-extras__main">
          <ExtrasDirections booking={booking} legs={legs} active={leg} onSelect={setLeg} />
          <div className="wj-extras__notice wj-extras__notice--warning" role="note">
            <img
              src={asset("icon-triangle-alert-warning.svg")}
              alt=""
              width="20"
              height="20"
            />
            <p className="wj-extras__notice-title">
              Choose extras for each direction separately.
            </p>
          </div>
          <IncludedNotice fareName={fareName} />
          <ExtrasBaggage
            traveller={booking.traveller}
            fareName={fareName}
            weight={legExtras.weight}
            onWeight={(weight) => setLegExtras({ weight })}
          />
          <ExtrasMeals
            selected={legExtras.meals}
            onToggle={(id) => toggleIn("meals", id)}
          />
          <ExtrasComfort
            selected={legExtras.comfort}
            premium={fareName === "PremiumFlex"}
            roundTrip={legs.length > 1}
            traveller={booking.traveller}
            onToggle={(id) => toggleIn("comfort", id)}
            onSms={(sms) => update("traveller", { sms })}
          />
        </div>
        <aside className="wj-extras__side">
          <ExtrasSummary booking={booking} activeLeg={leg} update={update} />
        </aside>
      </div>
      <Actions
        onBack={onBack}
        onContinue={onContinue}
        backLabel="Back to Seats"
        label="Continue"
        wide
      />
    </>
  );
}
