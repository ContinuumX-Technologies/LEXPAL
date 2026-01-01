// userId -> Set<socket>
const activeUserSockets = new Map();

export function registerSocket(userId, socket) {
  if (!activeUserSockets.has(userId)) {
    activeUserSockets.set(userId, new Set());
  }
  activeUserSockets.get(userId).add(socket);
}

export function unregisterSocket(userId, socket) {
  const set = activeUserSockets.get(userId);
  if (!set) return;

  set.delete(socket);
  if (set.size === 0) {
    activeUserSockets.delete(userId);
  }
}

export function getUserSockets(userId) {
  return activeUserSockets.get(userId) || null;
}