export const airports = [
  "Toronto Pearson (YYZ)",
  "Calgary (YYC)",
  "Vancouver (YVR)",
  "Montréal (YUL)",
  "Halifax (YHZ)",
  "Edmonton (YEG)",
];
export const money = (value) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    value,
  );
export const code = (airport) =>
  airport.match(/\(([A-Z]{3})\)/)?.[1] || airport;
export const dateLabel = (value) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-CA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const flight = (id, time, arrival, duration, stops, period, price, aircraft, commission) => ({
  id,
  number: `WJ ${id}`,
  time,
  arrival,
  duration,
  stops,
  period,
  price,
  aircraft,
  commission,
});
export const flightOptions = [
  flight("967", "06:40", "11:00", "4h 07m", 1, "Morning", 1598, "Boeing 737-8 MAX", 60),
  flight("969", "09:15", "13:40", "4h 12m", 1, "Morning", 1301, "Boeing 787-9 Dreamliner", 58),
  flight("971", "14:05", "18:35", "4h 17m", 1, "Afternoon", 1680, "Boeing 737-8 MAX", 65),
  flight("973", "19:10", "23:32", "4h 22m", 1, "Evening", 998, "Boeing 737-8 MAX", 56),
  flight("975", "08:00", "10:20", "4h 20m", 0, "Morning", 1240, "Boeing 787-9 Dreamliner", 57),
  flight("977", "16:30", "18:50", "4h 20m", 0, "Afternoon", 1420, "Boeing 737-8 MAX", 62),
];
export const fares = [
  {
    name: "Econo",
    cabin: "Economy",
    extra: 0,
    bag: "Carry-on included",
    changes: "Changes for a fee",
    seatsLeft: 6,
    features: [
      "Carry-on bag and personal item",
      "Standard seat (select for a fee)",
      "Changes for a fee",
      "WestJet Rewards earn",
    ],
  },
  {
    name: "EconoFlex",
    cabin: "Economy",
    extra: 120,
    bag: "1 checked bag included",
    changes: "Flexible changes",
    seatsLeft: 4,
    features: [
      "Change for no fee",
      "Standard seat included",
      "1 included checked bag",
      "Carry-on bag and personal item",
      "WestJet Rewards earn",
    ],
  },
  {
    name: "PremiumFlex",
    cabin: "Premium",
    extra: 260,
    bag: "25 kg baggage included",
    changes: "Flexible changes · priority boarding",
    seatsLeft: 2,
    features: [
      "Refund for cancel & change for no fee",
      "Premium seat",
      "Food and beverages (incl. wine, beer, & spirits)",
      "2 included checked bags",
      "Priority screening",
      "Priority boarding",
      "Priority baggage",
      "WestJet Rewards earn",
    ],
  },
];
// Lowest fare shown in the flight date strip; null means no service that day.
const stripPrices = {
  "2026-11-09": 2163.58,
  "2026-11-10": 1005.44,
  "2026-11-11": 1005.44,
  "2026-11-12": 1005.44,
  "2026-11-13": 915.14,
};
export function datePrice(value) {
  const date = new Date(`${value}T12:00:00`);
  if (date.getDay() === 0 || date.getDay() === 6) return null;
  return stripPrices[value] ?? 915.14 + ((date.getDate() * 37) % 290);
}
export const meals = [
  {
    id: "poutine",
    name: "Classic Poutine & Soft Drink",
    description: "Crispy fries, cheese curds, rich gravy",
    price: 14.99,
  },
  {
    id: "salmon",
    name: "Atlantic Salmon & Herb Rice",
    description: "Grilled salmon, wild rice, vegetables",
    price: 24.99,
  },
  {
    id: "wrap",
    name: "Maple Chicken Wrap & Drink",
    description: "Roasted chicken, maple glaze, fresh greens",
    price: 16.99,
  },
  {
    id: "beef",
    name: "Alberta Beef Sandwich Combo",
    description: "Slow-roasted beef, cheddar, artisan bun",
    price: 19.99,
  },
  {
    id: "bar",
    name: "Nanaimo Bar & Hot Beverage",
    description: "Traditional Nanaimo bar with tea or coffee",
    price: 9.99,
  },
  {
    id: "kids",
    name: "Kids Meal & Soft Drink",
    description: "Chicken tenders, fries, fresh fruit",
    price: 9.99,
  },
];
export const comforts = [
  {
    id: "lounge",
    name: "Lounge Access",
    description: "Pearson and Calgary lounges. Per passenger, per airport.",
    price: 35,
    unit: " each",
  },
  {
    id: "checkin",
    name: "Airport Check-in Service",
    description: "Desk check-in at the airport instead of online.",
    price: 15,
    unit: " / pax",
  },
  {
    id: "open",
    name: "Open Ticket",
    description: "Leave the return date open and confirm later.",
    price: 30,
    unit: "",
  },
];
export const seatPrice = (seat) =>
  !seat
    ? 0
    : parseInt(seat) <= 5
      ? 20
      : [16, 17].includes(parseInt(seat))
        ? 25
        : parseInt(seat) >= 26
          ? 0
          : 10;
