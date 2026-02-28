"use client";
import { useEffect, useState } from "react";

export interface ToastItem {
    id: number;
    type: "success" | "error" | "warning";
    message: string;
}

let toastId = 0;
let addToastFn: ((t: Omit<ToastItem, "id">) => void) | null = null;

export function toast(type: ToastItem["type"], message: string) {
    if (addToastFn) addToastFn({ type, message });
}

export default function Toast() {
    const [items, setItems] = useState<ToastItem[]>([]);

    useEffect(() => {
        addToastFn = (t) => {
            const id = ++toastId;
            setItems((prev) => [...prev, { ...t, id }]);
            setTimeout(() => {
                setItems((prev) => prev.filter((x) => x.id !== id));
            }, 4000);
        };
        return () => { addToastFn = null; };
    }, []);

    if (items.length === 0) return null;

    const icons: Record<ToastItem["type"], string> = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
    };
    const colors: Record<ToastItem["type"], string> = {
        success: "rgba(16,185,129,0.15)",
        error: "rgba(239,68,68,0.15)",
        warning: "rgba(245,158,11,0.15)",
    };
    const borders: Record<ToastItem["type"], string> = {
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
    };

    return (
        <div className="toast-container">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="toast-item"
                    style={{ background: colors[item.type], borderColor: borders[item.type] }}
                >
                    <span>{icons[item.type]}</span>
                    <span className="toast-msg">{item.message}</span>
                </div>
            ))}
            <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 380px;
        }
        .toast-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: slideIn 0.3s ease;
          color: var(--text-primary);
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .toast-msg { flex: 1; }
      `}</style>
        </div>
    );
}
