import { useContext } from "react";
import { BookingContext } from "./BookingContext";
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("Booking provider is required");
  return context;
}
