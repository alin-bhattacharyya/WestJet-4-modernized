import { useEffect, useRef, useState } from "react";
import {
  ConfirmationStep,
  ExtrasStep,
  FlightsStep,
  PaymentStep,
  SearchStep,
  SeatsStep,
  TravellersStep,
} from "./components/Booking/Booking";
import { Dashboard, Trips } from "./components/Dashboard/Dashboard";
import { FlightPass } from "./components/Dashboard/FlightPass";
import { LoadingModal } from "./components/LoadingModal/LoadingModal";
import { Login } from "./components/Login/Login";
import { Shell } from "./components/Shell/Shell";
import { BookingContext } from "./state/BookingContext";
import { code, createBooking, readDraft, saveDraft } from "./state/booking";

// Dev-only deep link (?screen=seats) for visual QA against the Figma frames.
const devScreen = import.meta.env.DEV
  ? new URLSearchParams(window.location.search).get("screen")
  : null;

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(devScreen));
  const [screen, setScreen] = useState(devScreen || "home");
  const [booking, setBooking] = useState(readDraft);
  const [loading, setLoading] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [editingReference, setEditingReference] = useState(null);
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState(null);
  const timer = useRef(null);
  useEffect(() => {
    saveDraft(booking);
  }, [booking]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timeout);
  }, [message]);
  const update = (section, patch) =>
    setBooking((current) => ({
      ...current,
      [section]: { ...current[section], ...patch },
    }));
  const navigate = (next) => {
    setScreen(next);
    window.scrollTo?.(0, 0);
  };
  const loaders = {
    outbound: "flights",
    travellers: "spinner",
    payment: "payment",
    confirmation: "booking",
  };
  const transition = (next) => {
    setLoading(loaders[next] || "spinner");
    timer.current = setTimeout(() => {
      setLoading(null);
      navigate(next);
    }, 400);
  };
  const signIn = () => {
    setLoading("spinner");
    timer.current = setTimeout(() => {
      setLoading(null);
      setAuthenticated(true);
    }, 400);
  };
  const newBooking = () => {
    if (confirmation) {
      setBooking(createBooking());
      setConfirmation(null);
      setEditingReference(null);
    }
    navigate("search");
  };
  const complete = () => {
    const record = {
      reference:
        editingReference ||
        (reservations.length
          ? `WZ${String(reservations.length + 1).padStart(4, "0")}`
          : "W8K2MP"),
      date: new Date().toISOString(),
    };
    const clean = {
      ...booking,
      payment: {
        ...booking.payment,
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
      },
    };
    setConfirmation(record);
    setBooking(clean);
    setReservations((current) => [
      ...current.filter(
        (item) => item.confirmation.reference !== record.reference,
      ),
      { booking: structuredClone(clean), confirmation: record },
    ]);
    setEditingReference(null);
    transition("confirmation");
  };
  const edit = (next) => {
    setEditingReference(confirmation?.reference || null);
    setConfirmation(null);
    update("payment", { agreed: false });
    navigate(next);
  };
  const sequence = [
    "search",
    "outbound",
    ...(booking.search.tripType !== "One Way" ? ["return"] : []),
    "travellers",
    "seats",
    "extras",
    "payment",
    "confirmation",
  ];
  const index = sequence.indexOf(screen);
  const shortDate = (value) =>
    new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  const progressSteps = {
    outbound: 0,
    return: 0,
    travellers: 1,
    seats: 2,
    extras: 3,
    payment: 4,
  };
  const progress =
    screen in progressSteps
      ? {
          step: progressSteps[screen],
          route: {
            origin: code(booking.search.origin),
            destination: code(booking.search.destination),
            dates:
              booking.search.tripType === "One Way"
                ? shortDate(booking.search.departure)
                : `${shortDate(booking.search.departure)} - ${shortDate(booking.search.returnDate)}`,
            passengers: 1,
          },
          onModify: () => navigate("search"),
        }
      : null;
  const back = () => navigate(index <= 0 ? "home" : sequence[index - 1]);
  const next = () => {
    const target = sequence[index + 1];
    if (target in loaders) transition(target);
    else navigate(target);
  };
  const auxiliary = (page) => {
    if (["home", "search", "trips", "pass"].includes(page))
      return page === "search" ? newBooking() : navigate(page);
    if (page === "signout") {
      setAuthenticated(false);
      navigate("home");
      return;
    }
    const info = {
      policy: [
        "Travel policy",
        "WestJet preferred carrier · Economy cabin · Econo fare or above · CAD 800 roundtrip limit per traveller · Book at least 7 days ahead. Bookings above the limit require your company’s approval.",
      ],
      help: [
        "Help & support",
        "Contact your company travel administrator for booking support, changes, cancellations, or special requests. This demonstration does not issue tickets or process payments.",
      ],
      profiles: [
        "Traveller profiles",
        `${booking.traveller.firstName} ${booking.traveller.surname} · ${booking.traveller.email} · Northstar Studio. Edit passenger information during the booking flow.`,
      ],
      car: [
        "Car rental",
        "Contact your company travel administrator to arrange a rental for your itinerary. Car reservations are not connected in this flight-booking demo.",
      ],
      language: [
        "Language",
        "English (Canada) is the available language for this demonstration.",
      ],
      account: [
        "Maya Thompson · Northstar Studio",
        "Corporate Traveler · Operations · Cost centre CC-204 · WestJet Rewards ••••4821.",
        "signout",
      ],
      notifications: [
        "Disruptions & alerts",
        "Schedule change on WJ302 YYZ and a flight delay on WJ714 YYC. Review affected bookings from the dashboard.",
      ],
      benefits: [
        "Corporate travel benefits",
        "Preferred corporate rates, Travel Bank, Flight Pass, flexible fare bundles, and traveller profiles help you manage company travel.",
      ],
    };
    setDialog(
      info[page] || [
        "Travel tools",
        "Contact your travel administrator to arrange this service.",
      ],
    );
  };
  let content;
  if (screen === "home")
    content = (
      <Dashboard
        onBook={newBooking}
        onNavigate={auxiliary}
        onTrips={() => navigate("trips")}
      />
    );
  if (screen === "trips")
    content = (
      <Trips
        onView={(item) => {
          setBooking(structuredClone(item.booking));
          setConfirmation(item.confirmation);
          navigate("confirmation");
        }}
        onBook={newBooking}
      />
    );
  if (screen === "pass") content = <FlightPass onBook={newBooking} />;
  if (screen === "search")
    content = (
      <SearchStep onBack={back} onContinue={() => transition("outbound")} />
    );
  if (screen === "outbound" || screen === "return")
    content = (
      <FlightsStep
        key={screen}
        direction={screen}
        onBack={back}
        onContinue={next}
      />
    );
  if (screen === "travellers")
    content = <TravellersStep onBack={back} onContinue={next} />;
  if (screen === "seats")
    content = <SeatsStep onBack={back} onContinue={next} />;
  if (screen === "extras")
    content = <ExtrasStep onBack={back} onContinue={next} />;
  if (screen === "payment")
    content = <PaymentStep onBack={back} onContinue={complete} />;
  if (screen === "confirmation")
    content = (
      <ConfirmationStep
        onHome={() => navigate("trips")}
        onNew={newBooking}
        onEdit={edit}
        onViewPass={() => navigate("pass")}
      />
    );
  return (
    <BookingContext.Provider
      value={{
        booking,
        update,
        confirmation,
        reservations,
        notify: setMessage,
      }}
    >
      {!authenticated ? (
        <Login
          onLogin={signIn}
          onHelp={() =>
            setDialog([
              "Sign-in assistance",
              "Demo access: enter any valid email and a non-empty password. For a real account, contact your agency administrator.",
            ])
          }
        />
      ) : (
        <Shell
          active={["home", "trips", "pass"].includes(screen) ? screen : "search"}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onNavigate={auxiliary}
          tripCount={3 + reservations.length}
          progress={progress}
          footerNote={
            screen === "pass"
              ? "Illustrative data only · Sample passes, routes, dates and booking references"
              : undefined
          }
        >
          {content}
        </Shell>
      )}
      {loading && <LoadingModal type={loading} />}{" "}
      {message && (
        <div className="toast" role="status">
          {message}
          <button
            onClick={() => setMessage("")}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
      {dialog && (
        <div className="modal-backdrop" onClick={() => setDialog(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className="info-dialog"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") setDialog(null);
            }}
          >
            <h2 id="dialog-title">{dialog[0]}</h2>
            <p>{dialog[1]}</p>
            {dialog[2] === "signout" && (
              <button
                className="dialog-close"
                onClick={() => {
                  setDialog(null);
                  auxiliary("signout");
                }}
              >
                Sign out
              </button>
            )}
            <button
              autoFocus
              className="dialog-close"
              onClick={() => setDialog(null)}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </BookingContext.Provider>
  );
}
