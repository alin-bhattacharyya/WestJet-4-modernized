import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Login } from "./Login";

describe("Login", () => {
  it("enables sign in only after both credentials are entered", async () => {
    const onLogin = vi.fn();
    render(<Login onLogin={onLogin} />);
    expect(screen.getByRole("img", { name: "WestJet" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeVisible();
    const submit = screen.getByRole("button", { name: "Sign in" });
    expect(submit).toBeDisabled();
    await userEvent.type(
      screen.getByLabelText("Email or WestJet Rewards ID"),
      "Maya.Thompson@Corporate.com",
    );
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Password"), "Westjet1");
    expect(submit).toBeEnabled();
    await userEvent.click(submit);
    expect(onLogin).toHaveBeenCalledOnce();
  });

  it("toggles password visibility", async () => {
    render(<Login onLogin={() => {}} />);
    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
  });
});
