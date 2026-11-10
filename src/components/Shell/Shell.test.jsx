import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Shell } from "./Shell";

describe("Shell", () => {
  it("navigates with sidebar controls", async () => {
    const navigate = vi.fn();
    render(
      <Shell
        title="Welcome"
        active="home"
        onNavigate={navigate}
        onToggle={() => {}}
      >
        Content
      </Shell>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Book a flight" }),
    );
    expect(navigate).toHaveBeenCalledWith("search");
    expect(screen.getByText("WestJet BizWeb")).toBeVisible();
  });
});
