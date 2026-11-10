import { beforeEach, describe, expect, it } from "vitest";
import {
  calculateTotals,
  itinerary,
  createBooking,
  readDraft,
  saveDraft,
  legSummary,
} from "./booking";
beforeEach(() => localStorage.clear());
describe("booking totals and persistence", () => {
  it("exports connecting seat selections and omits unused return legs", () => {
    const booking = createBooking();
    booking.search.tripType = "One Way";
    booking.seats.outboundConnection = "26F";
    expect(itinerary(booking)).toContain("YVR → YYC: 26F");
    expect(itinerary(booking)).not.toContain("return:");
  });
  it("calculates all selected services and excludes unused return selections on one-way trips", () => {
    const b = createBooking();
    b.search.tripType = "One Way";
    b.extras.outbound.weight = 10;
    b.extras.outbound.meals = ["poutine", "salmon"];
    b.extras.outbound.comfort = ["lounge"];
    const t = calculateTotals(b);
    expect(t.fare).toBe(1598);
    expect(t.bundle).toBe(260);
    expect(t.seats).toBe(40);
    expect(t.extras).toBeCloseTo(112.98);
    expect(t.total).toBe(2022.98);
    expect(t.credits).toBe(3);
  });
  it("caps Travel Bank allocation and computes the remaining card payment", () => {
    const b = createBooking();
    b.payment.bank = 99999;
    const t = calculateTotals(b);
    expect(t.bank).toBe(Math.min(5000, t.total));
    expect(t.bank + t.card).toBe(t.total);
    b.payment.bank = -100;
    expect(calculateTotals(b).bank).toBe(0);
  });
  it("never persists card details or restores terms consent", () => {
    const b = createBooking();
    b.payment.cardNumber = "4111111111111111";
    b.payment.cvc = "123";
    b.payment.agreed = true;
    b.traveller.firstName = "Ravi";
    saveDraft(b);
    expect(localStorage.getItem("westzet.draft.v1")).not.toContain(
      "4111111111111111",
    );
    expect(localStorage.getItem("westzet.draft.v1")).not.toContain('"cvc"');
    expect(readDraft().payment.agreed).toBe(false);
    expect(readDraft().traveller.firstName).toBe("Ravi");
  });
  it("recovers from malformed draft JSON", () => {
    localStorage.setItem("westzet.draft.v1", "{broken");
    expect(readDraft()).toEqual(createBooking());
  });
});

describe("legSummary", () => {
  it("describes the departing and return legs for the trip summary", () => {
    const booking = createBooking();
    expect(legSummary(booking, "outbound")).toEqual({
      label: "Departing flight",
      number: "WJ 967",
      date: "Mon. Nov 9",
      stops: "1 stop",
      duration: "4h 07m",
      airports: ["YYZ", "YVR", "YYC"],
      times: "06:40 → 11:00",
    });
    expect(legSummary(booking, "return")).toMatchObject({
      label: "Return Flight",
      number: "WJ 968",
      date: "Thu. Nov 12",
      airports: ["YYC", "YVR", "YYZ"],
    });
  });

  it("totals the agency commission across legs", () => {
    expect(calculateTotals(createBooking()).commission).toBe(120);
  });
});
