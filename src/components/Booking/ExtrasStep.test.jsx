import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ExtrasStep } from "./ExtrasStep";
import { BookingHarness } from "../../test/BookingHarness";
import { createBooking } from "../../state/booking";

const mount = (element, initial) =>
  render(<BookingHarness initial={initial}>{element}</BookingHarness>);

const emptyExtras = () => {
  const booking = createBooking();
  return {
    ...booking,
    extras: {
      outbound: { weight: 0, meals: [], comfort: [] },
      return: { weight: 0, meals: [], comfort: [] },
    },
  };
};

const weightButton = (label) => screen.getByRole("button", { name: label });

describe("ExtrasStep", () => {
  it("keeps per-direction extras and updates totals", async () => {
    mount(<ExtrasStep />, emptyExtras());
    const before = screen.getByTestId("booking-total").textContent;
    await userEvent.click(weightButton("+10 kg ($38)"));
    expect(screen.getByTestId("booking-total").textContent).not.toBe(before);
    expect(weightButton("+10 kg ($38)")).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(
      screen.getByRole("button", { name: /Add Classic Poutine/ }),
    );
    await userEvent.click(screen.getByRole("button", { name: /Return ·/ }));
    expect(weightButton("+10 kg ($38)")).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: /Add Classic Poutine/ }),
    ).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(screen.getByRole("button", { name: /Outbound ·/ }));
    expect(weightButton("+10 kg ($38)")).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /Added Classic Poutine/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("clears extra weight when the selected option is clicked again", async () => {
    mount(<ExtrasStep />, emptyExtras());
    await userEvent.click(weightButton("+5 kg ($19)"));
    expect(screen.getByText("1 extra bag added")).toBeInTheDocument();
    await userEvent.click(weightButton("+5 kg ($19)"));
    expect(screen.getByText("No extra bags")).toBeInTheDocument();
  });

  it("shows the frame's default selections in the summary", () => {
    mount(<ExtrasStep />);
    const summary = screen.getByRole("region", { name: "Your booking" });
    expect(within(summary).getByText("+10 kg baggage")).toBeInTheDocument();
    expect(within(summary).getByText("Classic Poutine & Soft Drink")).toBeInTheDocument();
    expect(within(summary).getAllByText("Both ways").length).toBe(2);
    expect(within(summary).getByText("$76.00")).toBeInTheDocument();
    expect(within(summary).getByText("SMS notifications")).toBeInTheDocument();
    expect(screen.getByText("2 meals selected")).toBeInTheDocument();
  });

  it("removes an extra from both directions from the summary", async () => {
    mount(<ExtrasStep />);
    await userEvent.click(
      screen.getByRole("button", { name: "Remove Atlantic Salmon & Herb Rice" }),
    );
    expect(screen.getByText("1 meal selected")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Return ·/ }));
    expect(screen.getByText("No meals selected")).toBeInTheDocument();
  });

  it("toggles comfort services and SMS notifications", async () => {
    mount(<ExtrasStep />, emptyExtras());
    const before = screen.getByTestId("booking-total").textContent;
    const lounge = screen.getByRole("switch", { name: "Lounge Access" });
    await userEvent.click(lounge);
    expect(lounge).toHaveAttribute("aria-checked", "true");
    expect(screen.getByTestId("booking-total").textContent).not.toBe(before);
    const sms = screen.getByRole("switch", { name: "SMS Notifications" });
    expect(sms).toHaveAttribute("aria-checked", "true");
    await userEvent.click(sms);
    expect(sms).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("switch", { name: "SunFlex" })).toBeDisabled();
  });

  it("hides Open Ticket on one-way trips and collapses sections", async () => {
    const booking = emptyExtras();
    mount(<ExtrasStep />, {
      ...booking,
      search: { ...booking.search, tripType: "One Way" },
    });
    expect(screen.queryByRole("switch", { name: "Open Ticket" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Return ·/ })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Collapse Meals" }));
    expect(screen.queryByRole("button", { name: /Add Classic Poutine/ })).toBeNull();
  });

  it("navigates with the flow actions", async () => {
    const onBack = vi.fn();
    const onContinue = vi.fn();
    mount(<ExtrasStep onBack={onBack} onContinue={onContinue} />);
    await userEvent.click(screen.getByRole("button", { name: "Back to Seats" }));
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onBack).toHaveBeenCalled();
    expect(onContinue).toHaveBeenCalled();
  });
});
