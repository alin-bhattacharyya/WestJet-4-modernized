import { useState } from "react";
import { BookingContext } from "../state/BookingContext";
import { createBooking } from "../state/booking";
export function BookingHarness({ children, initial }) {
  const [booking, setBooking] = useState(initial || createBooking);
  const update = (section, patch) =>
    setBooking((current) => ({
      ...current,
      [section]: { ...current[section], ...patch },
    }));
  return (
    <BookingContext.Provider
      value={{ booking, update, confirmation: null, notify: () => {} }}
    >
      {children}
    </BookingContext.Provider>
  );
}
