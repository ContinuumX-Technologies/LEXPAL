"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "../components/ChatInput";
import { useSidebar } from "../SidebarContext";
import { ContextItem } from "../components/ContextPicker";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import ReactMarkdown from 'react-markdown';
import { Copy, RotateCw, Share, MoreHorizontal, ChevronLeft, ChevronRight, Sparkles, MessageSquare, FileText, SquarePen, Pencil } from "lucide-react";

type ChatMessage = {
  id?: string;
  sender: "AI" | "User";
  content: string;
  createdAt?: string;
  attachedContext?: ContextItem[];
  // Versioning
  versions?: { content: string; snapshot: ChatMessage[] }[];
  currentVersion?: number;
};

const MainChatPage = () => {

  const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL;
  const router = useRouter();
  const params = useParams();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const convoIdFromParams =
    typeof params.convoId === "string"
      ? params.convoId === "null"
        ? null
        : params.convoId
      : null;

  // Initialize directly to avoid double-render and sync mismatch
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(convoIdFromParams);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [socketVersion, setSocketVersion] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);
  const [activeMoreMenuIndex, setActiveMoreMenuIndex] = useState<number | null>(null);

  /* ─────────────────────────────────────────────
     SYNC URL PARAM → STATE
     ───────────────────────────────────────────── */
  useEffect(() => {
    setCurrentConvoId(convoIdFromParams);
  }, [convoIdFromParams]);

  /* ─────────────────────────────────────────────
     HELPER: PARSE CONTEXT FROM RAW MESSAGE
     ───────────────────────────────────────────── */
  const parseMessageWithContext = (msg: any): ChatMessage => {
    // Recursive parsing for snapshots in versions
    const parsedVersions = msg.versions?.map((v: any) => ({
      content: v.content,
      snapshot: v.snapshot?.map((s: any) => parseMessageWithContext(s)) || []
    }));

    const baseMsg = {
      id: msg._id,
      sender: msg.sender as "AI" | "User",
      content: msg.content,
      createdAt: msg.createdAt,
      versions: parsedVersions,
      currentVersion: msg.currentVersion
    };

    if (msg.sender === 'AI') {
      return baseMsg;
    }

    const contextRegex = /--- Context Attached ---\n([\s\S]*?)\n--- End Context ---\n\n/g;
    const match = contextRegex.exec(msg.content);

    if (match) {
      const contextBlock = match[1];
      const realContent = msg.content.replace(match[0], '');
      const reconstructedContext: ContextItem[] = [];
      const lines = contextBlock.split('\n');
      lines.forEach(line => {
        if (line.startsWith('Context Type:')) {
          let name = 'Unknown';
          let type: 'chat' | 'file' = 'chat';
          if (line.includes('Chat History with')) {
            name = line.split('Chat History with')[1]?.trim() || 'Chat';
            type = 'chat';
          } else if (line.includes('File Metadata -')) {
            name = line.split('File Metadata -')[1]?.split('(')[0]?.trim() || 'File';
            type = 'file';
          }
          if (name) {
            reconstructedContext.push({ type, id: 'recovered-id', name: name, info: '' });
          }
        }
      });
      return {
        ...baseMsg,
        content: realContent,
        attachedContext: reconstructedContext.length > 0 ? reconstructedContext : undefined
      };
    }
    return baseMsg;
  };

  /* ─────────────────────────────────────────────
     EFFECT 1: HISTORY LOADING (Runs on Convo Change)
     ───────────────────────────────────────────── */
  useEffect(() => {
    const fetchHistory = async (convoId: string) => {
      // Don't fetch if it's a "new" chat or we already have messages for this specific ID (basic optimization)
      // Actually we should always fetch if ID changed
      console.log('Fetching history for:', convoId);

      setIsFetching(true);
      setConnectionError(null);
      setMessages([]); // Clear current
      setCursor(null);
      setHasMore(true);

      try {
        const url = `${server_url}/api/AI/convo-history/${convoId}`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load history");

        const data = await res.json();
        // data.messages is array of { sender, content, ... }
        // We need to parse them
        const parsed = data.messages.map((m: any) => parseMessageWithContext(m));

        setMessages(parsed);
        // If your API supports pagination (cursor), set it here.
        // For now assuming full load or standard pagination logic
        setHasMore(false); // Disable logic for now or adapt if API sends cursor
      } catch (err) {
        console.error(err);
        setConnectionError("Could not load history");
      } finally {
        setIsFetching(false);
      }
    };

    if (currentConvoId && currentConvoId !== 'new') {
      fetchHistory(currentConvoId);
    } else {
      setMessages([]);
    }
  }, [currentConvoId, server_url]);

  /* ─────────────────────────────────────────────
     EFFECT 2: SOCKET CONNECTION (Runs on Convo Change + Version Update)
     ───────────────────────────────────────────── */
  useEffect(() => {
    setSocketReady(false);
    setConnectionError(null);

    let isMounted = true;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      const serverHost = server_url?.replace(/^https?:\/\//, '') || 'localhost:5001';
      const wsProtocol = server_url?.startsWith('https://') ? 'wss://' : 'ws://';
      const wsUrl = currentConvoId === null
        ? `${wsProtocol}${serverHost}/ws/ai-chat`
        : `${wsProtocol}${serverHost}/ws/ai-chat?convo_id=${currentConvoId}`;

      console.log('Connecting to WebSocket:', wsUrl);
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connection established');
        if (!isMounted) {
          socket.close();
          return;
        }
        setSocketReady(true);
        setConnectionError(null);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "ai_message") {
            setMessages((prev) => [...prev, { sender: "AI", content: payload.content }]);
            setIsProcessing(false);
          }
        } catch (error) {
          console.log('Error parsing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.log('WebSocket error:', error);
        if (isMounted) {
          setConnectionError('Connection error.');
          setSocketReady(false);
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        if (!isMounted) return;
        setSocketReady(false);
        // Auto-reconnect if not 1000 (Normal Closure) OR if it was closed via handleStop (we manually re-triggered version update so this might not be needed? 
        // Actually if handleStop closes it, event code is 1000 usually unless specified otherwise.
        // If we triggered version update, this effect re-runs anyway.
        // So this logic handles unexpected disconnects.
        if (isMounted && event.code !== 1000) {
          reconnectTimeout = setTimeout(() => {
            if (isMounted) connectWebSocket();
          }, 3000);
        }
      };
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounting or Effect re-run");
        socketRef.current = null;
      }
    };
  }, [currentConvoId, server_url, socketVersion]);

  /* ─────────────────────────────────────────────
     AUTO SCROLL
     ───────────────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ─────────────────────────────────────────────
     PAGINATION
     ───────────────────────────────────────────── */
  const handleScroll = async () => {
    if (
      !chatAreaRef.current ||
      isFetching ||
      !hasMore ||
      !cursor ||
      !currentConvoId ||
      chatAreaRef.current.scrollTop > 50
    )
      return;

    setIsFetching(true);

    try {
      const res = await fetch(
        `${server_url}/api/AI/convo-history/${currentConvoId}?cursor=${cursor}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        setIsFetching(false);
        return;
      }

      const data = await res.json();

      const parsedMessages = data.messages.map(parseMessageWithContext);
      setMessages((prev) => [...parsedMessages, ...prev]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
      setIsFetching(false);
    } catch (error) {
      console.log('Error loading more messages:', error);
      setIsFetching(false);
    }
  };

  /* ─────────────────────────────────────────────
     HELPER: SEND TO SOCKET
     ───────────────────────────────────────────── */
  const sendToSocket = async (text: string, context: ContextItem[] = [], editInfo?: { messageId?: string, snapshot?: ChatMessage[] }) => {
    if (!socketRef.current || !socketReady) return;

    let finalContent = text;
    if (context.length > 0) {
      setIsProcessing(true);
      const contextPromises = context.map(async (c) => {
        if (c.type === 'chat') {
          try {
            const res = await fetch(`${server_url}/api/user/chat/history/${c.id}`, { credentials: "include" });
            if (res.ok) {
              const data = await res.json();
              const msgs = data.messages || [];
              const recentMsgs = msgs.slice(0, 10).map((m: any) => `[${m.sender_id === c.id ? c.name : 'Me'}]: ${m.content}`).join("\n");
              return `Context Type: Chat History with ${c.name}\n${recentMsgs}`;
            }
          } catch (e) { return ``; }
        } else if (c.type === 'file') {
          return `Context Type: File Metadata - ${c.name} (${c.info})`;
        }
        return "";
      });
      const contextResults = await Promise.all(contextPromises);
      const contextStr = contextResults.filter(Boolean).join("\n\n");
      finalContent = `--- Context Attached ---\n${contextStr}\n--- End Context ---\n\n${text}`;
    } else {
      setIsProcessing(true);
    }

    const payload: any = { content: finalContent };
    if (editInfo?.messageId) {
      payload.message_id = editInfo.messageId;
      payload.snapshot = editInfo.snapshot;
    }

    socketRef.current.send(JSON.stringify(payload));
  };

  /* ─────────────────────────────────────────────
     SEND MESSAGE (USER TRIGGER)
     ───────────────────────────────────────────── */
  const sendMessage = async (text: string, context: ContextItem[]) => {
    if (!text.trim() || !socketRef.current || !socketReady || isProcessing) return;

    setMessages((prev) => [...prev, { sender: "User", content: text, attachedContext: context.length > 0 ? context : undefined }]);
    await sendToSocket(text, context);
  };

  /* ─────────────────────────────────────────────
     ACTIONS
     ───────────────────────────────────────────── */
  const handleRegenerate = async () => {
    if (isProcessing || messages.length === 0) return;

    // Find last user message
    let lastUserMsgIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "User") {
        lastUserMsgIndex = i;
        break;
      }
    }

    if (lastUserMsgIndex !== -1) {
      const lastUserMsg = messages[lastUserMsgIndex];
      // Remove everything after this user message (i.e. the failed/bad AI response)
      setMessages(prev => prev.slice(0, lastUserMsgIndex + 1));

      // Re-send
      await sendToSocket(lastUserMsg.content, lastUserMsg.attachedContext || []);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  const handleStop = () => {
    // Close socket to stop receiving chunks
    if (socketRef.current) {
      socketRef.current.close(1000, "User stopped generation");
    }
    setIsProcessing(false);

    // Trigger immediate reconnect so the input becomes ready again without waiting
    setSocketVersion(v => v + 1);
  };

  /* ─────────────────────────────────────────────
     EDIT MESSAGE LOGIC
     ───────────────────────────────────────────── */
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  /* ─────────────────────────────────────────────
     EDIT AREA AUTO-RESIZE
     ───────────────────────────────────────────── */
  const editTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingMessageIndex !== null && editTextAreaRef.current) {
      editTextAreaRef.current.style.height = "auto";
      editTextAreaRef.current.style.height = `${editTextAreaRef.current.scrollHeight}px`;
    }
  }, [editText, editingMessageIndex]);

  const handleEditClick = (index: number, content: string) => {
    setEditingMessageIndex(index);
    setEditText(content);
  };

  const cancelEdit = () => {
    setEditingMessageIndex(null);
    setEditText("");
  };

  /* ─────────────────────────────────────────────
     VERSIONING LOGIC
     ───────────────────────────────────────────── */
  const handleSaveEdit = async () => {
    if (editingMessageIndex === null || !editText.trim()) return;

    // Slice history up to the message being edited
    const historyUpToNode = messages.slice(0, editingMessageIndex);
    const oldMsg = messages[editingMessageIndex];
    const futureSnapshot = messages.slice(editingMessageIndex + 1);

    // Prepare versions array
    // If it's the first edit, version 0 is the original content + the future we are about to detach
    let versions = (oldMsg.versions && oldMsg.versions.length > 0) ? [...oldMsg.versions] : [{
      content: oldMsg.content,
      snapshot: futureSnapshot // Save the "old" future
    }];

    // Ensure current version's snapshot is up to date
    if (oldMsg.versions && oldMsg.versions.length > 0 && typeof oldMsg.currentVersion === 'number' && versions[oldMsg.currentVersion]) {
      versions[oldMsg.currentVersion].snapshot = futureSnapshot;
    }

    // Add NEW version
    versions.push({
      content: editText,
      snapshot: []
    });

    const newCurrentIndex = versions.length - 1;

    const updatedMsg: ChatMessage = {
      ...oldMsg,
      content: editText,
      versions: versions,
      currentVersion: newCurrentIndex
    };

    // Reset the main timeline: [History] + [Updated Node] + [Empty Future]
    setMessages([...historyUpToNode, updatedMsg]);
    setEditingMessageIndex(null);

    // Trigger AI
    await sendToSocket(editText, updatedMsg.attachedContext || [], {
      messageId: oldMsg.id,
      snapshot: futureSnapshot // We send the snapshot we are detaching so backend can store it
    });
  };

  const handleSwitchVersion = (msgIndex: number, direction: 'prev' | 'next') => {
    const msg = messages[msgIndex];
    if (!msg.versions || typeof msg.currentVersion !== 'number') return;

    const newVersionIdx = direction === 'prev' ? msg.currentVersion - 1 : msg.currentVersion + 1;
    if (newVersionIdx < 0 || newVersionIdx >= msg.versions.length) return;

    // 1. Save CURRENT future to current version's snapshot
    const currentFuture = messages.slice(msgIndex + 1);
    const updatedVersions = [...msg.versions];
    updatedVersions[msg.currentVersion].snapshot = currentFuture;

    // 2. Get NEW version
    const targetVersion = updatedVersions[newVersionIdx];

    // 3. Update Message
    const updatedMsg: ChatMessage = {
      ...msg,
      content: targetVersion.content,
      versions: updatedVersions,
      currentVersion: newVersionIdx
    };

    // 4. Restore snapshot from new version
    const historyUpToNode = messages.slice(0, msgIndex);
    setMessages([...historyUpToNode, updatedMsg, ...targetVersion.snapshot]);
  };



  const handleNewChat = () => {
    router.push("/Lex-AI/new");
  };

  /* ─────────────────────────────────────────────
     RENDER
     ───────────────────────────────────────────── */
  return (
    <main className={styles.main}>
      {showShareToast && <div className={styles.toast}>Link copied to clipboard</div>}

      <section className={styles.chatInterface}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {/* Back button */}
            <button
              className={styles.iconButton}
              onClick={() => router.back()}
              suppressHydrationWarning
              data-tooltip="Back to Dashboard"
              aria-label="Back to Dashboard"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className={styles.title}>Lexpal AI</h1>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Legal Assistant
            </span>
          </div>

          {/* Spacer for centering */}
          <div style={{ width: 36 }}></div>
        </div>

        <div
          className={styles.chatArea}
          ref={chatAreaRef}
          onScroll={handleScroll}
        >
          <div className={styles.messageWrapper}>
            {connectionError && (
              <div className={styles.errorMessage}>
                {connectionError}
              </div>
            )}

            {hasMore && isFetching && (
              <div className={styles.loading}>Loading older messages…</div>
            )}

            {messages.length === 0 && !isFetching && (
              <div className={styles.aiMessage} style={{ alignSelf: 'center', textAlign: 'center', background: 'transparent', color: 'var(--text-secondary)', boxShadow: 'none' }}>
                <div style={{ marginBottom: 16 }}>
                  <Sparkles size={48} strokeWidth={1} style={{ opacity: 0.2 }} />
                </div>
                <p>Hello! I am Lexpal AI.</p>
                <p style={{ fontSize: '0.9em', opacity: 0.8 }}>Select context or start typing to begin.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.sender === "User"
                    ? (editingMessageIndex === i ? styles.userMessageEditing : styles.userMessageWrapper)
                    : styles.aiMessage
                }
              >
                {/* Logic for showing attached context if present */}
                {msg.attachedContext && msg.attachedContext.length > 0 && (
                  <div className={styles.attachedContextDisplay}>
                    {msg.attachedContext.map((c, idx) => (
                      <div key={idx} className={styles.contextChipStatic}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                          {c.type === 'chat' ? 'chat_bubble' : 'description'}
                        </span>
                        <span>{c.type === 'chat' ? 'Chat' : 'File'}: {c.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.sender === "AI" ? (
                  <div className={styles.markdownContent}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    <div className={styles.actionToolbar}>
                      <button className={styles.actionToolbarBtn} data-tooltip="Copy" aria-label="Copy" onClick={() => navigator.clipboard.writeText(msg.content)}>
                        <Copy size={18} />
                      </button>
                      <button className={styles.actionToolbarBtn} data-tooltip="Try Again" aria-label="Try Again" onClick={handleRegenerate}>
                        <RotateCw size={18} />
                      </button>
                      <button className={styles.actionToolbarBtn} data-tooltip="Share" aria-label="Share" onClick={handleShare}>
                        <Share size={18} />
                      </button>
                      <div style={{ position: 'relative' }}>
                        <button
                          className={styles.actionToolbarBtn}
                          data-tooltip="More Actions"
                          aria-label="More Actions"
                          onClick={(e) => { e.stopPropagation(); setActiveMoreMenuIndex(activeMoreMenuIndex === i ? null : i); }}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {activeMoreMenuIndex === i && (
                          <div className={styles.actionMenuPopover}>
                            <button className={styles.actionMenuItem}>Read Aloud</button>
                            <button className={styles.actionMenuItem}>Bad Response</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ position: 'relative', width: '100%' }}>
                    {editingMessageIndex === i ? (
                      <div className={styles.editContainer}>
                        <textarea
                          ref={editTextAreaRef}
                          className={styles.editTextarea}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className={styles.editButtonRow}>
                          <button className={styles.cancelBtn} onClick={cancelEdit}>Cancel</button>
                          <button className={styles.saveBtn} onClick={handleSaveEdit}>Send</button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.userContentGroup}>
                        <div className={styles.userMessageBubble} style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                        <div className={styles.userMsgActions}>
                          <button className={styles.userActionBtn} onClick={() => navigator.clipboard.writeText(msg.content)} data-tooltip="Copy" aria-label="Copy">
                            <Copy size={13} />
                          </button>
                          <button className={styles.userActionBtn} onClick={() => handleEditClick(i, msg.content)} data-tooltip="Edit" aria-label="Edit">
                            <Pencil size={13} />
                          </button>

                          {/* Version Controller */}
                          {msg.versions && msg.versions.length > 1 && typeof msg.currentVersion === 'number' && (
                            <div className={styles.versionController}>
                              <button
                                className={styles.versionBtn}
                                onClick={() => handleSwitchVersion(i, 'prev')}
                                disabled={msg.currentVersion === 0}
                              >
                                <ChevronLeft size={14} />
                              </button>
                              <span className={styles.versionText}>
                                {msg.currentVersion + 1} / {msg.versions.length}
                              </span>
                              <button
                                className={styles.versionBtn}
                                onClick={() => handleSwitchVersion(i, 'next')}
                                disabled={msg.currentVersion === msg.versions.length - 1}
                              >
                                <ChevronRight size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className={styles.aiMessage}>
                <TextShimmer
                  className="text-sm opacity-70"
                  duration={1}
                >
                  Thinking…
                </TextShimmer>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className={styles.inputArea}>
          <ChatInput
            onSendMessage={sendMessage}
            onStop={handleStop}
            isProcessing={isProcessing}
            disabled={!socketReady && !isProcessing}
          />
        </div>
      </section>
    </main>
  );
};

export default MainChatPage;