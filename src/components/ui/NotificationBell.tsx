"use client"

import { notificationConfig } from "@/lib/signalr/notifications/config"
import { NotificationMessage } from "@/types/notification"
import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"


interface NotificationBellProps {
    count: number
    notifications: NotificationMessage[]
    onMarkAllRead?: () => void
}

const TABS = ["All", "Mentions", "Likes", "Follows"] as const
type Tab = (typeof TABS)[number]


const tabFilter: Record<Tab, (n: NotificationMessage) => boolean> = {
    All: () => true,
    Mentions: (n) => notificationConfig[n.type]?.group === "mentions",
    Likes: (n) => notificationConfig[n.type]?.group === "likes",
    Follows: (n) => notificationConfig[n.type]?.group === "follows",
};



function getInitials(name?: string | null): string {
    if (!name) return "?"
    return name.slice(0, 2).toUpperCase()
}

function timeAgo(createdAt: string): string {
    const diff = Date.now() - new Date(createdAt).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
}

export default function NotificationBell({ count, notifications, onMarkAllRead }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<Tab>("All")
    const containerRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    const filtered = notifications.filter(tabFilter[activeTab])
    const unreadCount = notifications.filter((n) => !n.readAt).length

    const tabCounts: Record<Tab, number> = {
        All: notifications.filter((n) => !n.readAt).length,
        Mentions: notifications.filter((n) => tabFilter.Mentions(n) && !n.readAt).length,
        Likes: notifications.filter((n) => tabFilter.Likes(n) && !n.readAt).length,
        Follows: notifications.filter((n) => tabFilter.Follows(n) && !n.readAt).length,
    };


    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="cursor-pointer relative rounded-full border border-brand-gold/25 bg-brand-gold/15 p-2"
                aria-label="Notifications"
            >
                <Image alt="notifications" src={"/imgs/profile/notifications.svg"} width={22} height={22} />
                {unreadCount > 0 && (
                    <span className="font-manrope font-bold text-[16px] leading-3.75 text-brand-dark rounded-full w-fit h-fit px-1.5 py-0.5 bg-brand-gold border border-brand-dark absolute -bottom-1 -right-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-95 rounded-2xl border border-brand-gold/20 bg-brand-dark shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-brand-gold/15">
                        <div className="flex items-center gap-2  font-manrope ">
                            <span className="font-semibold font-manrope text-[11px] text-brand-light leading-2.75 tracking-[0.3px]  ">Notifications</span>
                            {count > 0 && (
                                <span className="text-[10px] leading-[18px] font-bold text-brand-dark bg-brand-gold rounded-full px-1.5">
                                    {count}
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={onMarkAllRead}
                                className="text-[11px] font-manrope font-semibold leading-2.75 text-brand-gold hover:opacity-80 cursor-pointer"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4 px-4 py-2 border-b border-brand-gold/15">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative text-[11px] font-manrope font-bold cursor-pointer transition-colors ${activeTab === tab
                                    ? "border-b border-brand-gold text-brand-light"
                                    : "text-brand-muted hover:text-muted/80"
                                    }`}
                            >
                                {tab}

                                {tabCounts[tab] > 0 && (
                                    <span className="absolute -top-2 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-dark">
                                        {tabCounts[tab]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-h-100 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <EmptyState />
                        ) : (
                            filtered.map((n, i) => (
                                <NotificationItem key={`${n.senderId}-${n.createdAt}-${i}`} notification={n} />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function NotificationItem({ notification }: { notification: NotificationMessage }) {
    const isRead = notification.readAt ?? false;

    const config = notificationConfig[notification.type];
    const Icon = config?.icon;

    const senderUrl = config?.senderUrl(notification);
    const targetUrl = config?.targetUrl(notification);


    return (
        <div
            className={`flex gap-3 px-4 py-3 border-b border-brand-gold/10 transition-colors ${isRead
                ? "bg-brand-dark hover:opacity-70"
                : "hover:bg-brand-gold/5 bg-brand-gold/15"
                }`}
        >
            <div className="relative shrink-0">
                {notification.senderAvatar ? (
                    <Image
                        alt=""
                        src={notification.senderAvatar}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center text-[12px] font-medium text-brand-gold">
                        {getInitials(notification.senderName)}
                    </div>
                )}

                <div className="absolute bottom-3 -right-1 w-4 h-4 rounded-full bg-brand-dark border border-brand-gold/30 flex items-center justify-center">
                    {Icon ? (
                        <Image
                            src={config.icon}
                            alt=""
                            width={10}
                            height={10}
                        />
                    ) : (
                        <Image
                            alt=""
                            src="/imgs/notifications/reply.svg"
                            width={10}
                            height={10}
                        />
                    )}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[13px] text-brand-muted flex flex-row gap-1 leading-[20px]">
                    {senderUrl ? (
                        <Link href={senderUrl} className="text-brand-light hover:underline">
                            @{notification.senderName ?? "user"}
                        </Link>
                    ) : (
                        <span className="text-brand-light">
                            @{notification.senderName ?? "user"}
                        </span>
                    )}
                    <span>
                        {config?.text}
                    </span>
                </p>

                {notification.targetPayload && targetUrl && config?.payloadClickable ? (
                    <Link
                        href={targetUrl}
                        className="text-brand-gold hover:underline ml-1"
                    >
                        "{notification.targetPayload}"
                    </Link>
                ) : (
                    notification.targetPayload && (
                        <span className="text-white/50 italic">
                            "{notification.targetPayload}"
                        </span>
                    )
                )}

                <span className="text-[11px] text-white/40">
                    {timeAgo(notification.createdAt)}
                </span>
            </div>

            {!isRead && (
                <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-gold mt-2" />
            )}
        </div>
    );
}


function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-gold/15 flex items-center justify-center mb-4">
                <Image alt="" src={"/imgs/profile/notifications.svg"} width={24} height={24} />
            </div>
            <p className="font-oswald font-light text-brand-light leading-[26.4px] mb-1">You&apos;re all caught up</p>
            <p className="text-[13.5px] font-manrope  text-brand-muted leading-[21.6px]">
                New likes, replies, mentions and follows on your reviews and lists will appear here.
            </p>
        </div>
    )
}