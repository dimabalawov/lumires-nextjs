"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { subscribeToast } from "@/lib/signalr/notifications/toast";
import type { NotificationType } from "@/types/notification";
import { notificationConfig } from "@/lib/signalr/notifications/config";
import Image from 'next/image'

type ToastItem = {
    id: string;
    title: string;
    type?: string;
    message: string;
    senderUrl?: string;
    senderAvatar: string | null;
    targetUrl?: string | null;
    targetPayload?: string | null;
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
                    prev.map((x) =>
                        x.id === id ? { ...x, removing: true } : x
                    )
                );

                setTimeout(() => {
                    setToasts((prev) =>
                        prev.filter((x) => x.id !== id)
                    );
                }, 300);
            }, 10000);
        });
    }, []);

    return (
        <>
            {toasts.length > 0 && (
                <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                    {toasts.map((t) => {
                        const config =
                            t.type
                                ? notificationConfig[t.type as NotificationType]
                                : undefined;

                        const Icon = config?.icon;

                        return (
                            <div
                                key={t.id}
                                style={{
                                    animation: t.removing
                                        ? "toast-out 0.25s ease forwards"
                                        : "toast-in 0.35s cubic-bezier(0.21,1.02,0.73,1) forwards",
                                }}
                                className="font-manrope pointer-events-auto w-80 rounded-[10px] overflow-hidden bg-linear-to-r from-[#1F1B17] to-[#1A1714] border border-white/[0.08]"
                            >
                                <div className="p-3 pb-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="relative shrink-0">
                                            {t.senderAvatar ? (
                                                <img
                                                    src={t.senderAvatar}
                                                    alt={t.title}
                                                    className="w-9 h-9 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-[#6b3a3a] flex items-center justify-center text-[13px] font-semibold text-[#e8b4b4]">
                                                    {t.title
                                                        .slice(0, 2)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            {Icon && (
                                                <span className="absolute -bottom-2 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-[#1A1714] border border-white/10">
                                                    <Image
                                                        src={config.icon}
                                                        alt=""
                                                        width={11}
                                                        height={11}
                                                    />
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[14px] text-white/90 leading-snug">
                                                <Link
                                                    href={
                                                        t.senderUrl ?? "#"
                                                    }
                                                    className="text-brand-light font-medium hover:underline"
                                                >
                                                    @{t.title}
                                                </Link>{" "}
                                                <span className="text-white/60">
                                                    {t.message}

                                                    {t.targetUrl &&
                                                        t.targetPayload && (
                                                            <>
                                                                {" "}
                                                                <Link
                                                                    href={
                                                                        t.targetUrl
                                                                    }
                                                                    className="text-brand-gold font-medium hover:underline"
                                                                >
                                                                    {
                                                                        t.targetPayload
                                                                    }
                                                                </Link>
                                                            </>
                                                        )}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-1.5 ml-11.5">
                                        <span className="text-[11px] text-white/30">
                                            just now
                                        </span>

                                        {t.targetUrl && (
                                            <Link
                                                href={t.targetUrl}
                                                className="flex items-center gap-1 text-[14px] text-white/80 border border-white/20 rounded-md px-4 py-1 hover:bg-white/10 transition-colors"
                                            >
                                                View →
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="h-0.5 bg-white/5">
                                    <div
                                        className="h-full bg-[#c4a0a0]/40"
                                        style={{
                                            animation:
                                                "toast-progress 10s linear forwards",
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#12100E",
                        color: "#D2A66A",
                        fontFamily: "Manrope, sans-serif",
                        borderRadius: "10px",
                        border: "1px solid #D2A66A",
                        padding: "16px 20px",
                        fontSize: "18px",
                    },
                }}
            />
        </>
    );
}