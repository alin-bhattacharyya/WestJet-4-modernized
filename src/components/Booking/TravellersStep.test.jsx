import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TravellersStep } from "./TravellersStep";
import { BookingHarness } from "../../test/BookingHarness";
import { createBooking } from "../../state/booking";

const mount = (element, initial) =>
  render(<BookingHarness initial={initial}>{element}</BookingHarness>);
const continueButton = () => screen.getByRole("button", { name: "Continue" });

describe("TravellersStep", () => {
  it("shows the default passenger and contact details", () => {
    mount(<TravellersStep />);
    expect(
      screen.getByRole("heading", { name: "Enter your details" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Mr");
    expect(screen.getByLabelText("First name")).toHaveValue("Maya");
    expect(screen.getByLabelText("Surname")).toHaveValue("Thompson");
    expect(screen.getByLabelText("Date of birth")).toHaveValue("1985-04-12");
    expect(screen.getByText("12 Apr 1985")).toBeInTheDocument();
    expect(screen.getByLabelText("Gender")).toHaveValue("Female");
    expect(screen.getByLabelText("Nationality")).toHaveValue("Canadian");
    expect(screen.getByLabelText("Document Type")).toHaveValue("Passport");
    expect(screen.getByLabelText("Expiry date")).toHaveValue("2031-09-04");
    expect(screen.getByText("04 Sep 2031")).toBeInTheDocument();
    expect(screen.getByLabelText("Country code")).toHaveValue("+1");
    expect(screen.getByLabelText("Emergency contact name")).toHaveValue(
      "Anna Thompson",
    );
    expect(
      screen.getByText(/WestJet Rewards ••••4821 is attached to Maya Thompson/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Back to flights" }),
    ).toBeInTheDocument();
  });

  it("validates matching passenger emails", async () => {
    const next = vi.fn();
    mount(<TravellersStep onContinue={next} />);
    const email = screen.getByLabelText("Confirm email");
    await userEvent.clear(email);
    await userEvent.type(email, "different@example.com");
    await userEvent.click(continueButton());
    expect(screen.getByRole("alert")).toHaveTextContent("must match");
    expect(next).not.toHaveBeenCalled();
  });

  it("requires the document to be valid through the end of the trip", async () => {
    const next = vi.fn();
    mount(<TravellersStep onContinue={next} />);
    fireEvent.change(screen.getByLabelText("Expiry date"), {
      target: { value: "2026-11-10" },
    });
    expect(screen.getByText("10 Nov 2026")).toBeInTheDocument();
    await userEvent.click(continueButton());
    expect(screen.getByRole("alert")).toHaveTextContent(
      "valid through the end of your trip",
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("requires a date of birth before departure", async () => {
    const next = vi.fn();
    mount(<TravellersStep onContinue={next} />);
    fireEvent.change(screen.getByLabelText("Date of birth"), {
      target: { value: "2026-12-01" },
    });
    await userEvent.click(continueButton());
    expect(screen.getByRole("alert")).toHaveTextContent("before departure");
    expect(next).not.toHaveBeenCalled();
  });

  it("blocks continue when a required field is empty", async () => {
    const next = vi.fn();
    mount(<TravellersStep onContinue={next} />);
    const first = screen.getByLabelText("First name");
    await userEvent.clear(first);
    await userEvent.click(continueButton());
    expect(screen.getByRole("alert")).toHaveTextContent("First name");
    expect(first).toHaveAttribute("aria-invalid", "true");
    expect(next).not.toHaveBeenCalled();
    await userEvent.type(first, "Maya");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("continues when the details are valid and keeps edits", async () => {
    const next = vi.fn();
    mount(<TravellersStep onContinue={next} />);
    await userEvent.selectOptions(screen.getByLabelText("Title"), "Ms");
    expect(screen.getByLabelText("Title")).toHaveValue("Ms");
    const sms = screen.getByLabelText("Send booking updates by SMS");
    expect(sms).toBeChecked();
    await userEvent.click(sms);
    expect(sms).not.toBeChecked();
    await userEvent.click(continueButton());
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("uses the one-way departure date for document validity", async () => {
    const next = vi.fn();
    const initial = createBooking();
    mount(<TravellersStep onContinue={next} />, {
      ...initial,
      search: { ...initial.search, tripType: "One Way" },
      traveller: { ...initial.traveller, expiry: "2026-11-10" },
    });
    await userEvent.click(continueButton());
    expect(next).toHaveBeenCalledTimes(1);
  });
});
