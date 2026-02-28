import Link from "next/link";

export default function HomePage() {
    return (
        <div className="landing">
            {/* Hero */}
            <div className="hero fade-in">
                <div className="hero-badge">
                    <span className="badge badge-indigo">🎓 Toshkent Davlat Universiteti</span>
                </div>
                <h1 className="hero-title">
                    Dars <span className="gradient-text">Jadvali</span>
                </h1>
                <p className="hero-sub">
                    O&apos;qituvchi yoki talaba sifatida jadvalingizni ko&apos;rish uchun quyidan tanlang
                </p>
            </div>

            {/* Role Cards */}
            <div className="role-grid fade-in">
                <Link href="/home/teacher" className="role-card teacher-card">
                    <div className="role-icon">👨‍🏫</div>
                    <h2 className="role-title">O&apos;qituvchi</h2>
                    <p className="role-desc">
                        O&apos;z darslaringizni hafta bo&apos;yicha ko&apos;ring
                    </p>
                    <div className="role-arrow">→</div>
                </Link>

                <Link href="/home/student" className="role-card student-card">
                    <div className="role-icon">👩‍🎓</div>
                    <h2 className="role-title">Talaba</h2>
                    <p className="role-desc">
                        Guruhingizning haftalik dars jadvalini ko&apos;ring
                    </p>
                    <div className="role-arrow">→</div>
                </Link>
            </div>

            {/* Info cards */}
            <div className="info-grid fade-in">
                <div className="info-card">
                    <span className="info-icon">⏰</span>
                    <div>
                        <p className="info-title">Real-vaqt</p>
                        <p className="info-text">Jadval doimo yangilangan</p>
                    </div>
                </div>
                <div className="info-card">
                    <span className="info-icon">📱</span>
                    <div>
                        <p className="info-title">Qulay dizayn</p>
                        <p className="info-text">Har qanday qurilmada ishlaydi</p>
                    </div>
                </div>
                <div className="info-card">
                    <span className="info-icon">🔒</span>
                    <div>
                        <p className="info-title">Ixtiyoriy Login</p>
                        <p className="info-text">Ro&apos;yxatdan o&apos;tmay ham foydalanish mumkin</p>
                    </div>
                </div>
            </div>

            <style>{`
        .landing { max-width: 800px; margin: 0 auto; }
        .hero { text-align: center; padding: 48px 0 40px; }
        .hero-badge { margin-bottom: 20px; }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .gradient-text {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 460px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }
        @media (max-width: 560px) { .role-grid { grid-template-columns: 1fr; } }
        .role-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 28px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .role-card::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .teacher-card::before {
          background: radial-gradient(circle at 50% 0%, rgba(99,102,241,0.12), transparent 70%);
        }
        .student-card::before {
          background: radial-gradient(circle at 50% 0%, rgba(16,185,129,0.12), transparent 70%);
        }
        .role-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .teacher-card:hover { border-color: #6366f1; }
        .student-card:hover { border-color: #10b981; }
        .role-card:hover::before { opacity: 1; }
        .role-icon { font-size: 3.5rem; margin-bottom: 16px; }
        .role-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .role-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-align: center;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .role-arrow {
          font-size: 1.2rem;
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.25s;
        }
        .role-card:hover .role-arrow { opacity: 1; transform: translateX(0); }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 560px) { .info-grid { grid-template-columns: 1fr; } }
        .info-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
        }
        .info-icon { font-size: 1.5rem; flex-shrink: 0; }
        .info-title { font-weight: 600; font-size: 0.88rem; margin-bottom: 2px; }
        .info-text { font-size: 0.78rem; color: var(--text-muted); }
      `}</style>
        </div>
    );
}
