import { useBooking } from "../../state/useBooking";
import { calculateTotals, code, downloadText, itinerary } from "../../state/booking";
import { BookingConfirmedCard, ConfirmedFlights, ContactBox, PaymentBox } from "./ConfirmationSections";
import { FlightPassBalance, HelpBox, ManageBox } from "./ConfirmationAside";
import { cityName } from "./ConfirmationFormat";
import { FLIGHT_PASS_CREDITS } from "./PaymentData";
import "./ConfirmationStep.css";
import "./ConfirmationCards.css";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

function calendarFile(booking, reference) {
  const date = booking.search.departure.replaceAll("-", "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Westzet//Demo Travel//EN",
    "BEGIN:VEVENT",
    `UID:${reference}@westzet.demo`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${date}`,
    `SUMMARY:Flight to ${code(booking.search.destination)} - ${reference}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function ConfirmationStep({ onHome, onNew, onEdit, onViewPass }) {
  const { booking, confirmation, notify } = useBooking();
  const totals = calculateTotals(booking);
  const reference = confirmation?.reference || "W8K2MP";
  const { traveller } = booking;
  const say = (text) => notify?.(text);
  const credits =
    FLIGHT_PASS_CREDITS - (booking.payment.method === "Flight Pass" ? totals.credits : 0);
  const actions = [
    ["View Trip", onHome],
    ["Download Itinerary", () => downloadText(`itinerary-${reference}.txt`, itinerary(booking, reference))],
    [
      "Email to passenger",
      () => say(`Itinerary ${reference} has been emailed to ${traveller.email}.`),
    ],
    [
      "Add to Calendar",
      () => downloadText("westzet-trip.ics", calendarFile(booking, reference), "text/calendar"),
    ],
    ["Book Another Flight", onNew],
  ];
  const invoice = () =>
    downloadText(
      `invoice-${reference}.txt`,
      `DEMO INVOICE\n${itinerary(booking, reference)}\nBilling: ${booking.payment.company}`,
    );
  return (
    <>
      <div className="wj-confirmation__heading">
        <h1>Your trip is ready</h1>
        <p>
          Your {cityName(booking.search.destination)} business trip is booked. Keep your reference
          handy when managing your itinerary.
        </p>
      </div>
      <div className="wj-confirmation">
        <BookingConfirmedCard booking={booking} reference={reference} />
        <aside className="wj-confirmation__notice">
          <img src={asset("icon-info-20.svg")} alt="" width="20" height="20" />
          <div>
            <p className="wj-confirmation__notice-title">Booking confirmed and tickets issued</p>
            <p>
              A confirmation email has been sent to {traveller.email} and to your agency inbox.
            </p>
          </div>
        </aside>
        <div className="wj-confirmation__actions">
          {actions.map(([label, onClick]) => (
            <button key={label} type="button" className="wj-confirmation__outline" onClick={onClick}>
              {label}
            </button>
          ))}
        </div>
        <div className="wj-confirmation__columns">
          <div className="wj-confirmation__main">
            <ConfirmedFlights booking={booking} />
            <p className="wj-confirmation__checkin">
              <img src={asset("icon-info-indigo-16.svg")} alt="" width="16" height="16" />
              Check-in opens 48 hours before departure · Baggage drop closes 45 minutes before
              departure
            </p>
            <section className="wj-confirmation__promo" aria-labelledby="wj-confirmation-promo">
              <div>
                <h2 id="wj-confirmation-promo">Get more from your company travel program</h2>
                <p>
                  Track savings, manage travelers, and take advantage of exclusive corporate travel
                  benefits with every booking.
                </p>
              </div>
              <button
                type="button"
                className="wj-confirmation__primary"
                onClick={() =>
                  say(
                    "Corporate benefits: preferred rates, Travel Bank, Flight Pass and flexible fare bundles.",
                  )
                }
              >
                View Benefits
              </button>
            </section>
            <PaymentBox
              booking={booking}
              totals={totals}
              confirmation={confirmation}
              reference={reference}
              onInvoice={invoice}
            />
            <ContactBox traveller={traveller} onUpdate={() => onEdit("travellers")} />
          </div>
          <div className="wj-confirmation__side">
            <ManageBox
              onEdit={onEdit}
              onCancel={() =>
                say("Contact your travel administrator to cancel. Refunds follow the fare rules.")
              }
            />
            <FlightPassBalance
              credits={credits}
              onView={
                onViewPass ||
                (() => say(`${credits} Flight Pass credits remain for Northstar Studio travel.`))
              }
            />
            <HelpBox
              onTicket={() => say("A support ticket has been opened with your travel administrator.")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
