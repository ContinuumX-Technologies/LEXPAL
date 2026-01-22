import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import api from './api';

type EventHandler = (data: any) => void;

class SocketService {
    private userSocket: WebSocket | null = null;
    private aiSocket: WebSocket | null = null;
    private listeners: Map<string, Set<EventHandler>> = new Map();

    private getBaseUrl() {
        // Use the configured base URL from api instance, fallback if needed
        let baseUrl = api.defaults.baseURL || 'http://localhost:5001';
        // Remove trailing slash if present
        baseUrl = baseUrl.replace(/\/$/, "");
        // Replace http/https with ws/wss
        return baseUrl.replace(/^http/, 'ws');
    }

    async connectUserChat() {
        if (this.userSocket && (this.userSocket.readyState === WebSocket.OPEN || this.userSocket.readyState === WebSocket.CONNECTING)) {
            console.log('User socket already connected');
            return;
        }

        try {
            const token = await SecureStore.getItemAsync('auth_token');
            if (!token) {
                console.warn('SocketService: No token found');
                return;
            }

            const url = `${this.getBaseUrl()}/ws/user-chat?token=${token}`;
            console.log('Connecting to User Socket:', url);

            this.userSocket = new WebSocket(url);

            this.userSocket.onopen = () => {
                console.log('User Socket Connected');
            };

            this.userSocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.emit(data.type, data);

                    // Specific handler for incoming messages
                    if (data.type === 'incoming_message') {
                        this.emit('incoming_message', data.message);
                    }
                } catch (e) {
                    console.error('Socket message parse error:', e);
                }
            };

            this.userSocket.onerror = (e: any) => {
                // WebSocket error event on RN/browser often doesn't have a message property
                console.error('User Socket Error:', e.message || JSON.stringify(e));
            };

            this.userSocket.onclose = (e) => {
                console.log('User Socket Closed:', e.reason);
                this.userSocket = null;
                // Simple reconnect logic could go here
            };

        } catch (e) {
            console.error('Socket Connection Error:', e);
        }
    }

    // Emit event to local listeners
    private emit(event: string, data: any) {
        if (this.listeners.has(event)) {
            this.listeners.get(event)?.forEach(callback => callback(data));
        }
    }

    // Subscribe to events
    on(event: string, callback: EventHandler) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.get(event)?.delete(callback);
        };
    }

    disconnect() {
        if (this.userSocket) {
            this.userSocket.close();
            this.userSocket = null;
        }
        if (this.aiSocket) {
            this.aiSocket.close();
            this.aiSocket = null;
        }
    }
}

export default new SocketService();
