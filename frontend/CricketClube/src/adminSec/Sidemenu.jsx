import { useState } from "react";
import { Link, useLocation } from "react-router-dom";   // ← add useLocation

export default function Sidemenu() {
  const [open, setOpen] = useState(
    localStorage.getItem("menuOpen") === "true"
  );
  const location = useLocation();   // ← current path

  const close = () => {
    setOpen(false);
    localStorage.setItem("menuOpen", "false");
  };

  const menuItems = [
  { to: "/Addplayers",    label: "Add Player",     icon: "ti-user-plus" },
  { to: "/Match",         label: "Create Match",   icon: "ti-calendar-plus" },
  { to: "/MatchPlayers",  label: "Player Set-up",  icon: "ti-shirt" },
  { to: "/Control",       label: "Control Score",  icon: "ti-device-gamepad-2" },
  { to: "/MatchAnalysis", label: "Match History",  icon: "ti-timeline" },
  { to: "/Analysis",      label: "History",        icon: "ti-chart-line" },
];

  return (
    <div>
      <button
        onClick={() => {
          setOpen(true);
          localStorage.setItem("menuOpen", "true");
        }}
        className="open-btn"
        aria-label="Open menu"
      >
        <i className="ti ti-menu-2"></i>
      </button>

      {open && <div className="overlay" onClick={close}></div>}

      <div className={`drawer ${open ? "active" : ""}`} role="navigation">
        <div className="drawer-header">
          <div className="drawer-logo">
            <i className="ti ti-baseball"></i>
            <span>Cricket Panel</span>
          </div>
          <button className="close-btn" onClick={close} aria-label="Close menu">
            <i className="ti ti-x"></i>
          </button>
        </div>

        <div className="drawer-divider"></div>

        <nav className="drawer-nav">
          {menuItems.map(({ to, label, icon }) => {
            const isActive = location.pathname === to;   // ← active check
            return (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive ? "active" : ""}`}  // ← active class
              >
                <i className={`ti ${icon} nav-icon`} aria-hidden="true"></i>
                <span>{label}</span>
                <i className="ti ti-chevron-right nav-arrow" aria-hidden="true"></i>
              </Link>
            );
          })}
        </nav>

        <div className="drawer-footer">
          <span>Cricket Score Manager </span>
        </div>
      </div>

      <style>{`
        .open-btn {
          background: #1a1a1a;
          border: 1px solid #2e2e2e;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #c5db83;
          font-size: 20px;
          transition: background 0.2s, border-color 0.2s;
        }
        .open-btn:hover {
          background: #252525;
          border-color: #c5db83;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(2px);
          z-index: 9;
        }

        .drawer {
          position: fixed;
          top: 0;
          left: -300px;
          width: 280px;
          height: 100vh;
          background: #111111;
          border-right: 1px solid #222222;
          display: flex;
          flex-direction: column;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }
        .drawer.active {
          left: 0;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 18px 16px;
        }
        .drawer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #c5db83;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }
        .drawer-logo .ti {
          font-size: 22px;
        }

        .close-btn {
          background: #1e1e1e;
          border: 1px solid #2a2a2a;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          padding: 0;
        }
        .close-btn:hover {
          background: #2a2a2a;
          color: #ff6b6b;
        }

        .drawer-divider {
          height: 1px;
          background: #1e1e1e;
          margin: 0 18px 12px;
        }

        .drawer-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 4px 12px;
          gap: 2px;
          overflow-y: auto;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #999;
          text-decoration: none;
          padding: 11px 12px;
          border-radius: 9px;
          font-size: 14px;
          transition: background 0.15s, color 0.15s;
          position: relative;
        }
        .nav-link:hover {
          background: #1a1a1a;
          color: #c5db83;
        }

        .nav-link.active {
          background: #1a2a0e;
          color: #c5db83;
        }
        .nav-link.active .nav-arrow {
          opacity: 1;
          color: #c5db83;
        }
        .nav-link.active .nav-icon {
          color: #c5db83;
        }

        .nav-link:hover .nav-arrow {
          opacity: 1;
          color: #c5db83;
        }
        .nav-icon {
          font-size: 18px;
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }
        .nav-link span {
          flex: 1;
        }
        .nav-arrow {
          font-size: 14px;
          opacity: 0;
          transition: opacity 0.15s;
          color: #555;
        }

        .drawer-footer {
          padding: 16px 20px;
          border-top: 1px solid #1e1e1e;
          font-size: 11px;
          color: #444;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}