import { useRef, useState } from "react";
import { useBooking } from "../../state/useBooking";
import { passAsset, passes, tabBalance } from "./flightPassData";
import { PassDetails, PassSummary, StatusChip } from "./FlightPassSummary";
import { DiscoverPasses, PassHelp, RedemptionActivity } from "./FlightPassSections";
import "./FlightPass.css";

export function FlightPass({ onBook }) {
  const { update, notify } = useBooking();
  const [selectedId, setSelectedId] = useState(passes[0].id);
  const detailsRef = useRef(null);
  const pass = passes.find((item) => item.id === selectedId);

  const bookWithPass = () => {
    update("search", { passOnly: true });
    onBook();
  };
  const showDetails = () => {
    detailsRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    detailsRef.current?.focus({ preventScroll: true });
  };
  const selectByKey = (event, index) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    const next = passes[(index + step + passes.length) % passes.length];
    setSelectedId(next.id);
    document.getElementById(`wj-pass-tab-${next.id}`)?.focus();
  };

  return (
    <div className="wj-pass">
      <div className="wj-pass__intro">
        <div className="wj-pass__intro-text">
          <h1 className="wj-pass__title">Your Flight Passes</h1>
          <p className="wj-pass__lead">
            See your credits, review your activity and plan your next trip.
          </p>
        </div>
        <button
          type="button"
          className="wj-pass__button wj-pass__button--outline"
          onClick={() =>
            notify(
              "Flight Pass catalogue: contact your travel administrator to buy a new pass for your company.",
            )
          }
        >
          Explore Flight Passes
          <img src={passAsset("pass-icon-arrow-16.svg")} alt="" width="16" height="16" />
        </button>
      </div>

      <section className="wj-pass__active" aria-labelledby="wj-pass-active-title">
        <div className="wj-pass__section-header">
          <h2 id="wj-pass-active-title" className="wj-pass__section-title">
            Your active passes
          </h2>
          <p className="wj-pass__section-note">
            Credit balances are shown separately for each pass
          </p>
        </div>
        <div className="wj-pass__tabs" role="tablist" aria-label="Your Flight Passes">
          {passes.map((item, index) => {
            const selected = item.id === selectedId;
            return (
              <button
                key={item.id}
                id={`wj-pass-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="wj-pass-panel"
                tabIndex={selected ? 0 : -1}
                className={`wj-pass__tab${selected ? " wj-pass__tab--selected" : ""}`}
                onClick={() => setSelectedId(item.id)}
                onKeyDown={(event) => selectByKey(event, index)}
              >
                <span className="wj-pass__tab-icon">
                  <img
                    src={passAsset(
                      selected ? "pass-icon-ticket-white.svg" : "pass-icon-ticket-teal.svg",
                    )}
                    alt=""
                    width="20"
                    height="20"
                  />
                </span>
                <span className="wj-pass__tab-name">
                  <b>{item.name}</b>
                  <span>Ref. {item.reference}</span>
                </span>
                <span className="wj-pass__tab-balance">
                  <StatusChip status={item.status} />
                  <b>{tabBalance(item)}</b>
                </span>
              </button>
            );
          })}
        </div>
        <div
          id="wj-pass-panel"
          className="wj-pass__selected"
          role="tabpanel"
          aria-labelledby={`wj-pass-tab-${pass.id}`}
        >
          <PassSummary pass={pass} onBook={bookWithPass} onDetails={showDetails} />
          <PassDetails
            ref={detailsRef}
            pass={pass}
            onTerms={() =>
              notify(
                `${pass.name} terms: credits are valid on the listed routes until ${pass.expires}. Full terms are available from your travel administrator.`,
              )
            }
          />
        </div>
      </section>

      <div className="wj-pass__lower">
        <RedemptionActivity pass={pass} notify={notify} />
        <PassHelp notify={notify} />
      </div>

      <DiscoverPasses onBook={bookWithPass} notify={notify} />
    </div>
  );
}
