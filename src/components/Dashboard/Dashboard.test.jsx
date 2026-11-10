import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dashboard, Trips } from "./Dashboard";
import { BookingHarness } from "../../test/BookingHarness";
import { BookingContext } from "../../state/BookingContext";
import { createBooking } from "../../state/booking";
import { useBooking } from "../../state/useBooking";

function SearchProbe() {
  const { booking } = useBooking();
  return <output data-testid="search">{JSON.stringify(booking.search)}</output>;
}

const reservation = () => {
  const booking = createBooking();
  return { booking, confirmation: { reference: "W8K2MP", date: "2026-11-01" } };
};

function withReservations(ui, reservations, notify = vi.fn()) {
  return (
    <BookingContext.Provider
      value={{
        booking: createBooking(),
        update: vi.fn(),
        confirmation: null,
        reservations,
        notify,
      }}
    >
      {ui}
    </BookingContext.Provider>
  );
}

describe("Dashboard", () => {
  it("shows the V3 dashboard sections with an empty search card", () => {
    render(
      <BookingHarness>
        <Dashboard onBook={vi.fn()} />
      </BookingHarness>,
    );
    expect(
      screen.getByRole("heading", { name: "Welcome back, Maya" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Search flights" })).toBeDisabled();
    expect(screen.getByLabelText("From")).toHaveValue("");
    expect(screen.getByRole("heading", { name: "Upcoming trip" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Upcoming Trips" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Disruptions & Alerts" }),
    ).toBeVisible();
    expect(screen.getByText("Flight Pass Balance")).toBeVisible();
    expect(screen.queryByText("Travel Bank Balance")).not.toBeInTheDocument();
  });

  it("writes the filled search into the booking and opens booking", async () => {
    const book = vi.fn();
    render(
      <BookingHarness>
        <Dashboard onBook={book} />
        <SearchProbe />
      </BookingHarness>,
    );
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("From"), "Toronto Pearson (YYZ)");
    await user.selectOptions(screen.getByLabelText("To"), "Calgary (YYC)");
    await user.click(screen.getByRole("button", { name: /Depart · Return/ }));
    fireEvent.change(screen.getByLabelText("Depart"), {
      target: { value: "2026-11-09" },
    });
    fireEvent.change(screen.getByLabelText("Return"), {
      target: { value: "2026-11-12" },
    });
    expect(
      screen.getByRole("button", { name: /Depart · Return/ }),
    ).toHaveTextContent("9–12 Nov 2026");
    await user.selectOptions(screen.getByLabelText("Passengers"), "1");
    await user.selectOptions(screen.getByLabelText("Cabin"), "Economy");
    await user.click(
      screen.getByRole("switch", { name: "Flight Pass Eligible Flights" }),
    );
    const submit = screen.getByRole("button", { name: "Search flights" });
    expect(submit).toBeEnabled();
    await user.click(submit);
    expect(book).toHaveBeenCalledOnce();
    const search = JSON.parse(screen.getByTestId("search").textContent);
    expect(search).toMatchObject({
      tripType: "Round Trip",
      origin: "Toronto Pearson (YYZ)",
      destination: "Calgary (YYC)",
      departure: "2026-11-09",
      returnDate: "2026-11-12",
      passengers: 1,
      cabin: "Economy",
      passOnly: true,
      car: false,
    });
  });

  it("supports one-way searches", async () => {
    render(
      <BookingHarness>
        <Dashboard onBook={vi.fn()} />
        <SearchProbe />
      </BookingHarness>,
    );
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("Trip type"), "One Way");
    await user.click(screen.getByRole("button", { name: /^Depart/ }));
    expect(screen.queryByLabelText("Return")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Depart"), {
      target: { value: "2026-11-09" },
    });
    await user.selectOptions(screen.getByLabelText("From"), "Calgary (YYC)");
    await user.selectOptions(screen.getByLabelText("To"), "Vancouver (YVR)");
    await user.selectOptions(screen.getByLabelText("Passengers"), "2");
    await user.selectOptions(screen.getByLabelText("Cabin"), "Premium");
    await user.click(screen.getByRole("button", { name: "Search flights" }));
    const search = JSON.parse(screen.getByTestId("search").textContent);
    expect(search).toMatchObject({ tripType: "One Way", passengers: 2 });
  });

  it("filters recent activity", async () => {
    render(
      <BookingHarness>
        <Dashboard onBook={vi.fn()} />
      </BookingHarness>,
    );
    await userEvent.type(screen.getByLabelText("Filter activity"), "refund");
    expect(screen.getByText("Refund approved - $342")).toBeVisible();
    expect(screen.queryByText("Ticket reissued - WJ303")).not.toBeInTheDocument();
  });

  it("lists a completed booking first in Upcoming Trips", () => {
    render(withReservations(<Dashboard onBook={vi.fn()} />, [reservation()]));
    const rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("Maya Thompson")).toBeVisible();
    expect(within(rows[1]).getByText("YYZ → YYC")).toBeVisible();
    expect(within(rows[1]).getByText("Nov 9, 2026")).toBeVisible();
    expect(rows).toHaveLength(6);
  });
});

describe("Trips", () => {
  it("shows reservations and company trips", async () => {
    const view = vi.fn();
    const notify = vi.fn();
    const item = reservation();
    render(withReservations(<Trips onView={view} onBook={vi.fn()} />, [item], notify));
    expect(screen.getByRole("heading", { name: "My trips" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "View itinerary W8K2MP" }));
    expect(view).toHaveBeenCalledWith(item);
    expect(screen.getByRole("heading", { name: "Company trips" })).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Trip actions for Olivia Martin" }),
    );
    expect(notify).toHaveBeenCalled();
  });
});
