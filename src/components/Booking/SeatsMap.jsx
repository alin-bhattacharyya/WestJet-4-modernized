import { useState } from "react";
import { exitRows as EXIT_ROWS, money, seatPrice } from "../../state/booking";
import { SeatsLegend } from "./SeatsLegend";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

const OCCUPIED = new Set(
  "1B 1E 2C 2D 2F 3A 3F 4D 5B 5C 6A 6B 6E 7C 14D 14F 15B 18F 25A 25C 25D 26B 26E 32A 32F".split(" "),
);
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
// Cabin sections: front extra, standard, exit rows, standard + free rear rows.
const SECTIONS = [
  { key: "front", rows: range(1, 5) },
  { key: "standard", rows: range(6, 15) },
  { key: "exit", rows: EXIT_ROWS },
  { key: "rear", rows: range(18, 32) },
];
const ZOOM_LEVELS = [100, 125, 150];

const seatKind = (row) =>
  row <= 5 ? "front" : EXIT_ROWS.includes(row) ? "exit" : row >= 26 ? "free" : "standard";

function Seat({ seat, row, letter, selected, exitConsent, onToggle }) {
  const occupied = OCCUPIED.has(seat);
  const restricted = !occupied && EXIT_ROWS.includes(row) && !exitConsent;
  const state = selected
    ? "selected"
    : occupied
      ? "occupied"
      : restricted
        ? "restricted"
        : seatKind(row);
  return (
    <button
      type="button"
      className={`wj-seats__seat wj-seats__seat--${state}`}
      disabled={occupied || restricted}
      aria-pressed={selected}
      aria-label={`${seat}, ${money(seatPrice(seat))}${occupied ? ", occupied" : restricted ? ", restricted" : ""}`}
      onClick={() => onToggle(seat)}
    >
      {selected ? (
        <img src={asset("icon-check-white-10.svg")} alt="" width="10" height="10" />
      ) : occupied ? (
        "·"
      ) : restricted ? (
        "✕"
      ) : (
        letter
      )}
    </button>
  );
}

function SeatRow({ row, selectedSeat, exitConsent, onToggle }) {
  const group = (letters) => (
    <div className="wj-seats__seat-group">
      {letters.split("").map((letter) => (
        <Seat
          key={letter}
          seat={`${row}${letter}`}
          row={row}
          letter={letter}
          selected={selectedSeat === `${row}${letter}`}
          exitConsent={exitConsent}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
  return (
    <div className="wj-seats__row">
      <span className="wj-seats__row-number">{row}</span>
      {group("ABC")}
      <span className="wj-seats__aisle">{row}</span>
      {group("DEF")}
      <span className="wj-seats__row-number">{row}</span>
    </div>
  );
}

export function SeatsMap({ aircraft, selectedSeat, exitConsent, onExitConsent, onToggle }) {
  const [zoom, setZoom] = useState(100);
  const nextZoom = () =>
    setZoom(ZOOM_LEVELS[(ZOOM_LEVELS.indexOf(zoom) + 1) % ZOOM_LEVELS.length]);
  return (
    <section className="wj-seats__map" aria-label="Seat map">
      <div className="wj-seats__map-head">
        <h2>{aircraft} · 189 seats</h2>
        <button type="button" className="wj-seats__zoom" onClick={nextZoom}>
          <img src={asset("icon-zoom-in-16.svg")} alt="" width="16" height="16" />
          Zoom {zoom}%
        </button>
      </div>
      <div className="wj-seats__rule" />
      <SeatsLegend />
      <div className="wj-seats__rule" />
      <div className="wj-seats__cabin" style={{ zoom: zoom / 100 }}>
        <div className="wj-seats__nose">
          <span>Front of aircraft</span>
          <b>Galley &amp; WC</b>
        </div>
        <span className="wj-seats__connector" />
        <div className="wj-seats__columns" aria-hidden="true">
          <span className="wj-seats__row-number" />
          <span className="wj-seats__column-group">
            <span>A</span>
            <span>B</span>
            <span>C</span>
          </span>
          <span className="wj-seats__aisle" />
          <span className="wj-seats__column-group">
            <span>D</span>
            <span>E</span>
            <span>F</span>
          </span>
          <span className="wj-seats__row-number" />
        </div>
        {SECTIONS.map((section) => (
          <div key={section.key} className={`wj-seats__section wj-seats__section--${section.key}`}>
            {section.key === "exit" && (
              <label className="wj-seats__exit-consent">
                <input
                  type="checkbox"
                  checked={exitConsent}
                  onChange={(event) => onExitConsent(event.target.checked)}
                />
                Exit row: I meet exit-row requirements and can assist in an emergency.
              </label>
            )}
            {section.rows.map((row) => (
              <SeatRow
                key={row}
                row={row}
                selectedSeat={selectedSeat}
                exitConsent={exitConsent}
                onToggle={onToggle}
              />
            ))}
          </div>
        ))}
        <span className="wj-seats__connector" />
        <div className="wj-seats__tail">Galley &amp; WC (Rear)</div>
      </div>
    </section>
  );
}
