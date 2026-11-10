import { MaskIcon } from "./MaskIcon";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;
const stages = [
  "Flights",
  "Traveller Info",
  "Seats",
  "Extras",
  "Payment",
  "Confirmation",
];

function stageState(index, step) {
  if (index < step) return "done";
  return index === step ? "active" : "upcoming";
}

export function BookingProgress({ step, route, onModify }) {
  const canModify = step === 0;
  return (
    <div className="wj-progress">
      <div className="wj-progress__route">
        <span className="wj-progress__item">
          {route.origin}
          <img src={asset("icon-route-swap.svg")} alt="" width="24" height="24" />
          {route.destination}
        </span>
        <span className="wj-progress__item">
          <img src={asset("icon-calendar-24.svg")} alt="" width="24" height="24" />
          {route.dates}
        </span>
        <span className="wj-progress__item">
          <img src={asset("icon-person-24.svg")} alt="" width="24" height="24" />
          <span className="sr-only">Passengers:</span>
          {route.passengers}
        </span>
        <button
          className="wj-progress__modify"
          onClick={onModify}
          disabled={!canModify}
        >
          <MaskIcon name="icon-search-teal.svg" size={20} />
          Modify
        </button>
      </div>
      <ol className="wj-progress__steps" aria-label="Booking progress">
        {stages.map((label, index) => (
          <li
            key={label}
            className={`wj-progress__step is-${stageState(index, step)}`}
            aria-current={index === step ? "step" : undefined}
          >
            <span className="wj-progress__number">{index + 1}</span>
            <span className="wj-progress__label">{label}</span>
            <MaskIcon name="icon-step-chevron.svg" size={16} />
          </li>
        ))}
      </ol>
    </div>
  );
}
