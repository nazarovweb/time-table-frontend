"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    getTeachers,
    getGroups,
    getWeekScheduleByGroup,
    getWeekScheduleByTeacher,
    moveSchedule,
    Teacher,
    Group,
    ScheduleItem,
    ConflictError
} from "@/lib/api";
import { toast } from "@/components/Toast";
import ScheduleCard from "@/components/ScheduleCard";

const DAYS = [
    { num: 1, label: "Dushanba" },
    { num: 2, label: "Seshanba" },
    { num: 3, label: "Chorshanba" },
    { num: 4, label: "Payshanba" },
    { num: 5, label: "Juma" },
];

const ORDERS = [1, 2, 3, 4, 5, 6];

export default function AdminPage() {
    const [mode, setMode] = useState<"group" | "teacher">("group");
    const [entities, setEntities] = useState<(Teacher | Group)[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [entitiesLoading, setEntitiesLoading] = useState(true);

    // Fetch groups/teachers on load
    useEffect(() => {
        setEntitiesLoading(true);
        setSelectedId(null);
        setSchedule([]);

        const fetchEntities = mode === "group" ? getGroups : getTeachers;
        fetchEntities()
            .then(setEntities)
            .finally(() => setEntitiesLoading(false));
    }, [mode]);

    const fetchSchedule = useCallback(async () => {
        if (!selectedId) return;
        setLoading(true);
        try {
            const data = mode === "group"
                ? await getWeekScheduleByGroup(selectedId)
                : await getWeekScheduleByTeacher(selectedId);
            setSchedule(data);
        } catch (err) {
            toast("error", "Jadvalni yuklashda xato yuz berdi");
        } finally {
            setLoading(false);
        }
    }, [mode, selectedId]);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    const handleDragStart = (e: React.DragEvent, item: ScheduleItem) => {
        e.dataTransfer.setData("application/json", JSON.stringify(item));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = async (e: React.DragEvent, day: number, order: number) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("application/json");
        if (!data) return;

        const item: ScheduleItem = JSON.parse(data);

        // Check if position changed
        if (item.day_of_week === day && item.lesson_order === order) return;

        const token = localStorage.getItem("token");
        if (!token) {
            toast("error", "Siz admin emassiz yoki sessiya tugagan");
            return;
        }

        try {
            await moveSchedule(item.schedule_id, day, order, token);
            toast("success", "Dars muvaffaqiyatli ko'chirildi");
            fetchSchedule(); // Refresh data
        } catch (err: any) {
            if (err.conflicts) {
                const msg = err.conflicts.map((c: any) => c.message).join("\n");
                toast("error", `Ziddiyat aniqlandi:\n${msg}`);
            } else {
                toast("error", err.error || "Operatsiya muvaffaqiyatsiz tugadi");
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const getSlotItem = (day: number, order: number) => {
        return schedule.find(s => s.day_of_week === day && s.lesson_order === order);
    };

    return (
        <div className="admin-editor fade-in">
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">🛠️ Admin Jadval Muharriri</h1>
                    <p className="page-sub">Darslarni boshqa vaqtga ko'chirish uchun ularni tortib (drag) kerakli katakka tashlang.</p>
                </div>
                <Link href="/home/admin/academic" className="btn-secondary" style={{ textDecoration: 'none' }}>
                    🎓 O'quv Ishlari (Auto-Generate)
                </Link>
            </div>

            <div className="controls card">
                <div className="mode-toggle">
                    <button
                        className={`toggle-btn ${mode === "group" ? "active" : ""}`}
                        onClick={() => setMode("group")}
                    >
                        👥 Guruhlar
                    </button>
                    <button
                        className={`toggle-btn ${mode === "teacher" ? "active" : ""}`}
                        onClick={() => setMode("teacher")}
                    >
                        👨‍🏫 O'qituvchilar
                    </button>
                </div>

                <select
                    className="input select-input"
                    value={selectedId || ""}
                    onChange={(e) => setSelectedId(Number(e.target.value))}
                    disabled={entitiesLoading}
                >
                    <option value="">Tanlang...</option>
                    {entities.map((e: any) => {
                        const id = mode === "group" ? e.group_id : e.teacher_id;
                        return (
                            <option key={id} value={id}>
                                {mode === "group"
                                    ? `${e.course_number}-kurs, ${e.group_number}-guruh`
                                    : `${e.first_name} ${e.last_name}`}
                            </option>
                        );
                    })}
                </select>
            </div>

            {selectedId ? (
                <div className="grid-container card">
                    <div className="grid-header">
                        <div className="time-col">Vaqt</div>
                        {DAYS.map(day => (
                            <div key={day.num} className="day-col">{day.label}</div>
                        ))}
                    </div>

                    <div className="grid-body">
                        {ORDERS.map(order => (
                            <div key={order} className="grid-row">
                                <div className="time-cell">{order}-dars</div>
                                {DAYS.map(day => {
                                    const item = getSlotItem(day.num, order);
                                    return (
                                        <div
                                            key={`${day.num}-${order}`}
                                            className={`grid-cell ${item ? "has-item" : "empty"}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, day.num, order)}
                                        >
                                            {item ? (
                                                <div
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, item)}
                                                    className="drag-card"
                                                >
                                                    <div className="drag-card-title">{item.lesson.title}</div>
                                                    <div className="drag-card-meta">
                                                        {mode === "group" ? `👨‍🏫 ${item.teacher.last_name}` : `👥 ${item.group.group_number}-guruh`}
                                                    </div>
                                                    <div className="drag-card-meta">🚪 {item.room.room_number}</div>
                                                </div>
                                            ) : (
                                                <div className="drop-target"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="empty-state card">
                    <span style={{ fontSize: "3rem" }}>👆</span>
                    <p>Tahrirlashni boshlash uchun {mode === "group" ? "guruh" : "o'qituvchi"} tanlang</p>
                </div>
            )}

            <style>{`
        .admin-editor { display: flex; flex-direction: column; gap: 24px; }
        .header { margin-bottom: 8px; }
        .controls {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          flex-wrap: wrap;
        }
        .mode-toggle {
          display: flex;
          background: var(--bg-secondary);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .toggle-btn {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.9rem;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .toggle-btn.active {
          background: var(--accent-primary);
          color: #fff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }
        .select-input { max-width: 300px; }
        
        .grid-container {
          overflow-x: auto;
          padding: 0;
          border-radius: 16px;
          border: 1px solid var(--border);
        }
        .grid-header {
          display: grid;
          grid-template-columns: 80px repeat(5, 1fr);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
        }
        .time-col, .day-col {
          padding: 12px;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-align: center;
        }
        .day-col { border-left: 1px solid var(--border); }
        
        .grid-body {
          display: flex;
          flex-direction: column;
        }
        .grid-row {
          display: grid;
          grid-template-columns: 80px repeat(5, 1fr);
          min-height: 120px;
          border-bottom: 1px solid var(--border);
        }
        .grid-row:last-child { border-bottom: none; }
        
        .time-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        
        .grid-cell {
          border-left: 1px solid var(--border);
          padding: 8px;
          position: relative;
          transition: background 0.2s;
        }
        .grid-cell.empty:hover {
          background: rgba(99, 102, 241, 0.03);
        }
        
        .drop-target {
          width: 100%;
          height: 100%;
          border: 2px dashed transparent;
          border-radius: 8px;
          transition: border-color 0.2s;
        }
        .grid-cell.empty:hover .drop-target {
          border-color: rgba(99, 102, 241, 0.2);
        }

        .drag-card {
          background: var(--bg-card);
          border: 1px solid var(--accent-primary);
          border-radius: 10px;
          padding: 10px;
          cursor: grab;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .drag-card:active { cursor: grabbing; transform: scale(0.98); }
        .drag-card:hover { box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2); }
        
        .drag-card-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .drag-card-meta {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .empty-state {
          padding: 80px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
}
