import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BookingProgress } from "./BookingProgress";

const route = { origin: "YYZ", destination: "YYC", dates: "Nov 9 - Nov 12", passengers: 1 };

describe("BookingProgress", () => {
  it("renders six stages and marks the current one", () => {
    render(<BookingProgress step={2} route={route} onModify={() => {}} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(screen.getByText("Seats").closest("li")).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("Flights").closest("li")).toHaveClass("is-done");
  });

  it("only allows modifying the search on the flights step", async () => {
    const modify = vi.fn();
    const { rerender } = render(<BookingProgress step={0} route={route} onModify={modify} />);
    await userEvent.click(screen.getByRole("button", { name: "Modify" }));
    expect(modify).toHaveBeenCalledOnce();
    rerender(<BookingProgress step={1} route={route} onModify={modify} />);
    expect(screen.getByRole("button", { name: "Modify" })).toBeDisabled();
  });
});
