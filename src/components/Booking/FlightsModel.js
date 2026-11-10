import { fares, flightOptions } from "../../state/booking";

export const periods = [
  { id: "Night", hours: "00:00 – 06:00", block: "00:00–06:00" },
  { id: "Morning", hours: "06:00 – 12:00", block: "06:00–12:00" },
  { id: "Afternoon", hours: "12:00 – 18:00", block: "12:00–18:00" },
  { id: "Evening", hours: "18:00 – 24:00", block: "18:00–24:00" },
];
export const aircraftTypes = ["Boeing 737-8 MAX", "Boeing 787-9 Dreamliner"];
export const priceDomain = [1000, 4300];
export const durationDomain = [200, 405];
export const sortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "price", label: "Lowest price" },
  { id: "departure", label: "Departure time" },
];

export const wholeMoney = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);

export const minutes = (duration) => {
  const [, hours, mins] = duration.match(/(\d+)h\s*(\d+)m/) || [0, 0, 0];
  return Number(hours) * 60 + Number(mins);
};
export const durationLabel = (value) =>
  `${Math.floor(value / 60)}h ${String(value % 60).padStart(2, "0")}m`;

// The design opens with the stops, fare, aircraft and commission filters set;
// the departure-time filter starts open so every time of day is listed.
export const initialFilters = (fare) => ({
  stops: [1],
  period: "all",
  fares: fares.some((item) => item.name === fare) ? [fare] : [],
  price: [1000, 3500],
  duration: [...durationDomain],
  aircraft: [...aircraftTypes],
  commission: true,
});
export const clearedFilters = () => ({
  stops: [],
  period: "all",
  fares: [],
  price: [...priceDomain],
  duration: [...durationDomain],
  aircraft: [],
  commission: false,
});

// An empty checkbox group means "no restriction".
const allows = (list, value) => list.length === 0 || list.includes(value);

export const activeFares = (filters, cabin) =>
  fares.filter(
    (fare) =>
      allows(filters.fares, fare.name) &&
      (cabin !== "Premium" || fare.cabin === "Premium"),
  );

export function matches(flight, filters, cabin, { ignorePeriod = false } = {}) {
  const length = minutes(flight.duration);
  return (
    allows(filters.stops, flight.stops) &&
    (ignorePeriod || filters.period === "all" || flight.period === filters.period) &&
    allows(filters.aircraft, flight.aircraft) &&
    length >= filters.duration[0] &&
    length <= filters.duration[1] &&
    (!filters.commission || flight.commission > 55) &&
    activeFares(filters, cabin).some((fare) => {
      const price = flight.price + fare.extra;
      return price >= filters.price[0] && price <= filters.price[1];
    })
  );
}

export function visibleFlights(filters, cabin, sort) {
  const list = flightOptions.filter((flight) => matches(flight, filters, cabin));
  if (sort === "price") return [...list].sort((a, b) => a.price - b.price);
  if (sort === "departure") return [...list].sort((a, b) => a.time.localeCompare(b.time));
  return list;
}

export function periodSummary(filters, cabin) {
  const pool = flightOptions.filter((flight) =>
    matches(flight, filters, cabin, { ignorePeriod: true }),
  );
  const summary = periods.map(({ id }) => {
    const flights = pool.filter((flight) => flight.period === id);
    return {
      id,
      count: flights.length,
      from: flights.length ? Math.min(...flights.map((f) => f.price)) : null,
    };
  });
  const priced = summary.filter((item) => item.count);
  const cheapest = priced.length ? Math.min(...priced.map((item) => item.from)) : null;
  return summary.map((item) => ({ ...item, best: item.count > 0 && item.from === cheapest }));
}

export const stopCount = (stops) =>
  flightOptions.filter((flight) => flight.stops === stops).length;

const iso = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const addDays = (value, days) => {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return iso(date);
};
export const stripLabel = (value) => {
  const date = new Date(`${value}T12:00:00`);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${weekday}. ${day}`;
};
