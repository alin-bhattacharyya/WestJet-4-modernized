import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConfirmationStep } from "./ConfirmationStep";
import { BookingContext } from "../../state/BookingContext";
import { createBooking } from "../../state/booking";

const confirmation = { reference: "WZ0002", date: "2026-10-20T10:42:00" };
const mount = (props = {}, booking = createBooking()) => {
  const notify = vi.fn();
  const handlers = {
    onHome: vi.fn(),
    onNew: vi.fn(),
    onEdit: vi.fn(),
    ...props,
  };
  render(
    <BookingContext.Provider
      value={{ booking, update: vi.fn(), confirmation, notify }}
    >
      <ConfirmationStep {...handlers} />
    </BookingContext.Provider>,
  );
  return { ...handlers, notify };
};

const readBlob = (blob) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(blob);
  });

describe("ConfirmationStep", () => {
  let created;
  beforeEach(() => {
    created = [];
    URL.createObjectURL = vi.fn((blob) => {
      created.push(blob);
      return "blob:demo";
    });
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("shows the booking reference, traveller and confirmed flights", () => {
    mount();
    expect(screen.getByRole("heading", { name: "Your trip is ready" })).toBeVisible();
    expect(screen.getByText("WZ0002")).toBeVisible();
    expect(
      screen.getByText("Maya Thompson · Toronto ⇄ Calgary · 9–12 Nov 2026"),
    ).toBeVisible();
    expect(screen.getByText("Outbound · Mon, 9 Nov 2026")).toBeVisible();
    expect(screen.getByText("Return · Thu, 12 Nov 2026")).toBeVisible();
    expect(
      screen.getByText(/confirmation email has been sent to Maya.Thompson@Corporate.com/),
    ).toBeVisible();
  });

  it("wires the action buttons", async () => {
    const { onHome, onNew, notify } = mount();
    await userEvent.click(screen.getByRole("button", { name: "View Trip" }));
    expect(onHome).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole("button", { name: "Book Another Flight" }));
    expect(onNew).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole("button", { name: "Email to passenger" }));
    expect(notify).toHaveBeenCalledWith(expect.stringContaining("Maya.Thompson@Corporate.com"));
  });

  it("downloads the itinerary, invoice and calendar file", async () => {
    mount();
    await userEvent.click(screen.getByRole("button", { name: "Download Itinerary" }));
    await userEvent.click(screen.getByRole("button", { name: "Download invoice" }));
    await userEvent.click(screen.getByRole("button", { name: "Add to Calendar" }));
    expect(created).toHaveLength(3);
    expect(await readBlob(created[0])).toContain("Reference: WZ0002");
    expect(await readBlob(created[1])).toContain("INVOICE");
    expect(created[2].type).toBe("text/calendar");
  });

  it("routes manage actions back into the booking flow", async () => {
    const { onEdit } = mount();
    await userEvent.click(screen.getByRole("button", { name: /Change flight/ }));
    await userEvent.click(screen.getByRole("button", { name: /Add services/ }));
    await userEvent.click(screen.getByRole("button", { name: /Change seats/ }));
    await userEvent.click(screen.getByRole("button", { name: /Update passenger details/ }));
    await userEvent.click(screen.getByRole("button", { name: "Update contact details" }));
    expect(onEdit.mock.calls.map(([screenKey]) => screenKey)).toEqual([
      "search",
      "extras",
      "seats",
      "travellers",
      "travellers",
    ]);
  });

  it("summarises a Flight Pass payment", () => {
    const booking = createBooking();
    booking.payment.method = "Flight Pass";
    mount({}, booking);
    expect(screen.getByText("WestJet Canada Flex Flight Pass")).toBeVisible();
    expect(screen.getByText("Total paid").nextSibling).toHaveTextContent("$0.00");
  });
  it("opens the Flight Pass page when a handler is provided", async () => {
    const onViewPass = vi.fn();
    mount({ onViewPass });
    await userEvent.click(screen.getByRole("button", { name: "View Flight Pass" }));
    expect(onViewPass).toHaveBeenCalledOnce();
  });
});
