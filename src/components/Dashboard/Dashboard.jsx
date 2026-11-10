import { useBooking } from "../../state/useBooking";
import { code, dateLabel, downloadText, itinerary } from "../../state/booking";
import { CorporatePromo, Alerts, FlightPassBalance, QuickActions, TierProgress } from "./DashboardAside";
import { PaymentOptions, RecentActivity, SummerPromo, UpcomingTrip } from "./DashboardMain";
import { ActionButton, ListRow, TripsTable } from "./DashboardParts";
import { SearchCard } from "./SearchCard";
import { sampleTrips, upcomingTrips } from "./dashboardData";
import "./Dashboard.css";
import "./DashboardCards.css";

const noop = () => {};

export function Dashboard({ onBook, onNavigate = noop, onTrips = noop }) {
  const { booking, confirmation, reservations = [], notify } = useBooking();
  const contact = (label) =>
    notify(`${label}: contact your travel administrator to arrange this service.`);
  const downloadInvoice = () =>
    confirmation
      ? downloadText("westjet-invoice.txt", itinerary(booking, confirmation.reference))
      : notify("Complete a booking to download its invoice.");
  const quickAction = (label) => {
    if (label === "New Booking") return onBook();
    if (label === "Manage Booking") return onTrips();
    if (label === "Download Invoice") return downloadInvoice();
    return contact(label);
  };
  const viewTrip = (trip) =>
    trip.reservation
      ? onTrips()
      : notify(
          `Sample trip for ${trip.passenger}. Your completed demo bookings are available under My trips.`,
        );

  return (
    <>
      <SearchCard onBook={onBook} />
      <div className="wj-home__columns">
        <div className="wj-home__main">
          <UpcomingTrip onManage={onTrips} />
          <TripsTable
            title="Upcoming Trips"
            trips={upcomingTrips(reservations)}
            onViewAll={onTrips}
            onRowAction={viewTrip}
          />
          <SummerPromo
            onDetails={() =>
              notify(
                "Illustrative campaign from the Figma reference. Contact your travel administrator for current offers.",
              )
            }
          />
          <div className="wj-home__pair">
            <PaymentOptions onManage={() => onNavigate("benefits")} onSelect={contact} />
            <RecentActivity />
          </div>
        </div>
        <aside className="wj-home__aside" aria-label="Travel tools">
          <CorporatePromo onDetails={() => onNavigate("benefits")} />
          <Alerts
            onViewAll={() => onNavigate("notifications")}
            onSelect={(alert) =>
              notify(`${alert.title}: ${alert.detail}. Contact your travel administrator for assistance.`)
            }
          />
          <FlightPassBalance onView={() => onNavigate("pass")} />
          <QuickActions onAction={quickAction} />
          <TierProgress onInvoice={downloadInvoice} />
        </aside>
      </div>
    </>
  );
}

export function Trips({ onView, onBook }) {
  const { reservations = [], notify } = useBooking();
  return (
    <>
      <div className="wj-home__intro">
        <div>
          <h1>My trips</h1>
          <p>Your completed bookings and your company&apos;s upcoming trips.</p>
        </div>
        <ActionButton onClick={onBook}>New Booking</ActionButton>
      </div>
      {reservations.length > 0 && (
        <section className="wj-home__card" aria-labelledby="wj-trips-bookings">
          <header className="wj-home__panel-header">
            <h2 id="wj-trips-bookings">Your bookings</h2>
          </header>
          <div className="wj-home__rows">
            {reservations.map((item) => {
              const { search, traveller } = item.booking;
              const reference = item.confirmation.reference;
              return (
                <ListRow
                  key={reference}
                  icon="icon-calendar-days-18.svg"
                  title={`${code(search.origin)} → ${code(search.destination)} · ${reference}`}
                  label={`View itinerary ${reference}`}
                  onClick={() => onView(item)}
                >
                  <small>
                    {traveller.firstName} {traveller.surname} · {dateLabel(search.departure)} · Demo
                    booking confirmed
                  </small>
                </ListRow>
              );
            })}
          </div>
        </section>
      )}
      <TripsTable
        title="Company trips"
        trips={sampleTrips}
        onRowAction={(trip) =>
          notify(
            `Sample company trip for ${trip.passenger}. Contact your travel administrator to manage this reservation.`,
          )
        }
      />
    </>
  );
}
