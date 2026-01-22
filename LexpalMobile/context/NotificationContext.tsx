import React, { createContext, useContext, useEffect, useState } from 'react';
import SocketService from '../services/socket';
import { useAuth } from './AuthContext';
import * as Haptics from 'expo-haptics';

export type Notification = {
    id: string;
    type: 'message' | 'alert' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    data?: any;
    icon?: string;
    color?: string;
};

type NotificationContextType = {
    unreadCount: number;
    notifications: Notification[];
    markAllRead: () => void;
    addNotification: (note: Notification) => void;
};

const NotificationContext = createContext<NotificationContextType>({
    unreadCount: 0,
    notifications: [],
    markAllRead: () => { },
    addNotification: () => { }
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (user) {
            // Connect to socket when user is logged in
            SocketService.connectUserChat();

            // Listen for incoming messages
            const unsubscribe = SocketService.on('incoming_message', (msg: any) => {
                console.log('New Message Received:', msg);

                // Add to notifications
                const newNote: Notification = {
                    id: msg._id || Date.now().toString(),
                    type: 'message',
                    title: 'New Message',
                    message: msg.content,
                    time: 'Just now',
                    read: false,
                    data: msg,
                    icon: 'chat',
                    color: '#10b981'
                };

                setNotifications(prev => [newNote, ...prev]);

                // Haptic feedback
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            });

            return () => {
                unsubscribe();
                SocketService.disconnect();
            };
        }
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const addNotification = (note: Notification) => {
        setNotifications(prev => [note, ...prev]);
    };

    return (
        <NotificationContext.Provider value={{ unreadCount, notifications, markAllRead, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
