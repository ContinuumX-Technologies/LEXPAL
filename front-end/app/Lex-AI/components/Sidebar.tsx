"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import styles from "./Sidebar.module.css";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { PanelLeftClose, SquarePen, LayoutGrid, Check, X, Search, Image as LucideImage, Share, Archive, Trash2, MoreHorizontal } from "lucide-react";

interface Conversation {
    _id: string;
    title: string | null;
    description: string;
    timestamp: Date | string;
}

interface SidebarProps {
    onNewChat: () => void;
    className?: string;
}

function getRelativeDateLabel(dateInput: Date | string): string {
    const date = new Date(dateInput);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (compareDate.getTime() === today.getTime()) {
        return "Today";
    } else if (compareDate.getTime() === yesterday.getTime()) {
        return "Yesterday";
    } else if (compareDate > sevenDaysAgo) {
        return "Previous 7 Days";
    } else if (compareDate > thirtyDaysAgo) {
        return "Previous 30 Days";
    } else {
        return date.getFullYear() === now.getFullYear()
            ? date.toLocaleString('default', { month: 'long' })
            : date.getFullYear().toString();
    }
}

import { useSidebar } from "../SidebarContext";

export default function Sidebar({ onNewChat, className }: SidebarProps) {
    const { toggleSidebar, isSidebarOpen, setSidebarOpen } = useSidebar();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);

    // State for interactions
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const params = useParams();
    const currentConvoId = params?.convoId as string;
    const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL;

    // Fetch Logic
    const fetchRecentConvos = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${server_url}/api/AI/recent-conversation`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) return;

            const data = await res.json();
            setConversations(data.conversations);
        } catch (err) {
            console.error("Failed to fetch conversations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentConvos();

        // Click outside to close menu
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Menu Actions
    const handleMenuOpen = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (activeMenuId === id) {
            setActiveMenuId(null);
        } else {
            setActiveMenuId(id);
        }
    };

    const handleStartRename = (e: React.MouseEvent, convo: Conversation) => {
        e.stopPropagation();
        setRenamingId(convo._id);
        setRenameValue(convo.title || "Untitled Chat");
        setActiveMenuId(null);
    };

    const handleSubmitRename = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!renamingId) return;

        // Optimistic update
        setConversations(prev => prev.map(c =>
            c._id === renamingId ? { ...c, title: renameValue } : c
        ));

        try {
            await fetch(`${server_url}/api/AI/conversation/${renamingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: renameValue }),
                credentials: "include"
            });
        } catch (err) {
            console.error("Rename failed", err);
            fetchRecentConvos(); // Revert
        }
        setRenamingId(null);
    };

    const handleStartDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeletingId(id);
        setActiveMenuId(null);
    };

    const confirmDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeletingId(null);

        setConversations(prev => prev.filter(c => c._id !== id));

        try {
            await fetch(`${server_url}/api/AI/conversation/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (currentConvoId === id) {
                router.push("/Lex-AI/new");
            }
        } catch (err) {
            console.error("Failed to delete", err);
            fetchRecentConvos();
        }
    };

    // Grouping
    const groupedConversations = useMemo(() => {
        const groups: Record<string, Conversation[]> = {};
        const sorted = [...conversations].sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        sorted.forEach(convo => {
            const label = getRelativeDateLabel(convo.timestamp);
            if (!groups[label]) groups[label] = [];
            groups[label].push(convo);
        });

        const order = ["Today", "Yesterday", "Previous 7 Days", "Previous 30 Days"];
        Object.keys(groups).forEach(key => {
            if (!order.includes(key)) order.push(key);
        });

        return order
            .filter(key => groups[key] && groups[key].length > 0)
            .map(key => ({ label: key, items: groups[key] }));
    }, [conversations]);

    if (!isSidebarOpen) {
        return (
            <aside className={`${styles.sidebar} ${styles.miniSidebar} ${className || ''}`}>
                <div className={styles.miniHeader}>
                    <button className={styles.miniIconBtn} onClick={toggleSidebar} title="Expand Sidebar">
                        <div className={styles.gptIcon} style={{ width: 28, height: 28 }}>
                            <img src="/lexpal-logo-small.png" alt="L" style={{ width: 16, height: 16 }} />
                        </div>
                    </button>
                    <button className={styles.miniIconBtn} onClick={onNewChat} title="New Chat">
                        <SquarePen size={20} />
                    </button>
                    <button className={styles.miniIconBtn} title="Search (Placeholder)">
                        <Search size={20} />
                    </button>
                    <button className={styles.miniIconBtn} title="Gallery (Placeholder)">
                        <LucideImage size={20} />
                    </button>
                </div>

                <div style={{ flex: 1 }} />

                <div className={styles.miniFooter}>
                    <button className={styles.miniIconBtn} title="User Profile">
                        <div className={styles.avatar}>S</div>
                    </button>
                </div>
            </aside>
        );
    }

    return (
        <>
            <aside className={`${styles.sidebar} ${className || ''} ${isSidebarOpen ? styles.mobileOpen : ''}`}>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.topActions}>
                        <button className={styles.sidebarToggleBtn} title="Close Sidebar" onClick={toggleSidebar}>
                            <PanelLeftClose size={20} />
                        </button>
                        <button className={styles.newChatIconBtn} onClick={onNewChat} title="New Chat">
                            <SquarePen size={20} />
                        </button>
                    </div>

                    <div className={styles.navLinks}>
                        <button className={`${styles.navItem} ${!currentConvoId || currentConvoId === 'new' ? styles.active : ''}`} onClick={onNewChat}>
                            <div className={styles.gptIcon}>
                                <img src="/lexpal-logo-small.png" alt="L" style={{ width: 14, height: 14 }} />
                            </div>
                            <span>Lexpal AI</span>
                        </button>
                        <button className={styles.navItem}>
                            <div className={styles.exploreIcon}>
                                <LayoutGrid size={18} />
                            </div>
                            <span>Explore GPTs</span>
                        </button>
                    </div>
                </div>

                {/* History */}
                <div className={styles.historyList}>
                    {loading && <div className={styles.loading}>Loading...</div>}

                    {!loading && conversations.length === 0 && (
                        <div className={styles.empty}>No recent chats</div>
                    )}

                    {!loading && groupedConversations.map(group => (
                        <div key={group.label}>
                            <div className={styles.dateGroup}>{group.label}</div>
                            {group.items.map(convo => {
                                const isActive = currentConvoId === convo._id;
                                const isRenaming = renamingId === convo._id;
                                const isDeleting = deletingId === convo._id;
                                const isMenuOpen = activeMenuId === convo._id;

                                return (
                                    <div key={convo._id} className={styles.historyItemWrapper}>
                                        {isDeleting ? (
                                            <div className={styles.deleteConfirm}>
                                                <span style={{ fontSize: 12, marginRight: 4 }}>Delete?</span>
                                                <button className={styles.checkIconBtn} onClick={(e) => confirmDelete(e, convo._id)}>
                                                    <Check size={16} />
                                                </button>
                                                <button className={styles.closeIconBtn} onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : isRenaming ? (
                                            <div className={styles.historyItem} style={{ padding: '6px 12px' }}>
                                                <form onSubmit={handleSubmitRename} style={{ width: '100%' }}>
                                                    <input
                                                        className={styles.renameInput}
                                                        autoFocus
                                                        value={renameValue}
                                                        onChange={(e) => setRenameValue(e.target.value)}
                                                        onBlur={() => handleSubmitRename()}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Escape') setRenamingId(null);
                                                        }}
                                                    />
                                                </form>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    className={`${styles.historyItem} ${isActive ? styles.active : ''}`}
                                                    onClick={() => {
                                                        router.push(`/Lex-AI/${convo._id}`);
                                                        if (window.innerWidth < 768) setSidebarOpen(false); // Close on selection (mobile)
                                                    }}
                                                >
                                                    <span className={styles.historyItemTitle}>{convo.title || "Untitled Chat"}</span>
                                                </button>

                                                {/* Menu Trigger */}
                                                <button
                                                    className={`${styles.itemOptionsBtn}`}
                                                    onClick={(e) => handleMenuOpen(e, convo._id)}
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {isMenuOpen && (
                                                    <div className={styles.menuPopover} ref={menuRef}>
                                                        <button className={styles.menuItem} onClick={(e) => { e.stopPropagation(); console.log('Share'); setActiveMenuId(null); }}>
                                                            <Share size={16} className="menuIcon" />
                                                            Share
                                                        </button>
                                                        <button className={styles.menuItem} onClick={(e) => handleStartRename(e, convo)}>
                                                            <SquarePen size={16} className="menuIcon" />
                                                            Rename
                                                        </button>
                                                        <button className={styles.menuItem} onClick={(e) => { e.stopPropagation(); console.log('Archive'); setActiveMenuId(null); }}>
                                                            <Archive size={16} className="menuIcon" />
                                                            Archive
                                                        </button>
                                                        <div style={{ height: 1, background: 'rgba(0,0,0,0.1)', margin: '4px 0' }}></div>
                                                        <button className={`${styles.menuItem} ${styles.delete}`} onClick={(e) => handleStartDelete(e, convo._id)}>
                                                            <Trash2 size={16} className="menuIcon" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button className={styles.userProfileBtn}>
                        <div className={styles.avatar}>S</div>
                        <span className={styles.userName}>Sarat Behera</span>
                        <span className={styles.planTag}>PLUS</span>
                    </button>
                </div>
            </aside>
            {/* Mobile Overlay */}
            <div
                className={`${styles.mobileOverlay} ${isSidebarOpen ? styles.visible : ''}`}
                onClick={() => setSidebarOpen(false)}
            />
        </>
    );
}
