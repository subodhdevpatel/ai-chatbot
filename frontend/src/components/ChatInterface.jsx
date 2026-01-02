import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { sendMessage, uploadDocument } from '../api/client';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your AI assistant. I can help you answer questions based on your documents. How can I help you today?",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

// Upload state
const [isUploading, setIsUploading] = useState(false);
const [uploadStatus, setUploadStatus] = useState(null);
const fileInputRef = useRef(null);

const handleUploadClick = () => {
    fileInputRef.current?.click();
};

const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus({ type: 'info', msg: `Uploading ${file.name}...` });

    try {
        await uploadDocument(file);
        setUploadStatus({ type: 'success', msg: `Successfully uploaded ${file.name}!` });
        // Clear status after 3 seconds
        setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
        setUploadStatus({ type: 'error', msg: `Failed to upload: ${err.message}` });
    } finally {
        setIsUploading(false);
        e.target.value = ''; // Reset input
    }
};

const handleSendMessage = async (text) => {
    setError(null);
    // Add user message
    const userMessage = {
        id: Date.now(),
        text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
        const data = await sendMessage(text);

        const aiMessage = {
            id: Date.now() + 1,
            text: data.response,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: data.sources // Optional: could display sources if MessageList supports it
        };
        setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
        setError("Failed to get a response. Please check if the backend is running.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
};

return (
    <div className="flex flex-col h-screen bg-dark-bg text-gray-100 font-sans">
        {/* Header */}
        <header className="flex-none p-4 border-b border-dark-border bg-dark-surface/50 backdrop-blur-md sticky top-0 z-10">
            <div className="max-w-4xl mx-auto flex items-center gap-3 pr-[55px]">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <h1 className="text-xl font-semibold truncate text-ellipsis line-clamp-1 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                    AI Research Assistant
                </h1>
            </div>

            {/* Upload Button */}
            <div className="absolute right-4 top-4 flex items-center gap-4">
                {uploadStatus && (
                    <span className={`text-sm ${uploadStatus.type === 'error' ? 'text-red-400' : 'text-green-400'} animate-fade-in`}>
                        {uploadStatus.msg}
                    </span>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.txt,.md"
                />
                <button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-bg border border-dark-border hover:bg-dark-surface transition-colors text-sm text-gray-300"
                    title="Upload Document"
                >
                    {isUploading ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    )}
                    <span className="hidden sm:inline">Upload</span>
                </button>
            </div>
        </header>

        {/* Main Chat Area */}
        <main className="flex-1 overflow-hidden relative w-full max-w-4xl mx-auto flex flex-col">
            <MessageList messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />

            {/* Error Notification */}
            {error && (
                <div className="mx-4 mb-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200 text-sm animate-fade-in">
                    <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="flex-none p-4 bottom-0 w-full bg-gradient-to-t from-dark-bg via-dark-bg to-transparent">
                <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                <div className="text-center mt-2">
                    <p className="text-xs text-gray-500">
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>
        </main>
    </div>
);
};

export default ChatInterface;
