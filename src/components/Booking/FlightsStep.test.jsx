import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FlightsStep } from "./FlightsStep";
import { BookingHarness } from "../../test/BookingHarness";
import { createBooking } from "../../state/booking";

const mount = (element, initial) =>
  render(<BookingHarness initial={initial}>{element}</BookingHarness>);
const card = (time) => screen.getByRole("article", { name: new RegExp(`^${time}`) });
const departures = () =>
  screen
    .getAllByRole("article")
    .map((item) => item.getAttribute("aria-label").slice(0, 5));

describe("FlightsStep", () => {
  it("always shows the action bar and continues with the selected fare", async () => {
    const onContinue = vi.fn();
    mount(<FlightsStep onContinue={onContinue} />);
    expect(screen.getByRole("button", { name: /Select return flight/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    const premium = within(card("06:40")).getByRole("button", {
      name: /View Premium fares/,
    });
    await userEvent.click(premium);
    expect(premium).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("region", { name: /Premium fares for 06:40/ });
    expect(within(panel).getByRole("heading", { name: "PremiumFlex" })).toBeInTheDocument();
    expect(within(panel).getByText("$1,858")).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: "Compare" })).toBeDisabled();
    await userEvent.click(within(panel).getByRole("button", { name: /^Select/ }));
    expect(within(panel).getByRole("button", { name: /Selected/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const next = screen.getByRole("button", { name: /Select return flight/ });
    expect(next).toBeEnabled();
    await userEvent.click(next);
    expect(onContinue).toHaveBeenCalled();
  });

  it("hides fares excluded by the fare filter until all fares are shown", async () => {
    mount(<FlightsStep />);
    await userEvent.click(
      within(card("09:15")).getByRole("button", { name: /View Economy fares/ }),
    );
    const panel = screen.getByRole("region", { name: /Economy fares for 09:15/ });
    expect(within(panel).getByText(/hidden by the Fare filter/)).toBeInTheDocument();
    await userEvent.click(within(panel).getByRole("button", { name: "Show all fares" }));
    expect(screen.getByRole("checkbox", { name: "PremiumFlex" })).not.toBeChecked();
    expect(within(panel).getByRole("heading", { name: "Econo" })).toBeInTheDocument();
    await userEvent.click(within(panel).getByRole("button", { name: "Compare" }));
    expect(within(panel).getByRole("table")).toBeInTheDocument();
    await userEvent.click(within(panel).getAllByRole("button", { name: /^Select/ })[1]);
    expect(
      screen.getByRole("button", { name: /Select return flight/ }),
    ).toBeEnabled();
  });

  it("filters by stops, departure time and the commission toggle", async () => {
    mount(<FlightsStep />);
    expect(departures()).toEqual(["06:40", "09:15", "14:05", "19:10"]);
    expect(screen.getByRole("checkbox", { name: "Nonstop (2)" })).not.toBeChecked();
    await userEvent.click(screen.getByRole("checkbox", { name: "Nonstop (2)" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "1 stop (4)" }));
    expect(departures()).toEqual(["08:00", "16:30"]);
    await userEvent.click(screen.getByRole("button", { name: "12:00–18:00" }));
    expect(departures()).toEqual(["16:30"]);
    await userEvent.click(screen.getByRole("button", { name: "00:00–06:00" }));
    expect(screen.getByText(/No flights match these filters/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "All Items" }));
    expect(departures()).toHaveLength(6);
    const toggle = screen.getByRole("switch", { name: /above \$55 commission/ });
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("uses the range sliders, aircraft filter and sorting", async () => {
    mount(<FlightsStep />);
    const maxPrice = screen.getByRole("slider", { name: "Maximum price" });
    expect(screen.getByText("$1,000 - $3,500")).toBeInTheDocument();
    // jsdom cannot drag range thumbs, so set the value directly.
    fireEvent.change(maxPrice, { target: { value: "1000" } });
    expect(screen.getByText(/No flights match these filters/)).toBeInTheDocument();
    fireEvent.change(maxPrice, { target: { value: "4300" } });
    expect(screen.getByText("$1,000 - $4,300")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "Boeing 737-8 MAX" }));
    expect(departures()).toEqual(["09:15"]);
    await userEvent.click(screen.getByRole("checkbox", { name: "Boeing 737-8 MAX" }));
    await userEvent.click(screen.getByRole("button", { name: "Lowest price" }));
    expect(departures()).toEqual(["19:10", "09:15", "06:40", "14:05"]);
    await userEvent.click(screen.getByRole("button", { name: "Departure time" }));
    expect(departures()).toEqual(["06:40", "09:15", "14:05", "19:10"]);
  });

  it("filters by time of day from the best time cards and explains savings", async () => {
    mount(<FlightsStep />);
    expect(screen.getByText("from $1,301")).toBeInTheDocument();
    expect(screen.getByText(/Moving this booking to the evening saves/)).toBeInTheDocument();
    expect(screen.getByText("$600 per adult.")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /^Evening/ }));
    expect(departures()).toEqual(["19:10"]);
  });

  it("expands flight details and the corporate benefits banner", async () => {
    mount(<FlightsStep />);
    const details = within(card("06:40")).getByRole("button", {
      name: "See Flight Details",
    });
    await userEvent.click(details);
    expect(details).toHaveAttribute("aria-expanded", "true");
    expect(within(card("06:40")).getByText(/47-minute connection in Vancouver/)).toBeInTheDocument();
    const learn = screen.getByRole("button", { name: "Learn more" });
    await userEvent.click(learn);
    expect(learn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/negotiated corporate discount/)).toBeInTheDocument();
  });

  it("moves through the date strip", async () => {
    mount(<FlightsStep />);
    const strip = screen.getByRole("group", { name: "Departure dates" });
    expect(within(strip).getByRole("button", { name: /Mon\. Nov 9/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(strip).getByRole("button", { name: /Sat\. Nov 7/ })).toBeDisabled();
    await userEvent.click(within(strip).getByRole("button", { name: /Tue\. Nov 10/ }));
    expect(within(strip).getByRole("button", { name: /Tue\. Nov 10/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.click(screen.getByRole("button", { name: "Next dates" }));
    expect(within(strip).getByRole("button", { name: /Sat\. Nov 14/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Previous dates" }));
    expect(within(strip).getByRole("button", { name: /Sat\. Nov 7/ })).toBeInTheDocument();
  });

  it("shows the return direction and continues to traveller info", async () => {
    const booking = createBooking();
    mount(<FlightsStep direction="return" />, booking);
    expect(screen.getByRole("heading", { name: "Select return flight" })).toBeInTheDocument();
    expect(screen.getByText("Best time to fly (YYC → YYZ)")).toBeInTheDocument();
    const strip = screen.getByRole("group", { name: "Return dates" });
    expect(within(strip).getByRole("button", { name: /Thu\. Nov 12/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.click(
      within(card("06:40")).getByRole("button", { name: /View Premium fares/ }),
    );
    await userEvent.click(screen.getByRole("button", { name: /^Select/ }));
    expect(
      screen.getByRole("button", { name: "Continue to traveller info" }),
    ).toBeEnabled();
  });
});