// Agent commission earned per seat category (Front Extra, Extra Legroom, Standard, Free).
export const seatCommission = (seat) =>
  ({ 20: 4, 25: 8, 10: 3 })[seatPrice(seat)] || 0;
export const exitRows = [16, 17];
export const isExitSeat = (seat) => !!seat && exitRows.includes(parseInt(seat));
export const directions = (booking) =>
  booking.search.tripType === "One Way" ? ["outbound"] : ["outbound", "return"];
const shortDay = (value) => {
  const date = new Date(`${value}T12:00:00`);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${weekday}. ${day}`;
};
export function legSummary(booking, leg) {
  const flight = flightOptions.find((f) => f.id === booking.flights[leg]?.id);
  const outbound = leg === "outbound";
  const from = code(outbound ? booking.search.origin : booking.search.destination);
  const to = code(outbound ? booking.search.destination : booking.search.origin);
  return {
    label: outbound ? "Departing flight" : "Return Flight",
    number: outbound ? flight.number : `WJ ${Number(flight.id) + 1}`,
    date: shortDay(outbound ? booking.search.departure : booking.search.returnDate),
    stops: flight.stops ? "1 stop" : "Nonstop",
    duration: flight.duration,
    airports: flight.stops ? [from, "YVR", to] : [from, to],
    times: `${flight.time} → ${flight.arrival}`,
  };
}
export function seatSegments(booking) {
  return directions(booking).flatMap((leg) => {
    const route =
      leg === "outbound"
        ? [code(booking.search.origin), code(booking.search.destination)]
        : [code(booking.search.destination), code(booking.search.origin)];
    const stop = flightOptions.find(
      (f) => f.id === booking.flights[leg]?.id,
    )?.stops;
    return stop
      ? [
          { key: leg, leg, route: `${route[0]} → YVR` },
          { key: `${leg}Connection`, leg, route: `YVR → ${route[1]}` },
        ]
      : [{ key: leg, leg, route: route.join(" → ") }];
  });
}
export function createBooking() {
  return {
    search: {
      tripType: "Round Trip",
      origin: airports[0],
      destination: airports[1],
      departure: "2026-11-09",
      returnDate: "2026-11-12",
      cabin: "Economy",
      purpose: "Client meeting",
      reason: "Northstar client kickoff in Calgary",
      car: false,
      passOnly: false,
    },
    flights: {
      outbound: { id: "967", fare: "PremiumFlex" },
      return: { id: "967", fare: "PremiumFlex" },
    },
    traveller: {
      title: "Mr",
      firstName: "Maya",
      middleName: "",
      surname: "Thompson",
      birth: "1985-04-12",
      gender: "Female",
      nationality: "Canadian",
      documentType: "Passport",
      document: "C01X9K2M4",
      expiry: "2031-09-04",
      loyalty: "",
      travelerNumber: "",
      redress: "",
      email: "Maya.Thompson@Corporate.com",
      confirmEmail: "Maya.Thompson@Corporate.com",
      countryCode: "+1",
      phone: "1728845190",
      emergencyName: "Anna Thompson",
      emergencyPhone: "+1 2119876543",
      sms: true,
      agency: true,
      assistance: "No special requests",
    },
    seats: {
      outbound: "4A",
      return: "4A",
      outboundConnection: "4A",
      returnConnection: "4A",
    },
    extras: {
      outbound: { weight: 10, meals: ["poutine", "salmon"], comfort: [] },
      return: { weight: 10, meals: ["salmon"], comfort: [] },
    },
    payment: {
      method: "Split Payment",
      bank: 4500,
      savedCard: "Corporate Visa ••••1842",
      agreed: false,
      company: "Northstar Studio",
      contact: "Maya Thompson",
      address: "220 King Street West",
      city: "Toronto",
      province: "ON",
      postal: "M5H 1K4",
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
  };
}
export function calculateTotals(booking) {
  const legs = directions(booking);
  const fare = legs.reduce(
    (sum, leg) =>
      sum +
      (flightOptions.find((f) => f.id === booking.flights[leg]?.id)?.price ||
        0),
    0,
  );
  const bundle = legs.reduce(
    (sum, leg) =>
      sum +
      (fares.find((f) => f.name === booking.flights[leg]?.fare)?.extra || 0),
    0,
  );
  const seats = seatSegments(booking).reduce(
    (sum, segment) => sum + seatPrice(booking.seats[segment.key]),
    0,
  );
  const extras = legs.reduce((sum, leg) => {
    const e = booking.extras[leg];
    return (
      sum +
      (e.weight / 5) * 19 +
      meals
        .filter((m) => e.meals.includes(m.id))
        .reduce((s, m) => s + m.price, 0) +
      comforts
        .filter((c) => e.comfort.includes(c.id))
        .reduce((s, c) => s + c.price, 0)
    );
  }, 0);
  const total = Math.round((fare + bundle + seats + extras + 12) * 100) / 100;
  const bank = ["Travel Bank", "Split Payment"].includes(booking.payment.method)
    ? Math.min(5000, total, Math.max(0, Number(booking.payment.bank) || 0))
    : 0;
  const commission = legs.reduce(
    (sum, leg) =>
      sum +
      (flightOptions.find((f) => f.id === booking.flights[leg]?.id)
        ?.commission || 0),
    0,
  );
  return {
    fare,
    bundle,
    commission,
    seats,
    extras,
    service: 12,
    total,
    bank,
    card: Math.round((total - bank) * 100) / 100,
    due: booking.payment.method === "Flight Pass" ? 0 : total,
    credits: legs.length * 3,
  };
}
export function readDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem("westzet.draft.v1"));
    const initial = createBooking();
    if (!saved || saved.version !== 2) return initial;
    return {
      ...initial,
      ...saved.booking,
      payment: {
        ...initial.payment,
        ...saved.booking.payment,
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
        agreed: false,
      },
    };
  } catch {
    return createBooking();
  }
}
export function saveDraft(booking) {
  const {
    cardName: _name,
    cardNumber: _number,
    expiry: _expiry,
    cvc: _cvc,
    ...payment
  } = booking.payment;
  try {
    localStorage.setItem(
      "westzet.draft.v1",
      JSON.stringify({ version: 2, booking: { ...booking, payment } }),
    );
  } catch {
    /* Storage may be disabled; the in-memory booking remains usable. */
  }
}
export function downloadText(name, body, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function itinerary(booking, reference = "W8K2MP") {
  const t = calculateTotals(booking);
  return `WESTZET · DEMO ITINERARY\nReference: ${reference}\nPassenger: ${booking.traveller.firstName} ${booking.traveller.surname}\n${directions(
    booking,
  )
    .map(
      (leg) =>
        `${leg}: ${leg === "outbound" ? booking.search.origin : booking.search.destination} → ${leg === "outbound" ? booking.search.destination : booking.search.origin}\n${dateLabel(leg === "outbound" ? booking.search.departure : booking.search.returnDate)} · ${flightOptions.find((f) => f.id === booking.flights[leg].id)?.number} · ${booking.flights[leg].fare} · Seat ${seatSegments(
          booking,
        )
          .filter((s) => s.leg === leg)
          .map((s) => `${s.route}: ${booking.seats[s.key] || "Not selected"}`)
          .join("; ")}`,
    )
    .join(
      "\n",
    )}\nTotal: ${money(t.total)}\nPayment method: ${booking.payment.method}\nFlight Pass credits: ${booking.payment.method === "Flight Pass" ? t.credits : 0}\nIllustrative booking only. No payment or ticket issuance occurs.`;
}
