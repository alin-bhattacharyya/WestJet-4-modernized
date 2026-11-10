# Westzet · Corporate Booking Steps V2

React implementation of the WestJet BizWeb Figma reference supplied with the original ZIP.

## Run

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Open the address printed by Vite. Demo sign-in accepts a valid email and a non-empty password; no authentication service is connected.

## Implemented

- Dashboard search, destination collage, KPIs, upcoming trip, trip table, promotions, payment options, recent activity filtering, alerts, Flight Pass, quick actions, and tier progress.
- Roundtrip and one-way search, airport swapping, editable dates, cabin, corporate purpose/reason, and validation.
- Departure-period cards; stops, time, fare, aircraft, price, and commission filters; price/departure sorting; flight details; selectable fare bundles.
- Shared booking state across all steps, back navigation, and local draft persistence. Card details and consent are not restored from storage.
- Passenger/document/contact forms, saved traveller selection, email matching and document-expiry validation.
- Per-direction and per-connection seat selection, availability/restriction states, exit-row consent, and calculated seat costs.
- Direction-specific baggage, six meal options using the supplied Figma assets, comfort services, SMS preference, and calculated totals.
- Travel Bank, Corporate Card, Personal Card, Flight Pass, and Split Payment states; bank allocation, billing details, terms validation, and consistent payment summaries.
- Confirmation, itinerary/invoice text downloads, calendar export, editable bookings, and session booking history under My trips.
- Sidebar actions, support/policy/account dialogs, sign-out, responsive layouts, and accessible form/control names.

## Checks

```sh
npm test
npm run lint
npm run build
```

22 unit/component tests cover calculation, card-data exclusion from drafts, malformed storage, filtering/selection, independent seat/extras state, validation, and primary navigation.

Browser QA: Chromium at 1920×1080 and 390×844, covering roundtrip/one-way booking, selections, back navigation, totals, consent, Flight Pass and corporate-card confirmation, itinerary download, and My trips. Temporary QA scripts/screenshots are outside the source project.

## Boundaries

This is a frontend demonstration with illustrative fares, balances, and trip records. There are no live airline, authentication, payment, ticketing, email, car-rental, refund, or company-administration integrations. Sample company trips and administrative quick actions provide information rather than changing external records. The supported booking scope is one adult, roundtrip or one-way. Completed reservations remain in the current session; the active draft is stored locally. Use fictional passenger and payment details.

The reference contains inconsistent sample totals; this implementation derives all totals from the selected fares and services instead of copying contradictory amounts. The supplied design JSON and assets were used for this pass because live Figma screenshot access hit its quota. Exact typography, logo vectors, and pixel-level parity still require a fresh Figma comparison.

Stack: React 19, Vite 7, Tailwind CSS 4, Radix Slot/CVA primitives, Vitest, and Testing Library.
