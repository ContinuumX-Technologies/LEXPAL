import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, SafeAreaView, Share, Alert, TouchableWithoutFeedback, Dimensions, Animated, Easing, Keyboard } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Sparkles, Copy, RotateCw, PanelLeft, SquarePen, X, Share as ShareIcon, MoreHorizontal, Pencil, Clipboard as ClipboardIcon, Trash2, LayoutGrid, Sun, Moon, Check, PanelLeftClose } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { AIService } from '../../services/ai';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import Markdown from 'react-native-markdown-display';
import * as SecureStore from 'expo-secure-store';
import api from '../../services/api';

interface ChatMessage {
    id?: string;
    sender: 'AI' | 'User';
    content: string;
}

interface Conversation {
    _id: string;
    title: string;
    updatedAt: string;
}

// Sub-component to handle measurement safely and animations
interface MessageItemProps {
    item: ChatMessage;
    index: number;
    onLongPress: (index: number, layout: any) => void;
    handleCopy: (content: string) => void;
    handleRegenerate: (index: number) => void;
    handleShare: (content: string) => void;
    activeMoreMenuIndex: number | null;
    setActiveMoreMenuIndex: (index: number | null) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ item, index, onLongPress, handleCopy, handleRegenerate, handleShare, activeMoreMenuIndex, setActiveMoreMenuIndex }) => {
    const { theme } = useTheme();
    const bubbleRef = useRef<View>(null); // Use View ref for measurement
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Markdown Styles
    const mdStyles = {
        body: {
            color: theme === 'dark' ? '#ececec' : '#0d0d0d',
            fontSize: 16,
            lineHeight: 24,
            fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        },
        paragraph: {
            marginBottom: 10,
        },
        code_inline: {
            backgroundColor: theme === 'dark' ? '#333' : '#e5e5e5',
            color: theme === 'dark' ? '#fff' : '#000',
            fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
            borderRadius: 4,
        },
        fence: {
            backgroundColor: theme === 'dark' ? '#171717' : '#f4f4f4',
            borderColor: theme === 'dark' ? '#333' : '#e5e5e5',
            color: theme === 'dark' ? '#ececec' : '#0d0d0d',
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 10,
        },
        heading1: { fontSize: 22, fontWeight: '700', color: theme === 'dark' ? '#fff' : '#000', marginBottom: 10 },
        heading2: { fontSize: 20, fontWeight: '600', color: theme === 'dark' ? '#fff' : '#000', marginBottom: 10 },
        heading3: { fontSize: 18, fontWeight: '600', color: theme === 'dark' ? '#fff' : '#000', marginBottom: 10 },
        list_item: { marginBottom: 6 },
        bullet_list: { marginBottom: 10 },
        ordered_list: { marginBottom: 10 },
        hr: { backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0', height: 1, marginVertical: 15 },
        strong: { fontWeight: '700', color: theme === 'dark' ? '#fff' : '#000' },
        link: { color: '#2563eb', textDecorationLine: 'none' },
    };

    const handleLongPress = async () => {
        if (item.sender === 'User') {
            // Haptic Feedback (Safe)
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch (error) {
                console.warn("Haptics unavailable", error);
            }

            // Pop Animation: Scale down slightly then spring back
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 100,
                    useNativeDriver: true,
                    easing: Easing.ease,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 3,
                    tension: 40,
                    useNativeDriver: true,
                })
            ]).start();

            // Measurement for Menu Position
            bubbleRef.current?.measure((x, y, width, height, pageX, pageY) => {
                onLongPress(index, { top: pageY + height, left: pageX, width, height });
            });
        }
    };

    return (
        <View className={`mb-6 flex-row w-full ${item.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
            {item.sender === 'AI' && (
                <View className="mr-3 mt-1">
                    <View className="w-8 h-8 rounded-full bg-black dark:bg-white items-center justify-center border border-black/10 dark:border-white/10">
                        <Sparkles size={16} color={theme === 'dark' ? "black" : "white"} />
                    </View>
                </View>
            )}

            <TouchableWithoutFeedback onLongPress={handleLongPress} >
                <Animated.View
                    ref={bubbleRef}
                    style={{ transform: [{ scale: scaleAnim }] }}
                    className={`max-w-[85%] ${item.sender === 'User'
                        ? 'bg-[#f4f4f4] dark:bg-[#2f2f2f] rounded-[24px] px-5 py-3'
                        : 'bg-transparent px-0 py-0'
                        }`}
                >
                    {item.sender === 'User' ? (
                        <Text
                            className={`text-[16px] leading-[24px] text-[#0d0d0d] dark:text-[#ececec]`}
                            style={{ fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto' }}
                        >
                            {item.content}
                        </Text>
                    ) : (
                        <View className="w-full">
                            <Markdown style={mdStyles as any}>
                                {item.content}
                            </Markdown>
                        </View>
                    )}

                    {item.sender === 'AI' && (
                        <View className="flex-row items-center gap-1 mt-2 opacity-60 relative z-20">
                            <TouchableOpacity onPress={() => handleCopy(item.content)} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Copy size={16} color={theme === 'dark' ? "#9ca3af" : "#666"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleRegenerate(index)} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RotateCw size={16} color={theme === 'dark' ? "#9ca3af" : "#666"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleShare(item.content)} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ShareIcon size={16} color={theme === 'dark' ? "#9ca3af" : "#666"} />
                            </TouchableOpacity>

                            <View>
                                <TouchableOpacity
                                    onPress={() => setActiveMoreMenuIndex(activeMoreMenuIndex === index ? null : index)}
                                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <MoreHorizontal size={16} color={theme === 'dark' ? "#9ca3af" : "#666"} />
                                </TouchableOpacity>

                                {activeMoreMenuIndex === index && (
                                    <View className="absolute top-8 left-0 bg-white rounded-lg shadow-lg border border-gray-100 p-1 min-w-[140px] z-50">
                                        <TouchableOpacity onPress={() => setActiveMoreMenuIndex(null)} className="flex-row items-center p-2 rounded hover:bg-gray-50">
                                            <Text className="text-sm text-slate-700">Read Aloud</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setActiveMoreMenuIndex(null)} className="flex-row items-center p-2 rounded hover:bg-gray-50">
                                            <Text className="text-sm text-slate-700">Bad Response</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
};

// Helper for date grouping
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

export default function AIChatScreen() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [socketReady, setSocketReady] = useState(false);
    const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
    const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
    const [activeMoreMenuIndex, setActiveMoreMenuIndex] = useState<number | null>(null);

    // Keyboard Visibility for Layout Adjustment
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);


    // Sidebar State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const userName = user?.firstName || user?.name || "Client";
    const userInitials = userName.charAt(0).toUpperCase();

    // User Message Long Press Menu
    const [selectedUserMsgIndex, setSelectedUserMsgIndex] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    // History Modal
    const [historyVisible, setHistoryVisible] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    // Grouping Logic
    const groupedConversations = React.useMemo(() => {
        const groups: Record<string, Conversation[]> = {};
        const sorted = [...conversations].sort((a, b) => {
            // Handle missing updatedAt by defaulting to now or 0
            const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return timeB - timeA;
        });

        sorted.forEach(convo => {
            const label = getRelativeDateLabel(convo.updatedAt || new Date());
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

    const socketRef = useRef<WebSocket | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);
    const pulseAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        if (isProcessing) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true })
                ])
            ).start();
        } else {
            pulseAnim.setValue(0.4);
        }
    }, [isProcessing]);

    const handleShare = async (content: string) => {
        try {
            await Share.share({
                message: content,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleCopy = async (content: string) => {
        await Clipboard.setStringAsync(content);
        setSelectedUserMsgIndex(null); // Close menu if open
    };

    const handleEditUserMessage = (index: number) => {
        const msg = messages[index];
        if (!msg) return;

        // 1. Set input to the message content
        setInput(msg.content);

        // 2. Set editing mode
        setEditingMessageIndex(index);

        // 3. Focus input
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);

        // 4. Close menu
        setSelectedUserMsgIndex(null);
    };

    const handleRegenerate = async (index?: number) => {
        if (isProcessing) return;

        let targetUserMsgIndex = -1;

        if (typeof index === 'number') {
            if (messages[index] && messages[index].sender === 'AI') {
                for (let i = index - 1; i >= 0; i--) {
                    if (messages[i].sender === 'User') {
                        targetUserMsgIndex = i;
                        break;
                    }
                }
            }
        } else {
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].sender === "User") {
                    targetUserMsgIndex = i;
                    break;
                }
            }
        }

        if (targetUserMsgIndex !== -1) {
            const targetUserMsg = messages[targetUserMsgIndex];
            setMessages(prev => prev.slice(0, targetUserMsgIndex + 1));
            setIsProcessing(true);

            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                const payload = { content: targetUserMsg.content };
                socketRef.current.send(JSON.stringify(payload));
            } else {
                console.warn("Socket not ready, attempting to reconnect or wait...");
            }
        }
    };

    // WebSocket and Data Loading ...
    // WebSocket and Data Loading ...
    useEffect(() => {
        if (!user) return;

        let ws: WebSocket | null = null;
        let shouldReconnect = true;

        const connectWS = async () => {
            try {
                const token = await SecureStore.getItemAsync('auth_token');

                // Get Base URL dynamically
                let baseURL = api.defaults.baseURL || "http://192.168.29.2:5001";
                // Ensure no trailing slash
                baseURL = baseURL.replace(/\/$/, "");

                const wsBase = baseURL.replace(/^http/, 'ws');
                const wsUrl = `${wsBase}/ws/ai-chat?convo_id=${currentConvoId || 'new'}&token=${token}`;

                console.log("Connecting AI WS:", wsUrl);
                ws = new WebSocket(wsUrl);
                socketRef.current = ws;

                ws.onopen = () => {
                    console.log("AI WS Connected");
                    setSocketReady(true);
                };

                ws.onmessage = (e) => {
                    try {
                        const payload = JSON.parse(e.data);
                        if (payload.type === 'ai_message') {
                            setMessages(prev => [...prev, { sender: 'AI', content: payload.content }]);
                            setIsProcessing(false);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                    } catch (err) {
                        console.error("WS Parse Error", err);
                    }
                };

                ws.onclose = (e) => {
                    console.log("AI WS Closed", e.code, e.reason);
                    setSocketReady(false);
                    // Simple reconnect logic if needed, but for now just log
                    // if (shouldReconnect && ![1000, 1008].includes(e.code)) {
                    //     setTimeout(connectWS, 3000); 
                    // }
                };

                ws.onerror = (e) => {
                    console.log("AI WS Error", e);
                };

            } catch (err) {
                console.error("Setup WS Failed", err);
            }
        };

        connectWS();

        return () => {
            shouldReconnect = false;
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [currentConvoId, user]);

    useEffect(() => {
        if (currentConvoId) {
            loadHistory(currentConvoId);
        } else {
            // Only clear if explicitly setting to null (new chat), not on mount if we want to persist previous state (though logic above suggests we typically want fresh state for new)
            // setMessages([]); 
            // Actually, if we switch convo, we should clear. 
            // Check logic: startNewChat sets null. selectConversation sets ID.
            if (messages.length > 0 && messages[0].sender === 'AI') {
                // Keep if we just got a message? No, loadHistory will overwrite.
            }
            setMessages([]);
        }
    }, [currentConvoId]);

    const loadHistory = async (id: string) => {
        setIsProcessing(true);
        try {
            const res = await AIService.getConversationHistory(id);
            if (res.data?.messages) {
                setMessages(res.data.messages);
            }
        } catch (e) {
            console.error("Failed to load history", e);
        } finally {
            setIsProcessing(false);
        }
    };

    const loadConversations = async () => {
        try {
            const res = await AIService.getRecentConversations();
            if (res.data?.conversations) {
                setConversations(res.data.conversations);
            }
        } catch (e) {
            console.error("Failed to load conversations", e);
        }
    };

    const sendMessage = () => {
        if (!input.trim()) return;

        if (!socketReady) {
            Alert.alert("Connection Error", "Not connected to AI service. Please check your internet or try again.");
            return;
        }

        const text = input.trim();

        if (editingMessageIndex !== null) {
            // Editing Mode: truncate logic
            setMessages(prev => [
                ...prev.slice(0, editingMessageIndex),
                { sender: 'User', content: text }
            ]);
            setEditingMessageIndex(null);
        } else {
            // Normal Mode
            setMessages(prev => [...prev, { sender: 'User', content: text }]);
        }

        setInput('');
        setIsProcessing(true);

        const payload = { content: text };
        socketRef.current?.send(JSON.stringify(payload));
    };

    const openHistory = () => {
        setHistoryVisible(true);
        loadConversations();
    };

    const selectConversation = (id: string) => {
        setCurrentConvoId(id);
        setHistoryVisible(false);
    };

    const startNewChat = () => {
        setCurrentConvoId(null);
        setMessages([]);
        setHistoryVisible(false);
    };

    // Measurement Handler
    const handleBubbleLongPress = (index: number, layout: any) => {
        setSelectedUserMsgIndex(index);
        setMenuPosition(layout);
    };

    const handleMenuOpen = (id: string) => {
        if (activeMenuId === id) {
            setActiveMenuId(null);
        } else {
            setActiveMenuId(id);
        }
    };

    const handleStartRename = (convo: Conversation) => {
        setRenamingId(convo._id);
        setRenameValue(convo.title || "Untitled Chat");
        setActiveMenuId(null);
    };

    const handleSubmitRename = async () => {
        if (!renamingId) return;

        // Optimistic update
        setConversations(prev => prev.map(c =>
            c._id === renamingId ? { ...c, title: renameValue } : c
        ));

        try {
            await AIService.renameConversation(renamingId, renameValue);
        } catch (err) {
            console.error("Rename failed", err);
            loadConversations(); // Revert
        }
        setRenamingId(null);
    };

    const handleStartDelete = (id: string) => {
        setDeletingId(id);
        setActiveMenuId(null);
    };

    const confirmDelete = async (id: string) => {
        setDeletingId(null);

        setConversations(prev => prev.filter(c => c._id !== id));

        try {
            await AIService.deleteConversation(id);
            if (currentConvoId === id) {
                startNewChat();
            }
        } catch (err) {
            console.error("Failed to delete", err);
            loadConversations();
        }
    };

    const handleCancelEdit = () => {
        setInput('');
        setEditingMessageIndex(null);
        Keyboard.dismiss();
    };

    // Filter messages if editing: hide the message being edited and all after it
    const displayedMessages = editingMessageIndex !== null
        ? messages.slice(0, editingMessageIndex)
        : messages;

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-[#212121]">
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-2 bg-white/80 dark:bg-[#212121]/95 border-b border-gray-100 dark:border-white/5 z-10">
                <TouchableOpacity onPress={openHistory} className="p-2">
                    <PanelLeft size={24} color={theme === 'dark' ? "white" : "#666"} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="font-semibold text-base text-slate-900 dark:text-white">Lexpal AI</Text>
                    <Text className="text-[10px] text-gray-400 uppercase tracking-widest">Legal Assistant</Text>
                </View>
                <View className="w-10" />
            </View>

            {/* Chat Area */}
            <FlatList
                ref={flatListRef}
                data={displayedMessages}
                keyExtractor={(_, i) => i.toString()}
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                renderItem={({ item, index }) => (
                    <MessageItem
                        item={item}
                        index={index}
                        onLongPress={handleBubbleLongPress}
                        handleCopy={handleCopy}
                        handleRegenerate={handleRegenerate}
                        handleShare={handleShare}
                        activeMoreMenuIndex={activeMoreMenuIndex}
                        setActiveMoreMenuIndex={setActiveMoreMenuIndex}
                    />
                )}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center pt-12">
                        <View className="w-12 h-12 bg-black dark:bg-white rounded-full items-center justify-center mb-12 shadow-sm">
                            <Sparkles size={24} color={theme === 'dark' ? "black" : "white"} strokeWidth={1.5} />
                        </View>

                        <View className="w-full flex-row flex-wrap justify-between gap-y-3">
                            {[
                                { label: "Summarize contract", sub: "Analyze key terms", icon: "description", text: "Please summarize this contract and highlight any risky clauses." },
                                { label: "Find a lawyer", sub: "For property dispute", icon: "person-search", text: "I need to find a lawyer specializing in property disputes." },
                                { label: "Draft agreement", sub: "Rental or NDA", icon: "edit", text: "Help me draft a standard rental agreement." },
                                { label: "Legal rights", sub: "Tenant laws", icon: "gavel", text: "What are my rights as a tenant regarding eviction?" }
                            ].map((s, i) => (
                                <TouchableOpacity
                                    key={i}
                                    className="w-[48%] bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-white/5 rounded-2xl p-4 h-28 justify-between active:bg-gray-50 dark:active:bg-[#383838]"
                                    onPress={() => setInput(s.text)}
                                >
                                    <View>
                                        <Text className="text-[13px] font-semibold text-slate-800 dark:text-[#ececec] mb-0.5">{s.label}</Text>
                                        <Text className="text-[11px] text-slate-500 dark:text-gray-400 leading-3">{s.sub}</Text>
                                    </View>
                                    <View className="self-end bg-gray-50 dark:bg-white/5 p-1.5 rounded-full">
                                        <MaterialIcons name={s.icon as any} size={16} color={theme === 'dark' ? "#ececec" : "#666"} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                }
                ListFooterComponent={
                    isProcessing ? (
                        <View className="flex-row items-center mb-4 mt-2">
                            <View className="mr-3 mt-1">
                                <View className="w-8 h-8 rounded-full bg-black dark:bg-white items-center justify-center border border-black/10 dark:border-white/10">
                                    <Sparkles size={16} color={theme === 'dark' ? "black" : "white"} />
                                </View>
                            </View>
                            <Animated.View
                                style={{ opacity: pulseAnim }}
                                className="w-3 h-3 rounded-full bg-[#0d0d0d] dark:bg-[#ececec] mt-1"
                            />
                        </View>
                    ) : null
                }
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                className={`bg-white dark:bg-[#212121] px-4 pt-2 ${isKeyboardVisible ? 'pb-2' : 'pb-6'}`}
                style={{ marginBottom: isKeyboardVisible ? 0 : (Platform.OS === 'ios' ? 70 : 50) }}
            >
                <View className="bg-[#f4f4f4] dark:bg-[#2f2f2f] flex-row items-end rounded-[26px] pl-4 pr-2 py-2 min-h-[52px] border border-transparent focus:border-gray-200 dark:focus:border-gray-700">
                    <TouchableOpacity className="p-2 mr-1" disabled={isProcessing}>
                        <MaterialIcons name="add-circle-outline" size={24} color={theme === 'dark' ? "#9ca3af" : "#666"} />
                    </TouchableOpacity>

                    <View className="flex-1">
                        {editingMessageIndex !== null && (
                            <View className="bg-white rounded-full px-4 py-2 mb-2 self-start flex-row items-center gap-2 shadow-sm border border-gray-100">
                                <SquarePen size={16} color="#3b82f6" />
                                <Text className="text-[#3b82f6] text-sm font-semibold">Edit</Text>
                                <TouchableOpacity onPress={handleCancelEdit} className="ml-2 bg-gray-100 rounded-full p-0.5">
                                    <X size={14} color="#666" />
                                </TouchableOpacity>
                            </View>
                        )}
                        <TextInput
                            ref={inputRef}
                            className="text-[16px] text-slate-900 dark:text-[#ececec] leading-5 max-h-32 pt-[10px] pb-[10px]"
                            placeholder="Message Lexpal AI"
                            placeholderTextColor={theme === 'dark' ? "#666" : "#999"}
                            multiline
                            value={input}
                            onChangeText={setInput}
                            editable={!isProcessing}
                            style={{ fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto' }}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={sendMessage}
                        disabled={!input.trim() || isProcessing}
                        className={`w-8 h-8 rounded-full items-center justify-center mb-1 ml-2 ${input.trim() && !isProcessing ? 'bg-black' : 'bg-[#e5e5e5]'
                            }`}
                    >
                        {isProcessing ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <MaterialIcons name="arrow-upward" size={20} color={input.trim() ? "white" : "#b4b4b4"} />
                        )}
                    </TouchableOpacity>
                </View>
                <Text className="text-center text-[11px] text-gray-400 mt-3">
                    Lexpal AI can make mistakes. Check important info.
                </Text>
            </KeyboardAvoidingView>

            {/* Sidebar (Replicated from Web) */}
            <Modal visible={historyVisible} animationType="fade" transparent onRequestClose={() => setHistoryVisible(false)}>
                <View className="flex-1 flex-row">
                    {/* Sidebar Container */}
                    <View className="w-[85%] bg-[#F9F9F9] dark:bg-[#171717] h-full flex-col border-r border-[#0000000d] dark:border-white/10">
                        <SafeAreaView className="flex-1">
                            {/* Header */}
                            <View className="px-3 pt-3 pb-2 flex-row items-center justify-between z-20">
                                <TouchableOpacity onPress={() => setHistoryVisible(false)} className="w-10 h-10 items-center justify-center rounded-lg active:bg-black/5 dark:active:bg-white/10">
                                    <PanelLeftClose size={20} color={theme === 'dark' ? "#9ca3af" : "#666"} />
                                </TouchableOpacity>
                                <View className="flex-1" />
                                <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-lg active:bg-black/5 mr-1">
                                    <Sun size={20} color="#666" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={startNewChat} className="w-10 h-10 items-center justify-center rounded-lg active:bg-black/5">
                                    <SquarePen size={20} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Nav Links */}
                            <View className="px-3 mb-5 gap-1">
                                <TouchableOpacity onPress={startNewChat} className={`flex-row items-center gap-3 px-3 py-2.5 rounded-lg ${!currentConvoId ? 'bg-black/5 dark:bg-white/10 font-medium' : 'active:bg-black/5 dark:active:bg-white/5'}`}>
                                    <View className="w-6 h-6 rounded-full bg-black dark:bg-white items-center justify-center">
                                        <Sparkles size={12} color={theme === 'dark' ? "black" : "white"} />
                                    </View>
                                    <Text className="text-sm text-[#0d0d0d] dark:text-[#ececec]">Lexpal AI</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-row items-center gap-3 px-3 py-2.5 rounded-lg active:bg-black/5 dark:active:bg-white/5">
                                    <View className="w-6 h-6 items-center justify-center">
                                        <LayoutGrid size={18} color={theme === 'dark' ? "#ececec" : "#0d0d0d"} />
                                    </View>
                                    <Text className="text-sm text-[#0d0d0d] dark:text-[#ececec]">Explore GPTs</Text>
                                </TouchableOpacity>
                            </View>

                            {/* History List */}
                            <FlatList
                                data={groupedConversations}
                                keyExtractor={(item) => item.label}
                                className="flex-1 px-3"
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item: group }) => (
                                    <View className="mb-2">
                                        <Text className="text-xs font-semibold text-[#666] ml-2 mt-4 mb-2">{group.label}</Text>
                                        {group.items.map(convo => {
                                            const isActive = currentConvoId === convo._id;
                                            const isRenaming = renamingId === convo._id;
                                            const isDeleting = deletingId === convo._id;
                                            const isMenuOpen = activeMenuId === convo._id;

                                            return (
                                                <View key={convo._id} className="mb-0.5 relative">
                                                    {isDeleting ? (
                                                        <View className="absolute inset-0 bg-[#e5e5e5] rounded-lg flex-row items-center justify-end pr-2 gap-2 z-10 w-full h-full">
                                                            <Text className="text-xs text-gray-700 mr-1">Delete?</Text>
                                                            <TouchableOpacity onPress={() => confirmDelete(convo._id)} className="p-1">
                                                                <Check size={16} color="#666" />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => setDeletingId(null)} className="p-1">
                                                                <X size={16} color="#666" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ) : isRenaming ? (
                                                        <View className="px-3 py-1.5 w-full">
                                                            <TextInput
                                                                className="border border-blue-500/30 rounded px-2 py-1 text-sm text-[#0d0d0d] bg-white"
                                                                value={renameValue}
                                                                onChangeText={setRenameValue}
                                                                onBlur={handleSubmitRename}
                                                                onSubmitEditing={handleSubmitRename}
                                                                autoFocus
                                                            />
                                                        </View>
                                                    ) : (
                                                        <View className="relative w-full">
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    selectConversation(convo._id);
                                                                    // Optional: Close sidebar on select? keeping open for now as per design usually
                                                                }}
                                                                className={`flex-row items-center px-3 py-2 rounded-lg ${isActive ? 'bg-black/10 dark:bg-white/10' : ''}`}
                                                            >
                                                                <Text numberOfLines={1} className="text-sm text-[#0d0d0d] dark:text-[#ececec] flex-1 pr-6 font-normal">
                                                                    {convo.title || "Untitled Conversation"}
                                                                </Text>
                                                            </TouchableOpacity>

                                                            {/* Menu Trigger */}
                                                            <TouchableOpacity
                                                                onPress={() => handleMenuOpen(convo._id)}
                                                                className="absolute right-2 top-2 p-1 opacity-60 active:opacity-100"
                                                            >
                                                                <MoreHorizontal size={16} color="#666" />
                                                            </TouchableOpacity>

                                                            {/* Dropdown Menu */}
                                                            {isMenuOpen && (
                                                                <View className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-black/5 p-1.5 z-50 w-44">
                                                                    <TouchableOpacity onPress={() => { /* Share logic */ setActiveMenuId(null); }} className="flex-row items-center gap-2 p-2 rounded hover:bg-gray-100">
                                                                        <ShareIcon size={14} color="#333" />
                                                                        <Text className="text-[13px] text-[#333]">Share</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => handleStartRename(convo)} className="flex-row items-center gap-2 p-2 rounded hover:bg-gray-100">
                                                                        <Pencil size={14} color="#333" />
                                                                        <Text className="text-[13px] text-[#333]">Rename</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => { /* Archive logic */ setActiveMenuId(null); }} className="flex-row items-center gap-2 p-2 rounded hover:bg-gray-100">
                                                                        <View className="w-3.5 h-3.5 border border-[#333] rounded-sm" />
                                                                        <Text className="text-[13px] text-[#333]">Archive</Text>
                                                                    </TouchableOpacity>
                                                                    <View className="h-[1px] bg-black/5 my-1" />
                                                                    <TouchableOpacity onPress={() => handleStartDelete(convo._id)} className="flex-row items-center gap-2 p-2 rounded hover:bg-red-50">
                                                                        <Trash2 size={14} color="#ff4d4d" />
                                                                        <Text className="text-[13px] text-[#ff4d4d]">Delete</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )}
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            />

                            {/* Footer */}
                            <View className="p-3 border-t border-[#0000000d] dark:border-white/10">
                                <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-lg active:bg-black/5 dark:active:bg-white/5">
                                    <View className="w-8 h-8 rounded-full bg-[#ccc] items-center justify-center">
                                        <Text className="text-white text-xs font-semibold">{userInitials}</Text>
                                    </View>
                                    <Text className="text-sm font-medium text-[#0d0d0d] dark:text-[#ececec] flex-1">{userName}</Text>
                                    <View className="bg-[#e0e0e0] dark:bg-white/10 px-1.5 py-0.5 rounded">
                                        <Text className="text-[10px] font-semibold text-black dark:text-white">PLUS</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </View>

                    {/* Overlay */}
                    <TouchableOpacity
                        className="flex-1 bg-black/30"
                        onPress={() => setHistoryVisible(false)}
                        activeOpacity={1}
                    />
                </View>
            </Modal>

            {/* Context Menu (Glassmorphic) */}
            <Modal visible={selectedUserMsgIndex !== null} animationType="fade" transparent>
                <TouchableOpacity
                    className="flex-1 bg-black/10"
                    activeOpacity={1}
                    onPress={() => setSelectedUserMsgIndex(null)}
                >
                    {menuPosition && (
                        <View
                            style={{
                                position: 'absolute',
                                top: menuPosition.top + 10, // Just below the bubble's bottom edge (pageY + height)
                                left: Math.max(20, Math.min(Dimensions.get('window').width - 180, menuPosition.left + menuPosition.width - 160)), // Align right edge or clamp
                            }}
                        >
                            <BlurView intensity={80} tint="dark" style={{ borderRadius: 16, overflow: 'hidden', width: 160 }}>
                                <View className="bg-black/50">
                                    <TouchableOpacity
                                        onPress={() => selectedUserMsgIndex !== null && handleCopy(messages[selectedUserMsgIndex].content)}
                                        className="flex-row items-center gap-3 px-4 py-3.5 border-b border-white/10 active:bg-white/10"
                                    >
                                        <Copy size={18} color="white" />
                                        <Text className="text-[16px] text-white font-medium">Copy</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => selectedUserMsgIndex !== null && handleEditUserMessage(selectedUserMsgIndex)}
                                        className="flex-row items-center gap-3 px-4 py-3.5 active:bg-white/10"
                                    >
                                        <Pencil size={18} color="white" />
                                        <Text className="text-[16px] text-white font-medium">Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            </BlurView>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}
