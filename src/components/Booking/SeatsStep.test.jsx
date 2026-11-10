import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SeatsStep } from "./SeatsStep";
import { BookingHarness } from "../../test/BookingHarness";
const mount = (element, initial) =>
  render(<BookingHarness initial={initial}>{element}</BookingHarness>);
const summary = () => screen.getByRole("region", { name: "Selected Seats" });
describe("SeatsStep", () => {
  it("keeps separate seats for each direction", async () => {
    mount(<SeatsStep />);
    await userEvent.click(screen.getByRole("button", { name: "7F, $10.00" }));
    expect(screen.getByRole("button", { name: "7F, $10.00" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.click(screen.getByRole("button", { name: /Return ·/ }));
    expect(screen.getByRole("button", { name: "4A, $20.00" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("button", { name: /1B,.*occupied/ }),
    ).toBeDisabled();
  });

  it("keeps a separate seat for each connection segment", async () => {
    mount(<SeatsStep />);
    expect(
      screen.getByRole("button", { name: "Outbound flight YYZ to YVR" }),
    ).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "26C, $0.00" }));
    await userEvent.click(
      screen.getByRole("button", { name: "Outbound flight YVR to YYC" }),
    );
    expect(screen.getByRole("button", { name: "4A, $20.00" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "26C, $0.00" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    const rows = within(summary()).getAllByRole("listitem");
    expect(rows).toHaveLength(4);
    expect(rows[0]).toHaveTextContent("YYZYVR26C$0.00");
    expect(rows[1]).toHaveTextContent("YVRYYC4A$20.00+$4");
  });

  it("calculates the seat subtotal and commission", async () => {
    mount(<SeatsStep />);
    expect(within(summary()).getByText("$80.00")).toBeInTheDocument();
    expect(within(summary()).getByText("+$16 commission")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "7F, $10.00" }));
    expect(within(summary()).getByText("$70.00")).toBeInTheDocument();
    expect(within(summary()).getByText("+$15 commission")).toBeInTheDocument();
  });

  it("restricts exit-row seats until the traveller consents", async () => {
    mount(<SeatsStep />);
    const exitSeat = () =>
      screen.getByRole("button", { name: /^16A, \$25\.00/ });
    expect(exitSeat()).toBeDisabled();
    expect(exitSeat()).toHaveAccessibleName("16A, $25.00, restricted");
    await userEvent.click(
      screen.getByRole("checkbox", { name: /exit-row requirements/ }),
    );
    expect(exitSeat()).toBeEnabled();
    await userEvent.click(exitSeat());
    expect(exitSeat()).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(
      screen.getByRole("checkbox", { name: /exit-row requirements/ }),
    );
    expect(exitSeat()).toHaveAttribute("aria-pressed", "false");
    expect(within(summary()).getAllByText("No seat")).toHaveLength(1);
  });

  it("toggles a selected seat off and wires the flow actions", async () => {
    const onBack = vi.fn();
    const onContinue = vi.fn();
    mount(<SeatsStep onBack={onBack} onContinue={onContinue} />);
    await userEvent.click(screen.getByRole("button", { name: "4A, $20.00" }));
    expect(screen.getByRole("button", { name: "4A, $20.00" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Back to Traveller Info" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onBack).toHaveBeenCalled();
    expect(onContinue).toHaveBeenCalled();
  });

  it("cycles the seat map zoom", async () => {
    mount(<SeatsStep />);
    await userEvent.click(screen.getByRole("button", { name: "Zoom 100%" }));
    expect(screen.getByRole("button", { name: "Zoom 125%" })).toBeInTheDocument();
  });
});
