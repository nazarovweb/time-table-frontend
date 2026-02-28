const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Teacher {
    teacher_id: number;
    first_name: string;
    last_name: string;
}

export interface Group {
    group_id: number;
    group_number: number;
    course_number: number;
    semester: number;
    specialization_id: number | null;
}

export interface Lesson {
    lesson_id: number;
    title: string;
}

export interface Room {
    room_id: number;
    floor: number;
    room_number: string;
    type: number;
}

export interface ScheduleItem {
    schedule_id: number;
    group_id: number;
    teacher_id: number;
    lesson_id: number;
    room_id: number;
    day_of_week: number;
    lesson_order: number;
    group: Group;
    teacher: Teacher;
    lesson: Lesson;
    room: Room;
}

export interface User {
    user_id: number;
    full_name: string;
    email: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
}

export interface AuthResponse {
    token: string;
    user: User;
}

// ─── Teachers ───────────────────────────────────────────────
export async function getTeachers(): Promise<Teacher[]> {
    const res = await fetch(`${BASE_URL}/teachers`);
    if (!res.ok) throw new Error("O'qituvchilar ro'yxatini olishda xato");
    return res.json();
}

// ─── Groups ─────────────────────────────────────────────────
export async function getGroups(): Promise<Group[]> {
    const res = await fetch(`${BASE_URL}/groups`);
    if (!res.ok) throw new Error("Guruhlar ro'yxatini olishda xato");
    return res.json();
}

// ─── Schedule ───────────────────────────────────────────────
export async function getScheduleByTeacher(
    teacher_id: number,
    day_of_week: number
): Promise<ScheduleItem[]> {
    const res = await fetch(`${BASE_URL}/schedule/teacher/${teacher_id}/${day_of_week}`);
    if (!res.ok) throw new Error("Jadval olishda xato");
    return res.json();
}

export async function getScheduleByGroup(
    group_id: number,
    day_of_week: number
): Promise<ScheduleItem[]> {
    const res = await fetch(`${BASE_URL}/schedule/group/${group_id}/${day_of_week}`);
    if (!res.ok) throw new Error("Jadval olishda xato");
    return res.json();
}

export async function getScheduleByRoom(
    room_id: number,
    day_of_week: number
): Promise<ScheduleItem[]> {
    const res = await fetch(`${BASE_URL}/schedule/room/${room_id}/${day_of_week}`);
    if (!res.ok) throw new Error("Jadval olishda xato");
    return res.json();
}

export async function getWeekScheduleByGroup(group_id: number): Promise<ScheduleItem[]> {
    const res = await fetch(`${BASE_URL}/schedule/week/group/${group_id}`);
    if (!res.ok) throw new Error("Haftalik jadval olishda xato");
    return res.json();
}

export async function getWeekScheduleByTeacher(teacher_id: number): Promise<ScheduleItem[]> {
    const res = await fetch(`${BASE_URL}/schedule/week/teacher/${teacher_id}`);
    if (!res.ok) throw new Error("Haftalik jadval olishda xato");
    return res.json();
}

export interface ConflictError {
    error: string;
    conflicts: { type: string; message: string }[];
}

export async function moveSchedule(
    schedule_id: number,
    day_of_week: number,
    lesson_order: number,
    token: string
): Promise<ScheduleItem> {
    const res = await fetch(`${BASE_URL}/schedule/${schedule_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ day_of_week, lesson_order }),
    });
    const data = await res.json();
    if (!res.ok) throw data as ConflictError;
    return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login xato");
    return data;
}

export async function register(
    full_name: string,
    email: string,
    password: string
): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Ro'yxatdan o'tishda xato");
    return data;
}

// ─── Academic API ───────────────────────────────────────────────────────────

export interface Specialization {
    specialization_id: number;
    name: string;
    description: string | null;
}

export interface CurriculumItem {
    curriculum_id: number;
    specialization_id: number;
    semester: number;
    lesson_id: number;
    times_per_week: number;
    lesson: Lesson;
    specialization: Specialization;
}

export async function getSpecializations(): Promise<Specialization[]> {
    const res = await fetch(`${BASE_URL}/academic/specializations`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    return res.json();
}

export async function createSpecialization(data: { name: string; description?: string }): Promise<Specialization> {
    const res = await fetch(`${BASE_URL}/academic/specializations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function getCurriculum(specialization_id?: number, semester?: number): Promise<CurriculumItem[]> {
    const params = new URLSearchParams();
    if (specialization_id) params.append("specialization_id", specialization_id.toString());
    if (semester) params.append("semester", semester.toString());

    const res = await fetch(`${BASE_URL}/academic/curriculum?${params.toString()}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    return res.json();
}

export async function updateCurriculum(data: {
    specialization_id: number;
    semester: number;
    lesson_id: number;
    times_per_week: number;
}): Promise<CurriculumItem> {
    const res = await fetch(`${BASE_URL}/academic/curriculum`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function generateTimetable(finalize = false): Promise<any> {
    const res = await fetch(`${BASE_URL}/academic/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ finalize })
    });
    return res.json();
}
