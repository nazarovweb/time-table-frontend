"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface StoredUser {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    router.push("/home");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/home" className="navbar-logo">
          <span className="logo-icon">📅</span>
          <span>Dars Jadvali</span>
        </Link>

        <div className="navbar-links">
          <Link href="/home/teacher" className={`nav-link ${pathname.includes("/teacher") ? "active" : ""}`}>
            👨‍🏫 O&apos;qituvchilar
          </Link>
          <Link href="/home/student" className={`nav-link ${pathname.includes("/student") ? "active" : ""}`}>
            👩‍🎓 Talabalar
          </Link>
          {user?.role === "ADMIN" && (
            <Link href="/home/admin" className={`nav-link ${pathname.includes("/admin") ? "active" : ""}`}>
              🛠️ Admin
            </Link>
          )}
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <button className="user-avatar" onClick={() => setOpen(!open)}>
                <span>{user.full_name.charAt(0).toUpperCase()}</span>
              </button>
              {open && (
                <div className="dropdown">
                  <div className="dropdown-info">
                    <p className="dropdown-name">{user.full_name}</p>
                    <p className="dropdown-email">{user.email}</p>
                    <span className={`badge badge-${user.role === "ADMIN" ? "orange" : user.role === "TEACHER" ? "indigo" : "green"}`}>
                      {user.role}
                    </span>
                  </div>
                  <hr className="dropdown-divider" />
                  <button onClick={logout} className="dropdown-logout">
                    🚪 Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <Link href="/home/login" className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                Kirish
              </Link>
              <Link href="/home/register" className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                Ro&apos;yxat
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(13, 15, 26, 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon { font-size: 1.4rem; }
        .navbar-links {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .nav-link {
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s;
        }
        .nav-link:hover, .nav-link.active {
          background: rgba(99,102,241,0.12);
          color: var(--text-primary);
        }
        .nav-link.active { color: #a5b4fc; }
        .navbar-auth { flex-shrink: 0; position: relative; }
        .user-menu { position: relative; }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border: none;
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: pulse-ring 2.5s infinite;
        }
        .user-avatar:hover { transform: scale(1.08); }
        .dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 14px;
          padding: 4px;
          min-width: 220px;
          box-shadow: var(--shadow-lg);
          animation: fadeIn 0.2s ease;
        }
        .dropdown-info {
          padding: 12px 14px 10px;
        }
        .dropdown-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .dropdown-email {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 2px 0 8px;
        }
        .dropdown-divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 0;
        }
        .dropdown-logout {
          display: block;
          width: 100%;
          padding: 10px 14px;
          background: none;
          border: none;
          color: #f87171;
          font-size: 0.9rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          border-radius: 10px;
          margin-top: 4px;
          transition: background 0.15s;
        }
        .dropdown-logout:hover { background: rgba(248,113,113,0.1); }
      `}</style>
    </nav>
  );
}
