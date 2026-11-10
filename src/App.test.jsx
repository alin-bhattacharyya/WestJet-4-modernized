import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("moves from login into dashboard and booking", async () => {
    render(<App />);
    await userEvent.type(
      screen.getByLabelText("Email or WestJet Rewards ID"),
      "Maya.Thompson@Corporate.com",
    );
    await userEvent.type(screen.getByLabelText("Password"), "Westjet1");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(
      (await screen.findAllByRole("heading", { name: /welcome back, maya/i }))
        .length,
    ).toBeGreaterThan(0);
    await userEvent.click(
      within(document.querySelector(".wj-header")).getByRole("button", {
        name: /New Booking/i,
      }),
    );
    expect(
      screen.getByRole("heading", { name: "Where is business taking you?" }),
    ).toBeVisible();
  });
});
