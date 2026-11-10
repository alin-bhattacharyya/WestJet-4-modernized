import { seatCommission } from "../../state/booking";

// Representative seats used to derive each category's commission from data.
const ITEMS = [
  { kind: "available", title: "Available", detail: "from $0" },
  { kind: "front", title: "Front Extra", detail: "rows 1–5 · $20", sample: "1A" },
  { kind: "exit", title: "Extra Legroom", detail: "rows 16–17 · $25", sample: "16A" },
  { kind: "standard", title: "Standard", detail: "rows 6–15, 18–25 · $10", sample: "6A" },
  { kind: "available", title: "Free", detail: "rows 26–32 · $0" },
  { kind: "middle", title: "Empty Middle Seat", detail: "$35", mark: "·", extra: 11 },
  { kind: "selected", title: "Selected", detail: "Current selection", mark: "✓" },
  { kind: "occupied", title: "Occupied", detail: "Unavailable", mark: "·" },
  { kind: "restricted", title: "Restricted", detail: "Exit row conditions", mark: "✕" },
];

export function SeatsLegend() {
  return (
    <ul className="wj-seats__legend" aria-label="Seat legend">
      {ITEMS.map((item) => {
        const commission = item.sample ? seatCommission(item.sample) : item.extra;
        return (
          <li key={item.title}>
            <span
              className={`wj-seats__swatch wj-seats__swatch--${item.kind}`}
              aria-hidden="true"
            >
              {item.mark}
            </span>
            <span className="wj-seats__legend-text">
              <b>{item.title}</b>
              <span>
                {item.detail}
                {commission ? <em>+${commission}</em> : null}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
