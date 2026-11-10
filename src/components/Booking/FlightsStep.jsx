import { useState } from "react";
import { useBooking } from "../../state/useBooking";
import { code, fares, flightOptions } from "../../state/booking";
import { Actions } from "./shared";
import { FlightsBestTime } from "./FlightsBestTime";
import { FlightsCard } from "./FlightsCard";
import { FlightsDateStrip } from "./FlightsDateStrip";
import { FlightsCompliance, FlightsFilters } from "./FlightsFilters";
import { FlightsPromo } from "./FlightsPromo";
import {
  activeFares,
  clearedFilters,
  initialFilters,
  periodSummary,
  visibleFlights,
} from "./FlightsModel";
import "./FlightsStep.css";

export function FlightsStep({ direction = "outbound", onBack, onContinue }) {
  const { booking, update } = useBooking();
  const selected = booking.flights[direction];
  const returning = direction === "return";
  const s = booking.search;
  const [filters, setFilters] = useState(() => initialFilters(selected?.fare));
  const [sort, setSort] = useState("recommended");
  const [open, setOpen] = useState(null);
  // The action bar appears once a fare bundle is chosen on this screen.
  const origin = code(returning ? s.destination : s.origin);
  const destination = code(returning ? s.origin : s.destination);
  const dateKey = returning ? "returnDate" : "departure";
  const list = visibleFlights(filters, s.cabin, sort);
  const allowedFares = activeFares(filters, s.cabin);
  const summary = periodSummary(filters, s.cabin);
  const current = flightOptions.find((flight) => flight.id === selected?.id);
  const chosenVisible =
    list.some((flight) => flight.id === selected?.id) &&
    allowedFares.some((fare) => fare.name === selected?.fare);
  const choose = (flight, fare) => {
    update("flights", { [direction]: { id: flight.id, fare } });
  };
  const selectDate = (date) =>
    update("search", {
      [dateKey]: date,
      ...(!returning && s.returnDate < date ? { returnDate: date } : {}),
    });
  const promoAfter = Math.min(list.length, returning ? 3 : 2);
  const cards = list.map((flight) => (
    <FlightsCard
      key={flight.id}
      flight={flight}
      origin={origin}
      destination={destination}
      number={returning ? `WJ ${Number(flight.id) + 1}` : flight.number}
      open={open?.id === flight.id ? open.cabin : null}
      onOpen={(cabin) => setOpen(cabin ? { id: flight.id, cabin } : null)}
      selected={
        selected?.id === flight.id
          ? {
              fare: selected.fare,
              cabin: fares.find((fare) => fare.name === selected.fare)?.cabin,
            }
          : null
      }
      allowedFares={allowedFares}
      onSelect={(fare) => choose(flight, fare)}
      onShowAllFares={() => setFilters({ ...filters, fares: [] })}
    />
  ));
  return (
    <>
      <FlightsBestTime
        origin={origin}
        destination={destination}
        summary={summary}
        period={filters.period}
        current={current}
        onPeriod={(period) => setFilters({ ...filters, period })}
        onReset={() => setFilters(clearedFilters())}
      />
      <div className="wj-flights__layout">
        <aside className="wj-flights__aside">
          <FlightsFilters
            filters={filters}
            onChange={setFilters}
            sort={sort}
            onSort={setSort}
          />
          <FlightsCompliance />
        </aside>
        <div className="wj-flights__results">
          <div className="wj-flights__calendar">
            <div className="wj-flights__heading">
              <h1>{returning ? "Select return flight" : "Select departing flight"}</h1>
              <p>Selecting a date reloads the results below.</p>
            </div>
            <FlightsDateStrip
              label={returning ? "Return dates" : "Departure dates"}
              anchor={s.departure}
              selected={s[dateKey]}
              earliest={returning ? s.departure : null}
              onSelect={selectDate}
            />
          </div>
          <div className="wj-flights__list">
            {cards.slice(0, promoAfter)}
            {list.length === 0 && (
              <p className="wj-flights__empty">
                No flights match these filters. Choose “All Items” to reset.
              </p>
            )}
            <FlightsPromo />
            {cards.slice(promoAfter)}
          </div>
        </div>
      </div>
      <Actions
        onBack={onBack}
        onContinue={onContinue}
        disabled={!chosenVisible}
        label={
          returning || s.tripType === "One Way"
            ? "Continue to traveller info"
            : "Select return flight"
        }
      />
    </>
  );
}
