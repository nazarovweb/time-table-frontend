"use client";
import type { ScheduleItem } from "@/lib/api";

const LESSON_TIMES = [
    "08:00 – 09:20",
    "09:30 – 10:50",
    "11:00 – 12:20",
    "13:00 – 14:20",
    "14:30 – 15:50",
    "16:00 – 17:20",
];

const LESSON_COLORS = [
    { bg: "rgba(99,102,241,0.12)", border: "#6366f1", dot: "#6366f1" },
    { bg: "rgba(139,92,246,0.12)", border: "#8b5cf6", dot: "#8b5cf6" },
    { bg: "rgba(16,185,129,0.12)", border: "#10b981", dot: "#10b981" },
    { bg: "rgba(245,158,11,0.12)", border: "#f59e0b", dot: "#f59e0b" },
    { bg: "rgba(239,68,68,0.12)", border: "#ef4444", dot: "#ef4444" },
    { bg: "rgba(14,165,233,0.12)", border: "#0ea5e9", dot: "#0ea5e9" },
];

interface ScheduleCardProps {
    item: ScheduleItem;
    mode: "teacher" | "student";
}

export default function ScheduleCard({ item, mode }: ScheduleCardProps) {
    const order = item.lesson_order - 1;
    const colors = LESSON_COLORS[order % LESSON_COLORS.length];
    const time = LESSON_TIMES[order] || "";

    return (
        <div className="scard" style={{ borderLeft: `3px solid ${colors.border}`, background: colors.bg }}>
            <div className="scard-top">
                <span className="scard-order" style={{ color: colors.dot }}>
                    {item.lesson_order}-dars
                </span>
                {time && <span className="scard-time">{time}</span>}
            </div>

            <p className="scard-title">{item.lesson.title}</p>

            <div className="scard-meta">
                {mode === "student" && (
                    <span className="scard-chip">
                        👨‍🏫 {item.teacher.first_name} {item.teacher.last_name}
                    </span>
                )}
                {mode === "teacher" && (
                    <span className="scard-chip">
                        👥 {item.group.course_number}-kurs, {item.group.group_number}-guruh
                    </span>
                )}
                <span className="scard-chip">
                    🚪 {item.room.room_number} ({item.room.floor}-qavat)
                </span>
            </div>

            <style>{`
        .scard {
          border-radius: 12px;
          padding: 14px 16px;
          border: 1px solid var(--border);
          border-left-width: 3px;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: fadeIn 0.3s ease forwards;
        }
        .scard:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .scard-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .scard-order {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .scard-time {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .scard-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
          line-height: 1.4;
        }
        .scard-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .scard-chip {
          font-size: 0.78rem;
          color: var(--text-secondary);
          background: rgba(255,255,255,0.05);
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid var(--border);
        }
      `}</style>
        </div>
    );
}
