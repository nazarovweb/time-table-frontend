"use client";
import { useState, useEffect } from "react";
import { getGroups } from "@/lib/api";
import type { Group } from "@/lib/api";
import WeeklySchedule from "@/components/WeeklySchedule";

export default function StudentPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selected, setSelected] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeCourse, setActiveCourse] = useState<number | null>(null);

    useEffect(() => {
        getGroups()
            .then((data) => {
                setGroups(data);
                if (data.length > 0) setActiveCourse(data[0].course_number);
            })
            .finally(() => setLoading(false));
    }, []);

    const courses = [...new Set(groups.map((g) => g.course_number))].sort();
    const filtered = groups.filter((g) => g.course_number === activeCourse);

    return (
        <div className="page fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">👩‍🎓 Talaba Jadvali</h1>
                    <p className="page-sub">Kurs va guruhingizni tanlang</p>
                </div>
            </div>

            <div className="page-body">
                {/* Sidebar */}
                <div className="sidebar">
                    {/* Course tabs */}
                    {!loading && (
                        <div className="course-tabs">
                            {courses.map((c) => (
                                <button
                                    key={c}
                                    className={`course-tab ${activeCourse === c ? "active" : ""}`}
                                    onClick={() => { setActiveCourse(c); setSelected(null); }}
                                >
                                    {c}-kurs
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="group-list">
                        {loading && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />
                                ))}
                            </div>
                        )}
                        {!loading && filtered.map((g) => (
                            <button
                                key={g.group_id}
                                className={`group-item ${selected?.group_id === g.group_id ? "active" : ""}`}
                                onClick={() => setSelected(g)}
                            >
                                <div className="group-icon">👥</div>
                                <div>
                                    <p className="group-name">{g.course_number}-kurs, {g.group_number}-guruh</p>
                                    <p className="group-id">ID: {g.group_id}</p>
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
                            <p>Chap tarafdan guruhni tanlang</p>
                        </div>
                    ) : (
                        <div className="fade-in">
                            <div className="selected-header">
                                <div className="selected-avatar-g">👥</div>
                                <div>
                                    <h2 className="selected-name">
                                        {selected.course_number}-kurs, {selected.group_number}-guruh
                                    </h2>
                                    <span className="badge badge-green">Talaba guruhi</span>
                                </div>
                            </div>
                            <WeeklySchedule mode="student" entityId={selected.group_id} />
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
        .page-title { font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.02em; }
        .page-sub { color: var(--text-secondary); font-size: 0.95rem; }
        .page-body {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 768px) { .page-body { grid-template-columns: 1fr; } }
        .sidebar {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          position: sticky;
          top: 84px;
        }
        .course-tabs {
          display: flex;
          padding: 8px;
          gap: 4px;
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
        }
        .course-tab {
          padding: 7px 14px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: var(--text-secondary);
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .course-tab:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
        .course-tab.active {
          background: linear-gradient(135deg, var(--accent-green), #059669);
          color: #fff;
          font-weight: 600;
        }
        .group-list {
          padding: 8px;
          max-height: calc(100vh - 280px);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .group-item {
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
        .group-item:hover { background: rgba(255,255,255,0.04); }
        .group-item.active {
          background: rgba(16,185,129,0.15);
          outline: 1px solid rgba(16,185,129,0.3);
        }
        .group-icon { font-size: 1.3rem; }
        .group-name { font-size: 0.9rem; font-weight: 500; }
        .group-id { font-size: 0.75rem; color: var(--text-muted); }
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
        .selected-avatar-g {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }
        .selected-name { font-size: 1.2rem; font-weight: 700; margin-bottom: 4px; }
      `}</style>
        </div>
    );
}
