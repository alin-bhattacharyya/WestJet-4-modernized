import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchStep } from "./SearchStep";
import { BookingHarness } from "../../test/BookingHarness";
import { createBooking } from "../../state/booking";
const mount = (element, initial) =>
  render(<BookingHarness initial={initial}>{element}</BookingHarness>);
const withSearch = (patch) => {
  const booking = createBooking();
  return { ...booking, search: { ...booking.search, ...patch } };
};
const submit = () =>
  userEvent.click(screen.getByRole("button", { name: /Search flights/ }));

describe("SearchStep", () => {
  it("rejects the same origin and destination", async () => {
    const next = vi.fn();
    mount(<SearchStep onContinue={next} />);
    await userEvent.selectOptions(
      screen.getByLabelText(/Destination/),
      "Toronto Pearson (YYZ)",
    );
    await submit();
    expect(screen.getByRole("alert")).toHaveTextContent("different");
    expect(next).not.toHaveBeenCalled();
  });

  it("continues with a valid search", async () => {
    const next = vi.fn();
    mount(<SearchStep onContinue={next} />);
    await submit();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("requires a business reason", async () => {
    const next = vi.fn();
    mount(<SearchStep onContinue={next} />);
    await userEvent.clear(screen.getByLabelText(/Business reason/));
    await submit();
    expect(screen.getByRole("alert")).toHaveTextContent(/business reason/i);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a return date before departure", async () => {
    const next = vi.fn();
    mount(
      <SearchStep onContinue={next} />,
      withSearch({ returnDate: "2026-11-05" }),
    );
    await submit();
    expect(screen.getByRole("alert")).toHaveTextContent(/Return date/);
    expect(next).not.toHaveBeenCalled();
  });

  it("shows the dates as in the design with the weekday in the hint", () => {
    mount(<SearchStep onContinue={vi.fn()} />);
    expect(screen.getByText("9 Nov 2026")).toBeInTheDocument();
    expect(screen.getByText("12 Nov 2026")).toBeInTheDocument();
    expect(
      screen.getByText("Monday · Local departure date"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Thursday · Local departure date"),
    ).toBeInTheDocument();
  });

  it("updates the weekday hint when the departure date changes", async () => {
    mount(<SearchStep onContinue={vi.fn()} />);
    const input = screen.getByLabelText("Departure date");
    await userEvent.clear(input);
    await userEvent.type(input, "2026-11-10");
    expect(screen.getByText("10 Nov 2026")).toBeInTheDocument();
    expect(
      screen.getByText("Tuesday · Local departure date"),
    ).toBeInTheDocument();
  });

  it("disables the return date for one-way trips", async () => {
    mount(<SearchStep onContinue={vi.fn()} />);
    expect(screen.getByLabelText("Return date")).toBeEnabled();
    await userEvent.click(screen.getByRole("tab", { name: "One Way" }));
    expect(screen.getByRole("tab", { name: "One Way" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByLabelText("Return date")).toBeDisabled();
  });

  it("keeps Multi City visible but not selectable", async () => {
    mount(<SearchStep onContinue={vi.fn()} />);
    const multi = screen.getByRole("tab", { name: "Multi City" });
    expect(multi).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(multi);
    expect(multi).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Round Trip" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("binds the car rental and flight pass toggles", async () => {
    mount(<SearchStep onContinue={vi.fn()} />);
    const car = screen.getByRole("switch", { name: "Include a Car Rental" });
    const pass = screen.getByRole("switch", {
      name: "Flight Pass Eligible Flights",
    });
    expect(car).not.toBeChecked();
    await userEvent.click(car);
    expect(car).toBeChecked();
    expect(screen.getByText(/Car rental can be arranged/)).toBeInTheDocument();
    await userEvent.click(pass);
    expect(pass).toBeChecked();
  });

  it("renders the corporate traveller and the policy column", () => {
    mount(<SearchStep onContinue={vi.fn()} />);
    expect(screen.getByLabelText("Corporate traveller")).toHaveDisplayValue(
      "Maya Thompson · Northstar Studio",
    );
    expect(screen.getByLabelText(/Travel purpose/)).toHaveDisplayValue(
      "Client meeting",
    );
    expect(screen.getByText("Corporate benefits")).toBeInTheDocument();
    expect(screen.getByText("Travel policy reminders")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View details" }),
    ).toBeInTheDocument();
  });
});
