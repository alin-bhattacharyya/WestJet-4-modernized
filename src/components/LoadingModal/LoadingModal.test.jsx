import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingModal } from "./LoadingModal";

describe("LoadingModal", () => {
  it("shows the requested booking state", () => {
    render(<LoadingModal type="payment" />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Preparing Your Payment Options",
    );
  });

  it("announces the order creation state", () => {
    render(<LoadingModal type="booking" />);
    expect(screen.getByRole("status")).toHaveTextContent("Creating your Order");
  });

  it("renders a text-free spinner with an accessible label", () => {
    render(<LoadingModal type="spinner" />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeVisible();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
