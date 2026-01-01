// lib/chatList.api.ts

export interface ChatListItem {
  userId: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  online?: boolean; // optional, injected later via WS
}

const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL || "http://localhost:5001";

/**
 * Fetch chat list for logged-in user
 */
export async function fetchChatList(): Promise<ChatListItem[]> {
  const res = await fetch(`${server_url}/api/user/chat/list`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chat list");
  }

  return res.json();
}