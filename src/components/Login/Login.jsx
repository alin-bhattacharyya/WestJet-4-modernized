import { useState } from "react";
import { Button } from "../ui/Button";
import { WestJetLogo } from "../Shell/Shell";
import "./Login.css";

const asset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;
const benefits = [
  "Manage your account",
  "Quickly book trips and check in",
  "View member exclusive benefits",
];

export function Login({ onLogin, onHelp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const ready = email.trim() !== "" && password !== "";
  return (
    <main className="wj-login">
      <section className="wj-login__brand">
        <div className="wj-login__brand-content">
          <WestJetLogo width={224} />
          <div className="wj-login__welcome">
            <h1>Welcome to WestJet Biz</h1>
            <p>Sign in to get started.</p>
          </div>
          <ul className="wj-login__benefits">
            {benefits.map((benefit) => (
              <li key={benefit}>
                <img src={asset("icon-check-lime.svg")} alt="" width="20" height="20" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div className="wj-login__photo">
          <img src={asset("login-window-seat.jpg")} alt="" />
        </div>
      </section>
      <section className="wj-login__panel">
        <div className="wj-login__top">
          <button className="wj-login__language" aria-label="Language: English">
            <img src={asset("icon-globe.svg")} alt="" width="18" height="18" />
            English
            <img src={asset("icon-chevron-down-16.svg")} alt="" width="16" height="16" />
          </button>
        </div>
        <div className="wj-login__form-wrap">
          <form
            className="wj-login__form"
            onSubmit={(event) => {
              event.preventDefault();
              if (ready) onLogin();
            }}
          >
            <div className="wj-login__heading">
              <h2>Sign in</h2>
              <p>
                Use your email or WestJet Rewards ID to manage your account and
                book trips.
              </p>
            </div>
            <div className="wj-login__fields">
              <div className="wj-login__field">
                <label htmlFor="login-email">Email or WestJet Rewards ID</label>
                <span className="wj-login__boundary">
                  <input
                    id="login-email"
                    type="text"
                    inputMode="email"
                    autoComplete="username"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </span>
              </div>
              <div className="wj-login__field">
                <label htmlFor="login-password">Password</label>
                <span className="wj-login__boundary">
                  <input
                    id="login-password"
                    type={visible ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="wj-login__eye"
                    onClick={() => setVisible(!visible)}
                    aria-label={visible ? "Hide password" : "Show password"}
                  >
                    <img src={asset("icon-eye.svg")} alt="" width="18" height="18" />
                  </button>
                </span>
              </div>
            </div>
            <div className="wj-login__actions">
              <Button className="wj-login__submit" type="submit" disabled={!ready}>
                Sign in
              </Button>
              <button type="button" className="wj-login__forgot" onClick={onHelp}>
                Forgot ID or password?
                <img
                  src={asset("icon-chevron-right-teal.svg")}
                  alt=""
                  width="16"
                  height="16"
                />
              </button>
            </div>
            <hr className="wj-login__divider" />
            <div className="wj-login__register">
              <p>Want to register your business?</p>
              <button type="button" onClick={onHelp}>
                Join now
              </button>
            </div>
          </form>
        </div>
        <footer className="wj-login__footer">
          <span>© WestJet. All rights reserved.</span>
          <button type="button" onClick={onHelp}>
            Help &amp; support
          </button>
        </footer>
      </section>
    </main>
  );
}
