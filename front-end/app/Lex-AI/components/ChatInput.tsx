"use client";

import { useState, useRef } from "react";
import styles from "./ChatInput.module.css";
import ContextPicker, { ContextItem } from "./ContextPicker";

interface ChatInputProps {
    onSendMessage: (message: string, context: ContextItem[]) => void;
    onStop: () => void;
    isProcessing: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export default function ChatInput({ onSendMessage, onStop, isProcessing, disabled, placeholder }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [attachedContexts, setAttachedContexts] = useState<ContextItem[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (isProcessing) return; // Prevent enter from sending while processing? Or maybe stop?
            // Standard behavior: Enter sends. If processing, maybe disable?
            handleSend();
        }
    };

    const handleSend = () => {
        if (!input.trim() || disabled || isProcessing) return;
        onSendMessage(input, attachedContexts);
        setInput("");
        setAttachedContexts([]);
    };

    const addContext = (item: ContextItem) => {
        // Avoid duplicates
        if (!attachedContexts.find((c) => c.id === item.id)) {
            setAttachedContexts([...attachedContexts, item]);
        }
        setIsPickerOpen(false);
    };

    const removeContext = (id: string) => {
        setAttachedContexts(attachedContexts.filter((c) => c.id !== id));
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputWrapper}>
                {isPickerOpen && (
                    <ContextPicker
                        onSelect={addContext}
                        onClose={() => setIsPickerOpen(false)}
                    />
                )}
                {attachedContexts.length > 0 && (
                    <div className={styles.contextChips}>
                        {attachedContexts.map((ctx) => (
                            <div key={ctx.id} className={styles.chip}>
                                <span className="material-symbols-outlined chipIcon">
                                    {ctx.type === 'chat' ? 'chat_bubble' : 'description'}
                                </span>
                                <span className={styles.chipName}>{ctx.name}</span>
                                <button onClick={() => removeContext(ctx.id)} className={styles.removeChip}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.inputRow}>
                    <button
                        className={styles.attachBtn}
                        onClick={() => setIsPickerOpen(!isPickerOpen)}
                        title="Attach Context"
                        disabled={isProcessing}
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                    </button>

                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || "Ask legal question..."}
                        className={styles.input}
                        disabled={disabled && !isProcessing} // Allow typing while processing to queue next thought? Usually disabled in basic implementations but OpenAI allows.
                    />

                    {isProcessing ? (
                        <button
                            className={styles.stopBtn}
                            onClick={onStop}
                            title="Stop Generating"
                        >
                            <span className="material-symbols-outlined">stop</span>
                        </button>
                    ) : (
                        <button
                            className={styles.sendBtn}
                            onClick={handleSend}
                            disabled={disabled || !input.trim()}
                        >
                            <span className="material-symbols-outlined">arrow_upward</span>
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.footerNote}>
                Lexpal AI can make mistakes. Please verify important information.
            </div>
        </div>
    );
}
