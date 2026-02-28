"use client";
import { useState, useEffect } from "react";
import { getTeachers } from "@/lib/api";
import type { Teacher } from "@/lib/api";
import WeeklySchedule from "@/components/WeeklySchedule";

export default function TeacherPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTeachers()
            .then(setTeachers)
            .finally(() => setLoading(false));
    }, []);

    const filtered = teachers.filter((t) =>
        `${t.first_name} ${t.last_name}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">👨‍🏫 O&apos;qituvchi Jadvali</h1>
                    <p className="page-sub">O&apos;zingizni toping va darslaringizni ko&apos;ring</p>
                </div>
            </div>

            <div className="page-body">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-search">
                        <input
                            className="input"
                            type="text"
                            placeholder="🔍 O'qituvchi qidirish..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="sidebar-list">
                        {loading && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />
                                ))}
                            </div>
                        )}
                        {!loading && filtered.length === 0 && (
                            <div className="empty-list">
                                <span>🔍</span>
                                <p>Topilmadi</p>
                            </div>
                        )}
                        {!loading &&
                            filtered.map((t) => (
                                <button
                                    key={t.teacher_id}
                                    className={`teacher-item ${selected?.teacher_id === t.teacher_id ? "active" : ""}`}
                                    onClick={() => setSelected(t)}
                                >
                                    <div className="teacher-avatar">
                                        {t.first_name.charAt(0)}{t.last_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="teacher-name">{t.first_name} {t.last_name}</p>
                                        <p className="teacher-id">ID: {t.teacher_id}</p>
                                    </div>
                                </button>
                            ))}
                    </div>
                </div>

                {/* Schedule area */}
                <div className="schedule-area">
                    {!selected ? (
                        <div className="select-prompt">
                            <span style={{ fontSize: "3rem" }}>👈</span>
                            <p>Chap tarafdan o&apos;qituvchini tanlang</p>
                        </div>
                    ) : (
                        <div className="fade-in">
                            <div className="selected-header">
                                <div className="selected-avatar">
                                    {selected.first_name.charAt(0)}{selected.last_name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="selected-name">{selected.first_name} {selected.last_name}</h2>
                                    <span className="badge badge-indigo">O&apos;qituvchi</span>
                                </div>
                            </div>
                            <WeeklySchedule mode="teacher" entityId={selected.teacher_id} />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .page-header {
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .page-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }
        .page-sub { color: var(--text-secondary); font-size: 0.95rem; }
        .page-body {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .page-body { grid-template-columns: 1fr; }
        }
        .sidebar {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          position: sticky;
          top: 84px;
        }
        .sidebar-search { padding: 14px; border-bottom: 1px solid var(--border); }
        .sidebar-list {
          padding: 8px;
          max-height: calc(100vh - 260px);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .empty-list {
          text-align: center;
          padding: 32px;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 2rem;
        }
        .empty-list p { font-size: 0.9rem; }
        .teacher-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border: none;
          background: transparent;
          border-radius: 10px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.18s;
          color: var(--text-primary);
        }
        .teacher-item:hover { background: rgba(255,255,255,0.04); }
        .teacher-item.active {
          background: rgba(99,102,241,0.15);
          outline: 1px solid rgba(99,102,241,0.3);
        }
        .teacher-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .teacher-name { font-size: 0.9rem; font-weight: 500; }
        .teacher-id { font-size: 0.75rem; color: var(--text-muted); }
        .schedule-area {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          min-height: 400px;
        }
        .select-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          height: 300px;
          color: var(--text-secondary);
          font-size: 1rem;
        }
        .selected-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .selected-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
        }
        .selected-name {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 4px;
        }
      `}</style>
        </div>
    );
}
