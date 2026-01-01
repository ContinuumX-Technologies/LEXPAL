"use client";

import { useEffect, useRef, useState } from "react";
import HistoryDrawer from "../HistoryDrawer";
import styles from "./page.module.css";
import { useParams } from "next/navigation";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";

type ChatMessage = {
  sender: "AI" | "User";
  content: string;
  createdAt?: string;
};

const MainChatPage = () => {
  const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL;

  const params = useParams();

  const convoIdFromParams =
    typeof params.convoId === "string"
      ? params.convoId === "null"
        ? null
        : params.convoId
      : null;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ─────────────────────────────────────────────
     SYNC URL PARAM → STATE
     ───────────────────────────────────────────── */
  useEffect(() => {
    setCurrentConvoId(convoIdFromParams);
  }, [convoIdFromParams]);

  /* ─────────────────────────────────────────────
     SOCKET + HISTORY EFFECT - FIXED VERSION
     ───────────────────────────────────────────── */
  useEffect(() => {
    // Clear previous state
    setMessages([]);
    setCursor(null);
    setHasMore(true);
    setSocketReady(false);
    setConnectionError(null);

    let isMounted = true;
    let reconnectTimeout: NodeJS.Timeout;

    const loadInitialHistory = async () => {
      if (!currentConvoId||currentConvoId=="new") return;

      setIsFetching(true);

      try {
        const res = await fetch(
          `${server_url}/api/AI/convo-history/${currentConvoId}`,
          { credentials: "include" }
        );

        if (!res.ok || !isMounted) {
          setIsFetching(false);
          return;
        }

        const data = await res.json();

        if (isMounted) {
          setMessages(data.messages);
          setCursor(data.nextCursor);
          setHasMore(data.hasMore);
          setIsFetching(false);
        }
      } catch (error) {
        console.log("Failed to load history:", error);
        if (isMounted) setIsFetching(false);
      }
    };

    const connectWebSocket = () => {
      // Close existing socket
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      // Remove protocol (http:// or https://) from server_url
      const serverHost = server_url?.replace(/^https?:\/\//, '') || 'localhost:5001';
      
      // Determine protocol (ws:// or wss://) based on server_url
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
            setMessages((prev) => [
              ...prev,
              { sender: "AI", content: payload.content },
            ]);
            setIsProcessing(false);
          }
        } catch (error) {
          console.log('Error parsing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.log('WebSocket error:', error);
        if (isMounted) {
          setConnectionError('Connection error. Attempting to reconnect...');
          setSocketReady(false);
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        if (!isMounted) return;
        
        setSocketReady(false);
        
        // Don't attempt reconnect if component is unmounting or we intentionally closed it
        if (isMounted && event.code !== 1000) {
          // Attempt reconnect after 3 seconds
          reconnectTimeout = setTimeout(() => {
            if (isMounted) {
              console.log('Attempting to reconnect...');
              connectWebSocket();
            }
          }, 3000);
        }
      };
    };

    // Load history and connect WebSocket
    if (currentConvoId) {
      loadInitialHistory();
    }
    
    connectWebSocket();

    return () => {
      isMounted = false;
      
      // Clear any pending reconnect
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      
      // Clean up WebSocket
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounting");
        socketRef.current = null;
      }
    };
  }, [currentConvoId, server_url]);

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

      setMessages((prev) => [...data.messages, ...prev]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
      setIsFetching(false);
    } catch (error) {
      console.log('Error loading more messages:', error);
      setIsFetching(false);
    }
  };

  /* ─────────────────────────────────────────────
     SEND MESSAGE
     ───────────────────────────────────────────── */
  const sendMessage = () => {
    if (
      !input.trim() ||
      !socketRef.current ||
      !socketReady ||
      isProcessing
    )
      return;

    try {
      setMessages((prev) => [
        ...prev,
        { sender: "User", content: input },
      ]);

      setIsProcessing(true);
      socketRef.current.send(JSON.stringify({ content: input }));
      setInput("");
    } catch (error) {
      console.log('Error sending message:', error);
      setIsProcessing(false);
    }
  };

  /* ─────────────────────────────────────────────
     DRAWER
     ───────────────────────────────────────────── */
  const handleSelectConversation = (convoId: string) => {
    setDrawerOpen(false);
    setCurrentConvoId(convoId);
  };

  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <section className={styles.chatInterface}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <button
                className={styles.iconButton}
                onClick={() => window.history.back()}
              >
                <span className="material-symbols-outlined">
                  arrow_back
                </span>
              </button>
              <button
                className={styles.iconButton}
                onClick={() => setDrawerOpen(true)}
              >
                <span className="material-symbols-outlined">
                  history
                </span>
              </button>
            </div>
            <h1 className={styles.title}>Lexpal AI</h1>
          </div>

          <HistoryDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onSelectConversation={handleSelectConversation}
          />

          <div
            className={styles.chatArea}
            ref={chatAreaRef}
            onScroll={handleScroll}
          >
            {connectionError && (
              <div className={styles.errorMessage}>
                {connectionError}
              </div>
            )}

            {hasMore && isFetching && (
              <div className={styles.loading}>Loading older messages…</div>
            )}

            {messages.length === 0 && !isFetching && (
              <div className={styles.aiMessage}>
                Hello! I am Lexpal AI. How can I assist you today?
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.sender === "User"
                    ? styles.userMessage
                    : styles.aiMessage
                }
              >
                {msg.content}
              </div>
            ))}

            {isProcessing && (
              <div className={styles.aiMessage}>
                <TextShimmer
                  className="font-mono text-sm opacity-70"
                  duration={1}
                >
                  Thinking…
                </TextShimmer>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </section>
      </main>

      <div className={styles.inputArea}>
        {connectionError && (
          <div className={styles.connectionWarning}>
            ⚠️ Connection issues. Messages may not send.
          </div>
        )}
        
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder={
              !socketReady 
                ? "Connecting..." 
                : "Type your prompt..."
            }
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && socketReady && !isProcessing) {
                sendMessage();
              }
            }}
            disabled={!socketReady || isProcessing}
          />

          <button
            className={styles.sendButton}
            onClick={sendMessage}
            disabled={!socketReady || isProcessing || !input.trim()}
          >
            <span className="material-symbols-outlined ">
              arrow_upward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainChatPage;