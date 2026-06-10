"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToast } from "@/lib/signalr/notifications/toast";

type ToastItem = {
    id: string;
    title: string;
    message: string;
    senderUrl?: string;
    targetUrl?: string | null;
    removing?: boolean;
};


export function ToastProvider() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        return subscribeToast((t) => {
            const id = crypto.randomUUID();
            setToasts((prev) => [{ id, ...t }, ...prev]);

            setTimeout(() => {
                setToasts((prev) =>
                    prev.map((x) => (x.id === id ? { ...x, removing: true } : x))
                );
                setTimeout(() => {
                    setToasts((prev) => prev.filter((x) => x.id !== id));
                }, 300);
            }, 10000);
        });
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-9999 flex flex-col gap-2 pointer-events-none">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    style={{
                        animation: t.removing
                            ? "toast-out 0.25s ease forwards"
                            : "toast-in 0.35s cubic-bezier(0.21,1.02,0.73,1) forwards",
                    }}
                    className="pointer-events-auto w-100 rounded-[10px] overflow-hidden bg-linear-to-r from-[#1F1B17] to-[#1A1714] border border-white/[0.08]"
                >
                    <div className="p-3 pb-2">
                        <div className="flex items-start gap-2.5">
                            <div className="relative shrink-0">
                                <div className="w-9 h-9 rounded-full bg-[#6b3a3a] flex items-center justify-center text-[13px] font-semibold text-[#e8b4b4]">
                                    {t.title.slice(0, 2).toUpperCase()}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-white/90 leading-snug">
                                    <Link href={t.senderUrl ?? "#"} className="text-brand-light font-medium hover:underline">
                                        @{t.title}
                                    </Link>{" "}
                                    <span className="text-white/60">{t.message}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-2.5 ml-11.5">
                            <span className="text-[11px] text-white/30">just now</span>
                            {t.targetUrl && (
                                <p className="text-brand-gold">
                                    <Link
                                        href={t.targetUrl}
                                        className="flex items-center gap-1 text-[12px] text-white/70 border border-white/20 rounded-md px-3 py-1 hover:bg-white/10 transition-colors"
                                    >
                                        View →
                                    </Link>
                                </p>

                            )}
                        </div>
                    </div>

                    <div className="h-0.5 bg-white/5">
                        <div
                            className="h-full bg-[#c4a0a0]/40"
                            style={{ animation: "toast-progress 10s linear forwards" }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}