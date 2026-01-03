// lib/chat.api.ts

export interface UserProfile {
  _id: string;
  first_name: string;
  last_name: string;
  profile_pic: string|null;
}

export interface ChatMessage {
  _id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  createdAt: string;
  delivered_at?: string | null;
  read_at?: string | null;
}

const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL  || "http://localhost:5001";
/* ─────────────────────────────────────────────
   HTTP FETCHERS
   ───────────────────────────────────────────── */

export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(`${server_url}/api/user/chat/profile/${userId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export async function fetchChatHistory(
  receiverId: string,
  cursor?: string
) {
  const url = cursor
    ? `${server_url}/api/user/chat/history/${receiverId}?cursor=${cursor}`
    : `${server_url}/api/user/chat/history/${receiverId}`;

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

/* ─────────────────────────────────────────────
   WS HELPERS
   ───────────────────────────────────────────── */

export function createChatSocket(receiverId: string): WebSocket {
  // If server_url is http://139.59.25.145/lexpal-server
  // We want ws://139.59.25.145/lexpal-server/ws/user-chat
  
  const wsUrl = server_url
    .replace(/^http/, 'ws')  // Convert protocol
    + '/ws/user-chat?receiver_id=' + receiverId;
  
  console.log('🔗 Creating WebSocket:', wsUrl);
  
  return new WebSocket(wsUrl);
}