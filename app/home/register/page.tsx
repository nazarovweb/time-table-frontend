"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await register(fullName, email, password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/home");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xato yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page fade-in">
            <div className="auth-card card">
                <div className="auth-logo">📅</div>
                <h1 className="auth-title">Ro&apos;yxatdan o&apos;tish</h1>
                <p className="auth-sub">Yangi hisob yarating</p>

                {/* Optional notice */}
                <div className="notice">
                    <span>ℹ️</span>
                    <p>Ro&apos;yxat majburiy emas — <Link href="/home" className="notice-link">jadvalni bevosita ko&apos;ring</Link></p>
                </div>

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">To&apos;liq ism</label>
                        <input
                            className="input"
                            type="text"
                            placeholder="Ism Familiya"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className="input"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Parol</label>
                        <input
                            className="input"
                            type="password"
                            placeholder="Kamida 6 belgi"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </div>

                    {error && <div className="auth-error">⚠️ {error}</div>}

                    <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                        {loading ? "Ro'yxatga kirilmoqda..." : "Ro'yxatdan o'tish"}
                    </button>
                </form>

                <p className="auth-footer">
                    Hisobingiz bormi?{" "}
                    <Link href="/home/login" className="auth-link">Kiring</Link>
                </p>
            </div>

            <style>{`
        .auth-page {
          min-height: calc(100vh - 64px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 36px 32px;
          text-align: center;
        }
        .auth-logo { font-size: 2.5rem; margin-bottom: 12px; }
        .auth-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 4px; }
        .auth-sub { color: var(--text-secondary); margin-bottom: 20px; font-size: 0.9rem; }
        .notice {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 20px;
          text-align: left;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .notice-link { color: #a5b4fc; text-decoration: none; font-weight: 500; }
        .notice-link:hover { text-decoration: underline; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; text-align: left; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); }
        .auth-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
          font-size: 0.85rem;
          padding: 10px 14px;
          border-radius: 10px;
        }
        .auth-footer { margin-top: 20px; font-size: 0.88rem; color: var(--text-muted); }
        .auth-link { color: #a5b4fc; text-decoration: none; font-weight: 500; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
        </div>
    );
}
