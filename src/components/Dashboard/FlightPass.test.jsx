import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FlightPass } from "./FlightPass";
import { BookingHarness } from "../../test/BookingHarness";

const renderPage = (onBook = vi.fn()) =>
  render(
    <BookingHarness>
      <FlightPass onBook={onBook} />
    </BookingHarness>,
  );

describe("FlightPass", () => {
  it("shows the page heading and the selected pass balance", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Your Flight Passes" }),
    ).toBeVisible();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel");
    expect(
      within(panel).getByRole("heading", {
        name: /Canada Domestic 10-Credit Pass/,
      }),
    ).toBeVisible();
    expect(within(panel).getByText("4 of 10 credits redeemed")).toBeVisible();
    expect(screen.getByText("KT7M2Q")).toBeVisible();
  });

  it("switches pass details when another pass tab is selected", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("tab", { name: /Pacific Coast/ }));
    expect(screen.getByRole("tab", { name: /Pacific Coast/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getByText("1 of 4 credits redeemed")).toBeVisible();
    expect(screen.queryByText("KT7M2Q")).toBeNull();
    expect(screen.getByText("MC3P7V")).toBeVisible();
  });

  it("disables booking with an expired pass", async () => {
    const book = vi.fn();
    renderPage(book);
    await userEvent.click(screen.getByRole("tab", { name: /Atlantic/ }));
    expect(
      screen.getByRole("button", { name: /Book with this pass/ }),
    ).toBeDisabled();
    expect(
      within(screen.getByRole("tabpanel")).getAllByText("Expired").length,
    ).toBeGreaterThan(0);
  });

  it("books with the selected pass", async () => {
    const book = vi.fn();
    renderPage(book);
    await userEvent.click(
      screen.getByRole("button", { name: /Book with this pass/ }),
    );
    expect(book).toHaveBeenCalledOnce();
    await userEvent.click(
      screen.getAllByRole("button", { name: /Explore pass/ })[0],
    );
    expect(book).toHaveBeenCalledTimes(2);
  });
});
