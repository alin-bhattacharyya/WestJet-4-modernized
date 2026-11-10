const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const parse = (value) => new Date(`${value}T12:00:00`);

// "Toronto Pearson (YYZ)" -> "Toronto"
export const cityName = (airport) =>
  airport.replace(/\s*\([A-Z]{3}\)$/, "").split(" ")[0];

// "2026-11-09" -> "Mon, 9 Nov 2026"
export function longDate(value) {
  const date = parse(value);
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

// ("2026-11-09", "2026-11-12") -> "9–12 Nov 2026"
export function dateRange(start, end) {
  const a = parse(start);
  if (!end) return `${a.getDate()} ${MONTHS[a.getMonth()]} ${a.getFullYear()}`;
  const b = parse(end);
  if (a.getFullYear() !== b.getFullYear())
    return `${a.getDate()} ${MONTHS[a.getMonth()]} ${a.getFullYear()} – ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
  if (a.getMonth() !== b.getMonth())
    return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
  return `${a.getDate()}–${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
}

// ISO timestamp -> "Oct 20 2026, 10:42"
export function paidOn(iso) {
  const date = iso ? new Date(iso) : new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${MONTHS[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Stable demo transaction id derived from the booking reference.
export function transactionId(reference, iso) {
  const year = (iso ? new Date(iso) : new Date()).getFullYear();
  const hash = [...reference].reduce(
    (sum, char) => (sum * 31 + char.charCodeAt(0)) % 100000000,
    7,
  );
  return `SXPAY-${year}-${String(hash).padStart(8, "0")}`;
}

// "Maya.Thompson@Corporate.com" -> "Ma•••••@Corporate.com"
export const maskEmail = (email) => {
  const [user, domain] = email.split("@");
  return domain ? `${user.slice(0, 2)}•••••@${domain}` : email;
};

// ("+49", "1728845190") -> "+49 172 ••• 5190"
export const maskPhone = (countryCode, number) => {
  const digits = number.replace(/\D/g, "");
  return `${countryCode} ${digits.slice(0, 3)} ••• ${digits.slice(-4)}`;
};

// ("Anna Hoffmann", "+49 2119876543") -> "A••• Hoffmann, +49 211 ••• 6543"
export const maskEmergency = (name, phone) => {
  const [first = "", ...rest] = name.split(" ");
  const [code, ...number] = phone.split(" ");
  const masked = number.length ? maskPhone(code, number.join("")) : phone;
  return `${first.slice(0, 1)}••• ${rest.join(" ")}, ${masked}`;
};
