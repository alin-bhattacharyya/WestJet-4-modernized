import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PaymentStep } from "./PaymentStep";
import { BookingHarness } from "../../test/BookingHarness";
import { calculateTotals, createBooking, money } from "../../state/booking";
const mount = (element, initial) =>
  render(<BookingHarness initial={initial}>{element}</BookingHarness>);
const complete = () =>
  userEvent.click(screen.getByRole("button", { name: /Complete booking/ }));
describe("PaymentStep", () => {
  it("requires consent and switches to the Flight Pass state", async () => {
    const next = vi.fn();
    mount(<PaymentStep onContinue={next} />);
    await complete();
    expect(screen.getByRole("alert")).toHaveTextContent("agree");
    await userEvent.click(screen.getByRole("radio", { name: "Flight Pass" }));
    expect(screen.getByRole("radio", { name: "Flight Pass" })).toBeChecked();
    expect(screen.getByText("Credits required for this booking")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Cost Summary" })).toBeVisible();
    expect(screen.queryByText("Billing details")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: /agree/ }));
    await complete();
    expect(next).toHaveBeenCalledOnce();
  });
  it("rejects an insufficient Travel Bank balance", async () => {
    const next = vi.fn();
    const initial = createBooking();
    initial.payment.bank = 10;
    initial.payment.agreed = true;
    initial.payment.method = "Travel Bank";
    mount(<PaymentStep onContinue={next} />, initial);
    await complete();
    expect(screen.getByRole("alert")).toHaveTextContent("does not cover");
    expect(next).not.toHaveBeenCalled();
  });
  it("shows the split allocation and lets the Travel Bank amount change", async () => {
    mount(<PaymentStep onContinue={vi.fn()} />);
    expect(screen.getByRole("radio", { name: "Split Payment" })).toBeChecked();
    expect(screen.getByText("Remaining TO PAY · Corporate Visa")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Payment Summary" })).toBeVisible();
    const amount = screen.getByRole("textbox", {
      name: "Amount applied from Travel Bank",
    });
    expect(amount).toHaveValue(money(calculateTotals(createBooking()).bank));
    await userEvent.clear(amount);
    await userEvent.type(amount, "1000");
    await userEvent.tab();
    expect(amount).toHaveValue("$1,000.00");
    const remaining = screen.getByText("Remaining BANK BALANCE").parentElement;
    expect(within(remaining).getByText("$4,000.00")).toBeVisible();
    expect(screen.getByText("Billing details")).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Company" })).toHaveValue(
      "Northstar Studio",
    );
  });
  it("validates personal card details before completing", async () => {
    const next = vi.fn();
    const initial = createBooking();
    initial.payment.agreed = true;
    mount(<PaymentStep onContinue={next} />, initial);
    await userEvent.click(screen.getByRole("radio", { name: "Personal Card" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Cardholder name" }),
      "Maya Thompson",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Card number" }),
      "4111",
    );
    await complete();
    expect(screen.getByRole("alert")).toHaveTextContent("valid demo card");
    await userEvent.type(
      screen.getByRole("textbox", { name: "Card number" }),
      "111111111111",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Expiry (MM/YY)" }),
      "09/28",
    );
    await userEvent.type(screen.getByLabelText("Security code"), "123");
    await complete();
    expect(next).toHaveBeenCalledOnce();
  });
  it("lets every payment method be selected", async () => {
    mount(<PaymentStep onContinue={vi.fn()} />);
    for (const method of [
      "Travel Bank",
      "Corporate Card",
      "Personal Card",
      "Flight Pass",
      "Split Payment",
    ]) {
      await userEvent.click(screen.getByRole("radio", { name: method }));
      expect(screen.getByRole("radio", { name: method })).toBeChecked();
    }
    await userEvent.click(screen.getByRole("radio", { name: "Corporate Card" }));
    expect(
      screen.getByRole("combobox", { name: "Saved corporate card" }),
    ).toHaveValue("Corporate Visa ••••1842");
  });
});
