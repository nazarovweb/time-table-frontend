"use client";

import { useState, useEffect } from "react";
import {
    getSpecializations,
    createSpecialization,
    getCurriculum,
    updateCurriculum,
    generateTimetable,
    Specialization,
    CurriculumItem,
    getGroups,
    Group,
    Lesson,
    getLessons
} from "@/lib/api";
import { toast } from "@/components/Toast";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function AcademicPage() {
    const [specs, setSpecs] = useState<Specialization[]>([]);
    const [selectedSpec, setSelectedSpec] = useState<number | "">("");
    const [selectedSemester, setSelectedSemester] = useState<number>(1);
    const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);

    // Form for new spec
    const [newSpecName, setNewSpecName] = useState("");
    const [newSpecDesc, setNewSpecDesc] = useState("");

    const refreshData = () => {
        getSpecializations().then(setSpecs);
        getGroups().then(setGroups);
        getLessons().then(setLessons);
    };

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        if (selectedSpec && selectedSemester) {
            setLoading(true);
            getCurriculum(Number(selectedSpec), selectedSemester)
                .then(setCurriculum)
                .finally(() => setLoading(false));
        }
    }, [selectedSpec, selectedSemester]);

    const handleAddSpec = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createSpecialization({ name: newSpecName, description: newSpecDesc });
            setSpecs([...specs, res]);
            setNewSpecName("");
            setNewSpecDesc("");
            toast("success", "Yo'nalish yaratildi");
        } catch (err) {
            toast("error", "Xatolik yuz berdi");
        }
    };

    const handleUpdateTimes = async (lesson_id: number, times: number) => {
        if (!selectedSpec) return;
        try {
            await updateCurriculum({
                specialization_id: Number(selectedSpec),
                semester: selectedSemester,
                lesson_id,
                times_per_week: times
            });
            getCurriculum(Number(selectedSpec), selectedSemester).then(setCurriculum);
            toast("success", "O'quv rejasi yangilandi");
        } catch (err) {
            toast("error", "Saqlashda xato");
        }
    };

    const handleUpdateGroup = async (group_id: number, data: any) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${group_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(data)
            });
            getGroups().then(setGroups);
            toast("success", "Guruh yangilandi");
        } catch (err) {
            toast("error", "Guruhni yangilashda xato");
        }
    };

    const handleGenerate = async (finalize: boolean) => {
        const confirmMsg = finalize
            ? "Diqqat! Mavjud jadval tozalab yuboriladi va yangisi yoziladi. Rozimisiz?"
            : "Preview generatsiya qilinmoqda...";

        if (finalize && !confirm(confirmMsg)) return;

        setLoading(true);
        try {
            const res = await generateTimetable(finalize);
            if (res.success) {
                toast("success", `Jadval tuzildi: ${res.count} dars qo'shildi.`);
            } else if (res.preview) {
                toast("success", `Test generatsiya: ${res.count} slot topildi.`);
                console.log("Preview slots:", res.preview);
            }
            if (res.logs && res.logs.length > 0) {
                console.warn("Generation Logs:", res.logs);
            }
        } catch (err) {
            toast("error", "Generatsiyada xato");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="academic-page fade-in">
            <div className="header">
                <h1 className="page-title">🎓 O'quv Ishlari va Avtomatlashtirish</h1>
                <p className="page-sub">Yo'nalishlar, semestrlar va o'quv rejalarini boshqarish</p>
            </div>

            <div className="grid-layout">
                {/* 1. Yo'nalishlar Bashqaruvi */}
                <div className="section card">
                    <h2 className="section-title">Yo'nalishlar (Specializations)</h2>
                    <form onSubmit={handleAddSpec} className="add-form">
                        <input
                            className="input"
                            placeholder="Yo'nalish nomi (masalan: SW-Frontend)"
                            value={newSpecName}
                            onChange={e => setNewSpecName(e.target.value)}
                            required
                        />
                        <textarea
                            className="input"
                            placeholder="Tavsif..."
                            value={newSpecDesc}
                            style={{ height: "60px" }}
                            onChange={e => setNewSpecDesc(e.target.value)}
                        />
                        <button type="submit" className="btn-primary">Qo'shish</button>
                    </form>

                    <div className="spec-list">
                        {specs.map(s => (
                            <div key={s.specialization_id} className={`spec-item ${selectedSpec === s.specialization_id ? 'active' : ''}`} onClick={() => setSelectedSpec(s.specialization_id)}>
                                <strong>{s.name}</strong>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{s.description || 'Tavsif yo\'q'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. O'quv Rejasi (Curriculum) */}
                <div className="section card">
                    <h2 className="section-title">O'quv Rejasi (Haftalik darslar)</h2>

                    <div className="semester-tabs">
                        {SEMESTERS.map(sem => (
                            <button
                                key={sem}
                                className={`sem-tab ${selectedSemester === sem ? 'active' : ''}`}
                                onClick={() => setSelectedSemester(sem)}
                            >
                                {sem}-semestr
                            </button>
                        ))}
                    </div>

                    {!selectedSpec ? (
                        <p className="p-muted">Davom etish uchun yo'nalishni tanlang</p>
                    ) : (
                        <div className="curriculum-editor scrollable">
                            {lessons.map(lesson => {
                                const curItem = curriculum.find(c => c.lesson_id === lesson.lesson_id);
                                return (
                                    <div key={lesson.lesson_id} className="lesson-row">
                                        <span className="lesson-name">{lesson.title}</span>
                                        <div className="times-selector">
                                            <button onClick={() => handleUpdateTimes(lesson.lesson_id, Math.max(0, (curItem?.times_per_week || 0) - 1))}>-</button>
                                            <span className="count">{curItem?.times_per_week || 0}</span>
                                            <button onClick={() => handleUpdateTimes(lesson.lesson_id, (curItem?.times_per_week || 0) + 1)}>+</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 3. Guruhlar Sozlamalari */}
                <div className="section card full-width">
                    <h2 className="section-title">👥 Guruhlar Sozlamalari</h2>
                    <p className="p-sm" style={{ marginBottom: "15px" }}>Guruhlarni yo'nalishga va tegishli semestrga biriktiring.</p>
                    <div className="groups-table-wrapper">
                        <table className="groups-table">
                            <thead>
                                <tr>
                                    <th>Guruh №</th>
                                    <th>Kurs</th>
                                    <th>Semestr</th>
                                    <th>Yo'nalish (Specialization)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map(group => (
                                    <tr key={group.group_id}>
                                        <td>{group.group_number}-guruh</td>
                                        <td>{group.course_number}-kurs</td>
                                        <td>
                                            <select
                                                className="table-input"
                                                value={group.semester}
                                                onChange={(e) => handleUpdateGroup(group.group_id, { semester: Number(e.target.value) })}
                                            >
                                                {SEMESTERS.map(s => <option key={s} value={s}>{s}-semestr</option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                className="table-input"
                                                value={group.specialization_id || ""}
                                                onChange={(e) => handleUpdateGroup(group.group_id, { specialization_id: e.target.value || null })}
                                            >
                                                <option value="">General (Umumiy)</option>
                                                {specs.map(s => <option key={s.specialization_id} value={s.specialization_id}>{s.name}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="action-footer card">
                <div className="info">
                    <h3 style={{ color: "var(--accent-primary)" }}>🚀 Jadvalni Avtomatik Tuzish</h3>
                    <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>Barcha guruhlar va o'quv rejalari asosida jadvalni generatsiya qilish.</p>
                </div>
                <div className="btns">
                    <button className="btn-secondary" onClick={() => handleGenerate(false)} disabled={loading}>Preview Test</button>
                    <button className="btn-primary" onClick={() => handleGenerate(true)} disabled={loading}>Haqiqiy Generatsiya (Saqlash)</button>
                </div>
            </div>

            <style>{`
                .academic-page { display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px; }
                .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .full-width { grid-column: 1 / -1; }
                
                .section-title { font-size: 1.2rem; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px; color: var(--text-primary); }
                
                .add-form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
                
                .spec-list { max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 5px; }
                .spec-item { 
                    padding: 12px; 
                    background: var(--bg-secondary); 
                    border-radius: 8px; 
                    border: 1px solid var(--border);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .spec-item:hover { border-color: var(--accent-primary); background: var(--bg-card); }
                .spec-item.active { border-color: var(--accent-primary); background: rgba(99, 102, 241, 0.15); box-shadow: inset 0 0 0 1px var(--accent-primary); }
                
                .semester-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
                .sem-tab { 
                    padding: 8px 14px; 
                    border-radius: 8px; 
                    border: 1px solid var(--border); 
                    background: var(--bg-secondary); 
                    color: var(--text-secondary);
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }
                .sem-tab.active { background: var(--accent-primary); color: white; border-color: var(--accent-primary); }
                
                .scrollable { max-height: 450px; overflow-y: auto; padding-right: 5px; }
                .curriculum-editor { display: flex; flex-direction: column; gap: 10px; }
                .lesson-row { 
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                    padding: 12px; 
                    background: var(--bg-secondary);
                    border-radius: 10px;
                    border: 1px solid transparent;
                }
                .lesson-name { flex: 1; font-weight: 500; font-size: 0.95rem; }
                .times-selector { display: flex; align-items: center; gap: 12px; background: var(--bg-card); padding: 6px 10px; border-radius: 8px; border: 1px solid var(--border); }
                .times-selector button { 
                    width: 28px; 
                    height: 28px; 
                    border: none; 
                    background: var(--accent-primary); 
                    color: white; 
                    border-radius: 6px; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    font-size: 1.2rem;
                    transition: opacity 0.2s;
                }
                .times-selector button:hover { opacity: 0.8; }
                .times-selector .count { font-weight: 700; min-width: 20px; text-align: center; color: var(--text-primary); }
                
                .groups-table-wrapper { overflow-x: auto; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border); }
                .groups-table { width: 100%; border-collapse: collapse; text-align: left; }
                .groups-table th { padding: 15px; background: var(--bg-card); color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .groups-table td { padding: 12px 15px; border-top: 1px solid var(--border); }
                .table-input { 
                    background: var(--bg-card); 
                    color: var(--text-primary); 
                    border: 1px solid var(--border); 
                    padding: 6px 12px; 
                    border-radius: 6px; 
                    font-size: 0.9rem;
                    outline: none;
                }
                .table-input:focus { border-color: var(--accent-primary); }

                .action-footer { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 24px 32px;
                    background: rgba(17, 24, 39, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid var(--accent-primary);
                    margin-top: 10px;
                }
                .p-muted { color: var(--text-muted); text-align: center; padding: 60px; font-style: italic; }

                @media (max-width: 1000px) {
                    .grid-layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
