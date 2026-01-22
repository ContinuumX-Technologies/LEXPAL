
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, FlatList, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Send, ArrowLeft, Phone, Video, Paperclip, Camera, Mic } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../../context/ThemeContext';
import { UserService } from '../../../services/user';
import api from '../../../services/api';
import * as SecureStore from 'expo-secure-store';

// --- Interfaces ---
interface Message {
    _id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    createdAt: string;
    delivered_at?: string | null;
    read_at?: string | null;
}

// --- WS Helper ---
const getWSUrl = (receiverId: string) => {
    // Dynamically get the base URL from the API config
    const baseURL = api.defaults.baseURL || "http://192.168.29.2:5001";
    const wsBase = baseURL.replace(/^http/, 'ws');
    return `${wsBase}/ws/user-chat?receiver_id=${receiverId}`;
};

const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

export default function UserChatScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { theme } = useTheme();
    const receiverId = Array.isArray(id) ? id[0] : id;

    // --- State ---
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [receiverName, setReceiverName] = useState("Lawyer");
    const [receiverPic, setReceiverPic] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(false);

    const socketRef = useRef<WebSocket | null>(null);
    const flatListRef = useRef<FlatList>(null);

    // --- Init ---
    useEffect(() => {
        if (receiverId) {
            loadChatHistory(receiverId);
            loadReceiverProfile(receiverId);
            setupWebSocket(receiverId);
        }

        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, [receiverId]);

    // --- Data Fetching ---
    const loadChatHistory = async (userId: string) => {
        try {
            const res = await UserService.getChatHistory(userId);
            if (res.data && res.data.messages) {
                setMessages(res.data.messages);
            } else if (Array.isArray(res.data)) {
                setMessages(res.data);
            }
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    const loadReceiverProfile = async (userId: string) => {
        try {
            const res = await UserService.getChatProfile(userId);
            if (res.data) {
                setReceiverName(`${res.data.first_name} ${res.data.last_name}`);
                setReceiverPic(res.data.profile_pic);
            }
        } catch (error) { }
    };

    // --- WebSocket ---
    const setupWebSocket = (userId: string) => {
        if (socketRef.current) socketRef.current.close();

        const wsUrl = getWSUrl(userId);
        console.log("Connecting WS to:", wsUrl);

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WS Connected");
            ws.send(JSON.stringify({ type: "check_online" }));
        };

        ws.onerror = (e) => {
            console.log("WS Error Event:", e);
        };

        ws.onclose = (e) => {
            console.log("WS Closed", e.code, e.reason);
        };

        ws.onmessage = (e) => {
            try {
                const payload = JSON.parse(e.data);
                if (payload.type === "receiver_online") setIsOnline(payload.online);
                if (payload.type === "incoming_message") setMessages(prev => [...prev, payload.message]);
                if (payload.type === "message_delivered" || payload.type === "message_read") {
                    setMessages(prev => prev.map(m => m._id === payload.messageId ? { ...m, ...payload.update } : m));
                }
            } catch (err) { }
        };
    };

    const handleSend = () => {
        if (!input.trim() || !receiverId) return;

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "send_message",
                receiverId: receiverId,
                content: input.trim()
            }));
        } else {
            // Fallback
        }
        setInput("");
    };

    // --- Render Items ---
    const renderItem = ({ item, index }: { item: Message, index: number }) => {
        const isMe = item.sender_id !== receiverId;
        const date = new Date(item.createdAt);

        // Grouping Logic
        const prevMessage = messages[index - 1];
        const nextMessage = messages[index + 1];

        const isSameSenderPrev = prevMessage && prevMessage.sender_id === item.sender_id;
        const isSameSenderNext = nextMessage && nextMessage.sender_id === item.sender_id;

        const showDateHeader = !prevMessage || !isSameDay(new Date(prevMessage.createdAt), date);

        // Styling
        const isFirstInChain = !isSameSenderPrev || showDateHeader;
        const isLastInChain = !isSameSenderNext;

        // Colors
        const sentBubble = theme === 'dark' ? '#0A84FF' : '#007AFF'; // iOS Blue
        const receivedBubble = theme === 'dark' ? '#262628' : '#E9E9EB'; // iOS Gray
        const sentText = '#FFFFFF';
        const receivedText = theme === 'dark' ? '#FFFFFF' : '#000000';

        return (
            <View>
                {/* Date Header */}
                {showDateHeader && (
                    <View className="items-center my-4">
                        <View className="bg-gray-200 dark:bg-gray-800 rounded-full px-3 py-1">
                            <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                {date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                            </Text>
                        </View>
                    </View>
                )}

                <View className={`flex-row w-full px-3 ${isMe ? 'justify-end' : 'justify-start'} ${isFirstInChain ? 'mt-2' : 'mt-0.5'}`}>
                    {!isMe && (
                        <View className="w-8 mr-2 flex-col justify-end">
                            {isLastInChain && (
                                receiverPic ? (
                                    <Image source={{ uri: receiverPic }} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
                                        <Text className="text-[10px] font-bold text-gray-600">{receiverName[0]}</Text>
                                    </View>
                                )
                            )}
                        </View>
                    )}

                    <View
                        style={{
                            backgroundColor: isMe ? sentBubble : receivedBubble,
                            maxWidth: '75%',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderTopLeftRadius: 18,
                            borderTopRightRadius: 18,
                            borderBottomLeftRadius: isMe ? 18 : (isLastInChain ? 4 : 18),
                            borderBottomRightRadius: isMe ? (isLastInChain ? 4 : 18) : 18,
                            marginBottom: isLastInChain ? 2 : 0,
                        }}
                    >
                        <Text style={{ fontSize: 16, color: isMe ? sentText : receivedText, lineHeight: 22 }}>
                            {item.content}
                        </Text>

                        <View className="flex-row items-center justify-end gap-1 mt-1 opacity-70">
                            <Text style={{ fontSize: 10, color: isMe ? 'rgba(255,255,255,0.8)' : (theme === 'dark' ? '#rgba(255,255,255,0.6)' : '#rgba(0,0,0,0.5)') }}>
                                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                            {isMe && (
                                <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)' }}>
                                    {item.read_at ? "✓✓" : item.delivered_at ? "✓✓" : "✓"}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

            {/* Background */}
            <ImageBackground
                source={{ uri: theme === 'dark' ? 'https://assets.whatsapp.net/whatsapp/wallpaper/v2/moon1.jpg' : 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png' }}
                className="absolute inset-0 w-full h-full opacity-30"
            />

            {/* Header */}
            <SafeAreaView edges={['top', 'left', 'right']} style={{ zIndex: 10 }}>
                <BlurView intensity={80} tint={theme === 'dark' ? 'dark' : 'light'} className="bg-white/70 dark:bg-black/70">
                    <View className="flex-row items-center justify-between px-3 py-2 border-b border-gray-200/50 dark:border-white/5 h-[56px]">
                        <View className="flex-row items-center flex-1">
                            <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mr-2">
                                <ArrowLeft size={24} color={theme === 'dark' ? '#FFF' : '#007AFF'} />
                            </TouchableOpacity>

                            <View className="flex-row items-center flex-1">
                                <View className="mr-3 relative">
                                    {receiverPic ? (
                                        <Image source={{ uri: receiverPic }} className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center"><Text>{receiverName[0]}</Text></View>
                                    )}
                                    {isOnline && <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black" />}
                                </View>
                                <View>
                                    <Text className="font-bold text-[16px] text-black dark:text-white">{receiverName}</Text>
                                    <Text className="text-[12px] text-gray-500">{isOnline ? 'Active now' : 'Offline'}</Text>
                                </View>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4 px-2">
                            <TouchableOpacity><Video size={22} color="#007AFF" /></TouchableOpacity>
                            <TouchableOpacity><Phone size={20} color="#007AFF" /></TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </SafeAreaView>

            {/* Chat List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={{ paddingBottom: 20 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input Area */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
                <BlurView intensity={90} tint={theme === 'dark' ? 'dark' : 'light'} className="px-2 py-2 border-t border-gray-200/50 dark:border-white/5">
                    <SafeAreaView edges={['bottom']} className="flex-row items-end pb-1">
                        <TouchableOpacity className="mb-2.5 mx-2">
                            <Paperclip size={22} color="#8E8E93" />
                        </TouchableOpacity>

                        <View className="flex-1 min-h-[40px] bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 mr-2 flex-row items-center">
                            <TextInput
                                value={input}
                                onChangeText={setInput}
                                placeholder="Message"
                                placeholderTextColor="#8E8E93"
                                multiline
                                className="flex-1 text-[16px] max-h-[100px] text-black dark:text-white"
                            />
                            {!input.trim() && (
                                <TouchableOpacity><Camera size={20} color="#8E8E93" /></TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={input.trim() ? handleSend : undefined}
                            className={`w-10 h-10 rounded-full items-center justify-center mb-0.5 ${input.trim() ? 'bg-[#007AFF]' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            {input.trim() ? (
                                <Send size={18} color="white" className="ml-0.5" />
                            ) : (
                                <Mic size={22} color={theme === 'dark' ? '#FFF' : '#000'} />
                            )}
                        </TouchableOpacity>
                    </SafeAreaView>
                </BlurView>
            </KeyboardAvoidingView>
        </View>
    );
}
