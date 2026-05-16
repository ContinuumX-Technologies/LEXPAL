import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Platform, Keyboard, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { LawyerService } from '../../services/lawyer';

const { width } = Dimensions.get('window');

// Mock Data Types
type SearchResult = {
    id: string;
    type: 'lawyer' | 'case' | 'service' | 'chat';
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    image?: string;
};

export default function SearchScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const inputRef = useRef<TextInput>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    // Focus input on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const performSearch = useCallback(async (text: string) => {
        if (!text.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            // Need to fetch from backend. Since getAllLawyers supports pagination/limits, 
            // we assume we can either filter client side or if API supported q=...
            // For now, we fetch a bunch and filter client side as we don't have search endpoint yet.
            const res = await LawyerService.getAllLawyers({ limit: 50 });
            const lawyers = (res.data?.lawyers || []).map((l: any) => ({
                id: l._id,
                type: 'lawyer',
                title: `${l.first_name} ${l.last_name}`,
                subtitle: l.specialities?.[0] || 'Legal Professional',
                icon: 'person',
                color: '#3b82f6',
                image: l.profile_picture
            }));

            // Filter
            const filtered = lawyers.filter((l: any) =>
                l.title.toLowerCase().includes(text.toLowerCase()) ||
                l.subtitle.toLowerCase().includes(text.toLowerCase())
            );

            setResults(filtered);

        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce Search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query.trim()) {
                performSearch(query);
            } else {
                setResults([]);
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [query, performSearch]);


    const recentSearches = ['Corporate Law', 'Divorce Attorney', 'Contract Review', 'Patent Filing'];

    const handleClear = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    return (
        <View className="flex-1 bg-[#F5F5F7] dark:bg-black">

            {/* Background Blur Header */}
            <View className="absolute top-0 left-0 right-0 z-20 overflow-hidden"
                style={{
                    height: Platform.OS === 'ios' ? insets.top + 60 : 100,
                    backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(245,245,247,0.85)'
                }}>
                {Platform.OS === 'ios' && (
                    <BlurView intensity={80} tint={theme === 'dark' ? 'dark' : 'light'} style={{ flex: 1 }} />
                )}
            </View>

            {/* Content Container */}
            <SafeAreaView className="flex-1 z-30" edges={['top']}>

                {/* Search Header */}
                <Animated.View
                    entering={FadeInDown.duration(400).springify()}
                    className="px-5 pt-2 pb-4 flex-row items-center gap-3 z-30"
                >
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss();
                            router.back();
                        }}
                        className="w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm active:scale-95"
                    >
                        <Ionicons name="arrow-back" size={24} color={theme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>

                    <View className="flex-1 flex-row items-center h-12 bg-white dark:bg-[#1C1C1E] rounded-2xl px-4 border border-gray-200/50 dark:border-white/10 shadow-sm">
                        <Ionicons name="search" size={20} color="#94a3b8" />
                        <TextInput
                            ref={inputRef}
                            className="flex-1 ml-3 text-base font-medium text-slate-900 dark:text-white"
                            placeholder="Search lawyers..."
                            placeholderTextColor="#94a3b8"
                            value={query}
                            onChangeText={setQuery}
                            returnKeyType="search"
                        />
                        {query.length > 0 && (
                            <Animated.View entering={FadeIn} exiting={FadeOut}>
                                <TouchableOpacity onPress={handleClear}>
                                    <View className="bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                                        <Ionicons name="close" size={14} color={theme === 'dark' ? '#cbd5e1' : '#64748b'} />
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>
                </Animated.View>

                {/* Categories - Simplified for now as we mostly just search lawyers */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
                        className="mb-2"
                    >
                        {['All', 'Lawyers'].map((cat, index) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                className={`mr-2 px-5 py-2.5 rounded-full border ${activeCategory === cat
                                    ? 'bg-black dark:bg-white border-transparent shadow-md'
                                    : 'bg-white dark:bg-[#1C1C1E] border-gray-100 dark:border-white/10'
                                    }`}
                            >
                                <Text className={`font-semibold text-sm ${activeCategory === cat
                                    ? 'text-white dark:text-black'
                                    : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Main Content Area */}
                <ScrollView
                    className="flex-1 px-5"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {query.length === 0 ? (
                        // Recent Searches
                        <Animated.View entering={FadeIn.delay(200).duration(500)}>
                            <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider ml-1">Recent</Text>
                            <View className="flex-row flex-wrap gap-3">
                                {recentSearches.map((item, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        className="flex-row items-center bg-white dark:bg-[#1C1C1E] px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm active:opacity-70"
                                        onPress={() => setQuery(item)}
                                    >
                                        <Ionicons name="time-outline" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
                                        <Text className="text-slate-700 dark:text-gray-200 font-medium">{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Discover Section */}
                            <View className="mt-8">
                                <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider ml-1">Discover</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                                    {[1, 2, 3].map((i) => (
                                        <TouchableOpacity key={i} className="w-72 h-36 bg-blue-600 rounded-3xl mr-4 p-5 justify-between relative overflow-hidden">
                                            <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                                            <View className="flex-row justify-between items-start">
                                                <MaterialIcons name="gavel" size={24} color="white" />
                                                <View className="bg-white/20 px-2 py-1 rounded-lg">
                                                    <Text className="text-white text-xs font-bold">Trending</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text className="text-white text-lg font-bold">Top Criminal Lawyers</Text>
                                                <Text className="text-white/80 text-sm">Find the best defense in your area</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </Animated.View>
                    ) : (
                        // Search Results
                        <View>
                            <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider ml-1">
                                {results.length > 0 ? 'Results' : loading ? 'Searching...' : 'No Results'}
                            </Text>

                            {loading && (
                                <View className="py-10">
                                    <ActivityIndicator size="large" color="#2563eb" />
                                </View>
                            )}

                            {!loading && results.length === 0 && (
                                <Animated.View entering={FadeIn} className="items-center justify-center py-20">
                                    <View className="w-24 h-24 bg-gray-100 dark:bg-[#1C1C1E] rounded-full items-center justify-center mb-6">
                                        <Ionicons name="search" size={48} color="#cbd5e1" />
                                    </View>
                                    <Text className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No results found</Text>
                                    <Text className="text-gray-500 text-center px-10">
                                        We couldn't find anything matching "{query}".
                                    </Text>
                                </Animated.View>
                            )}

                            {!loading && results.length > 0 && results.map((item, index) => (
                                <Animated.View
                                    key={item.id}
                                    entering={FadeInDown.delay(index * 100).duration(400)}
                                    layout={Layout.springify()}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        className="flex-row items-center bg-white dark:bg-[#1C1C1E] p-4 rounded-2xl mb-3 shadow-sm border border-gray-100 dark:border-white/5"
                                    >
                                        {item.image ? (
                                            <Image source={{ uri: item.image }} className="w-12 h-12 rounded-full mr-4 bg-gray-200" />
                                        ) : (
                                            <View
                                                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                                                style={{ backgroundColor: `${item.color}15` }}
                                            >
                                                <MaterialIcons name={item.icon as any} size={24} color={item.color} />
                                            </View>
                                        )}

                                        <View className="flex-1">
                                            <View className="flex-row items-center gap-2 mb-0.5">
                                                <Text className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</Text>
                                                <View className={`px-2 py-0.5 rounded-md ${item.type === 'lawyer' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                    item.type === 'case' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                        'bg-gray-100 dark:bg-gray-800'
                                                    }`}>
                                                    <Text className={`text-[10px] font-bold uppercase ${item.type === 'lawyer' ? 'text-blue-700 dark:text-blue-400' :
                                                        item.type === 'case' ? 'text-orange-700 dark:text-orange-400' :
                                                            'text-gray-600 dark:text-gray-400'
                                                        }`}>{item.type}</Text>
                                                </View>
                                            </View>
                                            <Text className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</Text>
                                        </View>

                                        <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
                                    </TouchableOpacity>
                                </Animated.View>
                            ))
                            }
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
