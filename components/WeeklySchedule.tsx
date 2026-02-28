"use client";
import { useState, useEffect, useCallback } from "react";
import ScheduleCard from "./ScheduleCard";
import type { ScheduleItem } from "@/lib/api";
import { getScheduleByTeacher, getScheduleByGroup } from "@/lib/api";

const DAYS = [
    { num: 1, label: "Dushanba", short: "Du" },
    { num: 2, label: "Seshanba", short: "Se" },
    { num: 3, label: "Chorshanba", short: "Cho" },
    { num: 4, label: "Payshanba", short: "Pay" },
    { num: 5, label: "Juma", short: "Ju" },
];

function getTodayNum() {
    const d = new Date().getDay(); // 0=Sun,1=Mon...6=Sat
    if (d === 0 || d === 6) return 1; // Weekend → Dushanba
    return d;
}

interface WeeklyScheduleProps {
    mode: "teacher" | "student";
    entityId: number;
}

export default function WeeklySchedule({ mode, entityId }: WeeklyScheduleProps) {
    const [activeDay, setActiveDay] = useState(getTodayNum());
    const [items, setItems] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchSchedule = useCallback(async (day: number) => {
        setLoading(true);
        setError("");
        try {
            const data =
                mode === "teacher"
                    ? await getScheduleByTeacher(entityId, day)
                    : await getScheduleByGroup(entityId, day);
            setItems(data);
        } catch {
            setError("Ma'lumot olishda xato yuz berdi");
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [mode, entityId]);

    useEffect(() => {
        fetchSchedule(activeDay);
    }, [activeDay, fetchSchedule]);

    const sorted = [...items].sort((a, b) => a.lesson_order - b.lesson_order);

    return (
        <div className="ws">
            {/* Day Tabs */}
            <div className="ws-tabs">
                {DAYS.map((d) => (
                    <button
                        key={d.num}
                        className={`ws-tab ${activeDay === d.num ? "active" : ""}`}
                        onClick={() => setActiveDay(d.num)}
                    >
                        <span className="ws-tab-short">{d.short}</span>
                        <span className="ws-tab-long">{d.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="ws-body">
                {loading && (
                    <div className="ws-skeletons">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton" style={{ height: "96px" }} />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="ws-empty">
                        <span style={{ fontSize: "2rem" }}>⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && sorted.length === 0 && (
                    <div className="ws-empty">
                        <span style={{ fontSize: "2.5rem" }}>🎉</span>
                        <p>Bu kuni dars yo&apos;q</p>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Dam oling!</p>
                    </div>
                )}

                {!loading && !error && sorted.length > 0 && (
                    <div className="ws-list">
                        {sorted.map((item) => (
                            <ScheduleCard key={item.schedule_id} item={item} mode={mode} />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .ws { width: 100%; }
        .ws-tabs {
          display: flex;
          gap: 6px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 6px;
          margin-bottom: 20px;
          overflow-x: auto;
        }
        .ws-tab {
          flex: 1;
          min-width: 70px;
          padding: 10px 8px;
          border: none;
          background: transparent;
          border-radius: 10px;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .ws-tab:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
        .ws-tab.active {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
        }
        .ws-tab-short { display: none; font-size: 0.85rem; }
        .ws-tab-long { font-size: 0.85rem; }
        @media (max-width: 560px) {
          .ws-tab-short { display: block; }
          .ws-tab-long { display: none; }
        }
        .ws-body { min-height: 200px; }
        .ws-skeletons { display: flex; flex-direction: column; gap: 12px; }
        .ws-empty {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .ws-list { display: flex; flex-direction: column; gap: 12px; }
      `}</style>
        </div>
    );
}
