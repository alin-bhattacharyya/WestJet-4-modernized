import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Info,
  Plane,
  Plus,
  Search,
  UserRound,
} from "lucide-react";
import { BookingProgress } from "./BookingProgress";
import { MaskIcon } from "./MaskIcon";
import "./Shell.css";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

export function WestJetLogo({ width = 160, className = "" }) {
  return (
    <span
      className={`wj-logo ${className}`}
      style={{ width, height: width * 0.2006 }}
      role="img"
      aria-label="WestJet"
    >
      <img className="wj-logo__wordmark" src={asset("logo-wordmark.svg")} alt="" />
      <img className="wj-logo__leaf" src={asset("logo-leaf.svg")} alt="" />
    </span>
  );
}


const items = [
  { key: "home", label: "Home", icon: <BriefcaseBusiness size={20} /> },
  { key: "search", label: "Book a flight", icon: <Plane size={20} /> },
  { key: "car", label: "Book Car", icon: <MaskIcon name="icon-car.svg" /> },
  { key: "trips", label: "My trips", icon: <CalendarDays size={20} />, badge: true },
  { key: "pass", label: "Flight Pass", icon: <MaskIcon name="icon-flight-pass.svg" /> },
  { key: "policy", label: "Travel policy", icon: <Info size={20} /> },
];

export function Sidebar({ active = "home", collapsed, onToggle, onNavigate, tripCount = 3 }) {
  return (
    <aside className={`wj-sidebar ${collapsed ? "wj-sidebar--collapsed" : ""}`}>
      <div className="wj-sidebar__brand">
        {!collapsed && (
          <button
            className="wj-sidebar__home"
            aria-label="WestJet BizWeb home"
            onClick={() => onNavigate("home")}
          >
            <WestJetLogo />
          </button>
        )}
        <button
          className="wj-sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      <nav className="wj-sidebar__nav" aria-label="Corporate travel">
        {items.map(({ key, label, icon, badge }) => (
          <button
            key={key}
            title={label}
            aria-label={label}
            aria-current={active === key ? "page" : undefined}
            className={`wj-sidebar__item ${active === key ? "is-active" : ""}`}
            onClick={() => onNavigate(key)}
          >
            {icon}
            {!collapsed && <span className="wj-sidebar__label">{label}</span>}
            {!collapsed && badge && <span className="wj-sidebar__badge">{tripCount}</span>}
          </button>
        ))}
      </nav>
      <div className="wj-sidebar__footer">
        <button
          className="wj-sidebar__item"
          aria-label="Help and support"
          onClick={() => onNavigate("help")}
        >
          <Info size={20} />
          {!collapsed && <span className="wj-sidebar__label">Help &amp; support</span>}
        </button>
        <button
          className="wj-sidebar__profile"
          aria-label="Account"
          onClick={() => onNavigate("account")}
        >
          <span className="wj-sidebar__avatar">
            <UserRound size={20} />
          </span>
          {!collapsed && (
            <span className="wj-sidebar__person">
              <b>Maya Thompson</b>
              <small>Operations · CC-204</small>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

export function AppHeader({ onNavigate, progress }) {
  return (
    <header className="wj-header">
      <div className="wj-header__bar">
      <div className="wj-header__title">
        <span>WestJet BizWeb</span>
        <b>Corporate Traveler</b>
      </div>
      <div className="wj-header__actions">
        <div className="wj-header__buttons">
          <button className="wj-header__button" onClick={() => onNavigate("search")}>
            <Plus size={20} />
            New Booking
          </button>
          <button
            className="wj-header__button wj-header__button--icon"
            aria-label="Notifications"
            onClick={() => onNavigate("notifications")}
          >
            <img src={asset("icon-bell.svg")} alt="" width="18" height="18" />
          </button>
          <button
            className="wj-header__button wj-header__button--icon"
            aria-label="Search"
            onClick={() => onNavigate("find")}
          >
            <Search size={20} />
          </button>
        </div>
        <button
          className="wj-header__language"
          aria-label="Select country and language. Currently selected: English Canada"
          onClick={() => onNavigate("language")}
        >
          <span>English</span>
          <span className="wj-header__flag">
            <img src={asset("flag-canada.png")} alt="" />
          </span>
          <ChevronDown size={12} />
        </button>
      </div>
      </div>
      {progress && <BookingProgress {...progress} />}
    </header>
  );
}

export function FlowActions({
  onBack,
  onContinue,
  label = "Continue",
  backLabel = "Back",
  wide = false,
  disabled,
  form,
}) {
  return (
    <div className={`wj-flow-actions ${wide ? "wj-flow-actions--wide" : ""}`}>
      <div className="wj-flow-actions__inner">
        <button type="button" className="wj-flow-actions__back" onClick={onBack}>
          {backLabel}
        </button>
        <p>Your booking details are saved as you move between steps.</p>
        <button
          type={form ? "submit" : "button"}
          form={form}
          className="wj-flow-actions__next"
          onClick={onContinue}
          disabled={disabled}
        >
          {label}
        </button>
      </div>
    </div>
  );
}

export function Shell({
  children,
  active,
  onNavigate,
  collapsed,
  onToggle,
  tripCount,
  progress,
  footerNote = "Illustrative data only · Not live fares or official WestJet policy · No payment occurs",
}) {
  return (
    <div className={`wj-shell ${collapsed ? "wj-shell--collapsed" : ""}`}>
      <Sidebar
        active={active}
        collapsed={collapsed}
        onToggle={onToggle}
        onNavigate={onNavigate}
        tripCount={tripCount}
      />
      <div className="wj-shell__content">
        <AppHeader onNavigate={onNavigate} progress={progress} />
        <main className="wj-shell__main">
          <div className="wj-page">
            {children}
            <footer className="wj-page-footer">
              <span>© WestJet. All rights reserved. </span>
              <span>{footerNote}</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
