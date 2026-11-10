import { useState } from "react";
import { useBooking } from "../../state/useBooking";
import { directions, flightOptions, isExitSeat, seatSegments } from "../../state/booking";
import { Actions } from "./shared";
import { SeatsFlights } from "./SeatsFlights";
import { SeatsMap } from "./SeatsMap";
import { SeatsSummary } from "./SeatsSummary";
import "./SeatsStep.css";

export function SeatsStep({ onBack, onContinue }) {
  const { booking, update } = useBooking();
  const segments = seatSegments(booking);
  const legs = directions(booking);
  const [activeKey, setActiveKey] = useState(segments[0].key);
  const [exitConsent, setExitConsent] = useState(() =>
    segments.some((segment) => isExitSeat(booking.seats[segment.key])),
  );
  const activeSegment =
    segments.find((segment) => segment.key === activeKey) || segments[0];
  const seatKey = activeSegment.key;
  const aircraft =
    flightOptions.find((flight) => flight.id === booking.flights[activeSegment.leg]?.id)
      ?.aircraft || "Boeing 737-8 MAX";

  const toggleSeat = (seat) =>
    update("seats", { [seatKey]: booking.seats[seatKey] === seat ? null : seat });

  const changeExitConsent = (checked) => {
    setExitConsent(checked);
    if (checked) return;
    // Withdrawing consent releases any exit-row seat already chosen.
    update(
      "seats",
      Object.fromEntries(
        segments.map((segment) => {
          const seat = booking.seats[segment.key];
          return [segment.key, isExitSeat(seat) ? null : seat];
        }),
      ),
    );
  };

  return (
    <>
      <h1 className="wj-seats__title">Select your seats</h1>
      <div className="wj-seats">
        <div className="wj-seats__main">
          <SeatsFlights
            booking={booking}
            legs={legs}
            segments={segments}
            activeSegment={activeSegment}
            onSelect={(segment) => setActiveKey(segment.key)}
          />
          <SeatsMap
            aircraft={aircraft}
            selectedSeat={booking.seats[seatKey]}
            exitConsent={exitConsent}
            onExitConsent={changeExitConsent}
            onToggle={toggleSeat}
          />
        </div>
        <SeatsSummary booking={booking} segments={segments} />
      </div>
      <Actions
        onBack={onBack}
        onContinue={onContinue}
        backLabel="Back to Traveller Info"
        label="Continue"
        wide
      />
    </>
  );
}
