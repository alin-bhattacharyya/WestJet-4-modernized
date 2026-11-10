// Static sample content for the V3 home dashboard (Figma "WestJet RFP - Home").
import { code } from "../../state/booking";

export const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

// Two staggered columns of rounded travel photos on the search card.
// `crop` reproduces the Figma image fill where it is not a plain cover.
export const collageColumns = [
  [
    { src: "home-collage-1.jpg", alt: "Sandstone canyon", crop: { left: "-70.82%", top: "0", width: "190.84%", height: "100%" } },
    { src: "home-collage-2.jpg", alt: "Traveller at a cabin window" },
    { src: "home-collage-3.jpg", alt: "Canadian Rockies" },
    { src: "home-collage-4.jpg", alt: "Above the clouds", crop: { left: "0", top: "-2.77%", width: "100%", height: "150%" } },
  ],
  [
    { src: "home-collage-5.jpg", alt: "Palm trees at sunset" },
    { src: "home-collage-6.jpg", alt: "Turquoise coastline" },
    { src: "home-collage-7.jpg", alt: "Colourful coastal village", crop: { left: "0", top: "-4.67%", width: "100%", height: "150.63%" } },
    { src: "home-collage-8.jpg", alt: "Mediterranean architecture" },
  ],
];

export const airportLabel = (airport) => airport.replace(" Pearson", "");

export const sampleTrips = [
  { passenger: "Olivia Martin", route: "YYZ → YVR", flight: "WJ4T8R", date: "Today", status: "Confirmed" },
  { passenger: "Sarah Thompson", route: "YYC → YYZ", flight: "WJ2K9P", date: "Sep 20, 2026", status: "On Hold" },
  { passenger: "Emma Richardson", route: "YUL → YYC", flight: "WJ2K9P", date: "Aug 20, 2026", status: "Confirmed" },
  { passenger: "Daniel Campbell", route: "YYZ → YHZ", flight: "WJ5V1X", date: "Nov 28, 2026", status: "Canceled" },
  { passenger: "Lauren Mitchell", route: "YVR → YEG", flight: "WJ8N4D", date: "Dec 29, 2026", status: "Confirmed" },
];

const tableDate = (value) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// Completed demo bookings first, then the sample company trips (5 rows max).
export function upcomingTrips(reservations = []) {
  const own = [...reservations].reverse().map((item) => ({
    passenger: `${item.booking.traveller.firstName} ${item.booking.traveller.surname}`,
    route: `${code(item.booking.search.origin)} → ${code(item.booking.search.destination)}`,
    flight: item.confirmation.reference,
    date: tableDate(item.booking.search.departure),
    status: "Confirmed",
    reservation: item,
  }));
  return [...own, ...sampleTrips].slice(0, 5);
}

export const activities = [
  { title: "Booking created · WJ302 YYZ→FRA", detail: "Commission: $23.40 · Economy · 2 pax", time: "2 min ago", tone: 1 },
  { title: "PremiumFlex upgrade - PNR WJ738291", detail: "Ancillary earn: +$8.50", time: "15 min ago", tone: 2 },
  { title: "Refund approved - $342", detail: "PNR: WJ441 · Commission adjusted", time: "32 min ago", tone: 3 },
  { title: "Schedule change resolved - WJ714 BER route", detail: "Rebooking completed · No cost", time: "Yesterday", tone: 4 },
  { title: "Baggage purchased - 20 kg", detail: "Earn: +$3.20 · WJ302 YYZ→FRA", time: "2 days ago", tone: 1 },
  { title: "Ticket reissued - WJ303", detail: "Fee waived · Voluntary change", time: "1 week ago", tone: 2 },
];

export const paymentOptions = [
  { name: "Corporate Travel Bank", badge: "Available" },
  { name: "Corporate Card", detail: "•••••••• 1234" },
  { name: "Personal Card", detail: "•••••••• 5678" },
];

export const alerts = [
  { title: "Schedule Change", detail: "1 booking affected · WJ302 YYZ", icon: "icon-clock-19.svg", tone: "warning" },
  { title: "Flight Delay", detail: "1 booking affected · WJ714 YYC", icon: "icon-alert-circle-19.svg", tone: "error" },
  { title: "Aircraft Change", detail: "1 booking affected · WJ408 YVZ", icon: "icon-refresh-ccw-19.svg", tone: "teal" },
  { title: "Airport Advisory", detail: "Calgary weather advisory", icon: "icon-info-19.svg", tone: "neutral" },
  { title: "Fraud PNR flagged", detail: "PNR123 needs review", icon: "icon-alert-circle-19.svg", tone: "error" },
];

export const quickActions = [
  ["New Booking", "Exchange Ticket", "Add Ancillary", "Special Service"],
  ["Manage Booking", "Refund Request", "Group Booking", "Download Invoice"],
];

// The header badge counts every open alert; the card lists the first five.
export const alertTotal = 7;

const monthYear = (date) =>
  date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
const asDate = (value) => new Date(`${value}T12:00:00`);

// "9–12 Nov 2026", "28 Nov – 2 Dec 2026" or "9 Nov 2026" for one way.
export function rangeLabel(departure, returnDate) {
  if (!departure) return "";
  const start = asDate(departure);
  if (!returnDate) return `${start.getDate()} ${monthYear(start)}`;
  const end = asDate(returnDate);
  if (monthYear(start) === monthYear(end))
    return `${start.getDate()}–${end.getDate()} ${monthYear(end)}`;
  const startLabel = start.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${startLabel} – ${end.getDate()} ${monthYear(end)}`;
}
