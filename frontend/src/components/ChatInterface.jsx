import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Sidebar from './Sidebar';
import DocumentPreviewModal from './DocumentPreviewModal';
import { sendMessage, getDocuments, uploadDocument, deleteDocument } from '../api/client';

const ChatInterface = () => {
    // --- State ---
    const [chats, setChats] = useState(() => {
        const saved = localStorage.getItem('chat_history');
        return saved ? JSON.parse(saved) : {};
    });
    const [currentChatId, setCurrentChatId] = useState(() => {
        const saved = localStorage.getItem('current_chat_id');
        return saved || Date.now().toString();
    });

    // Ensure the current chat exists in the chats object
    const [messages, setMessages] = useState(() => {
        const savedChats = JSON.parse(localStorage.getItem('chat_history') || '{}');
        const savedId = localStorage.getItem('current_chat_id');
        const activeId = savedId || Date.now().toString();

        if (savedChats[activeId]) {
            return savedChats[activeId].messages;
        }
        return [{
            id: 1,
            text: "Hello! I'm your AI assistant. I can help you answer questions based on your documents. How can I help you today?",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
    });

    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null); // { type: 'info' | 'success' | 'error', message: string }
    const [selectedDocument, setSelectedDocument] = useState(null);
    const messagesEndRef = useRef(null);

    // --- Persist Chats ---
    useEffect(() => {
        const updatedChats = {
            ...chats,
            [currentChatId]: {
                id: currentChatId,
                title: chats[currentChatId]?.title || `Chat ${Object.keys(chats).length + 1}`,
                timestamp: chats[currentChatId]?.timestamp || Date.now(),
                messages: messages
            }
        };
        // Only save if messages have changed or it's a new chat
        setChats(updatedChats);
        localStorage.setItem('chat_history', JSON.stringify(updatedChats));
        localStorage.setItem('current_chat_id', currentChatId);
    }, [messages, currentChatId]);

    // --- Scroll to bottom ---
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // --- Document Fetching ---
    const fetchDocuments = async () => {
        const docs = await getDocuments();
        setDocuments(docs);
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // --- Actions ---
    const handleNewChat = () => {
        const newId = Date.now().toString();
        const initialMsg = [{
            id: 1,
            text: "Hello! I'm your AI assistant. I can help you answer questions based on your documents. How can I help you today?",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];

        setCurrentChatId(newId);
        setMessages(initialMsg);
    };

    const handleSelectChat = (chatId) => {
        if (chats[chatId]) {
            setCurrentChatId(chatId);
            setMessages(chats[chatId].messages);
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
                sources: data.sources
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            setError("Failed to get a response. Please check if the backend is running.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadSuccess = (filename) => {
        const uploadMessage = {
            id: Date.now(),
            text: `Uploaded document: ${filename}`,
            sender: 'system',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUpload: true
        };
        setMessages(prev => [...prev, uploadMessage]);
        fetchDocuments();
    };

    const handleDeleteChat = (chatId) => {
        const updatedChats = { ...chats };
        delete updatedChats[chatId];

        setChats(updatedChats);
        localStorage.setItem('chat_history', JSON.stringify(updatedChats));

        if (chatId === currentChatId) {
            handleNewChat();
        }
    };

    const handleDeleteDocument = async (filename) => {
        try {
            await deleteDocument(filename);
            fetchDocuments();
        } catch (err) {
            setError(`Failed to delete ${filename}`);
        }
    };

    const handleUploadFile = async (file) => {
        setStatus({ type: 'info', message: `Uploading ${file.name}...` });

        try {
            await uploadDocument(file);
            handleUploadSuccess(file.name);
            setStatus({ type: 'success', message: `${file.name} uploaded successfully.` });
            setTimeout(() => setStatus(null), 3000);
        } catch (err) {
            setStatus({ type: 'error', message: `Failed to upload ${file.name}` });
            setTimeout(() => setStatus(null), 3000);
        }
    };

    return (
        <div className="flex h-screen bg-dark-bg text-gray-100 font-sans overflow-hidden">
            {/* Left Sidebar */}
            <div className="flex-none hidden md:block w-64">
                <Sidebar
                    documents={documents}
                    chats={chats}
                    currentChatId={currentChatId}
                    onNewChat={handleNewChat}
                    onSelectChat={handleSelectChat}
                    onUploadSuccess={handleUploadSuccess}
                    onDeleteChat={handleDeleteChat}
                    onDeleteDocument={handleDeleteDocument}
                    onSelectDocument={setSelectedDocument}
                />
            </div>

            {/* Document Preview Modal */}
            <DocumentPreviewModal
                filename={selectedDocument}
                onClose={() => setSelectedDocument(null)}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Header */}
                <header className="flex-none p-4 border-b border-dark-border bg-dark-surface/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                            AI Research Assistant
                        </h1>
                    </div>
                </header>

                {/* Messages */}
                <main className="flex-1 overflow-y-auto relative w-full max-w-5xl mx-auto flex flex-col">
                    <MessageList
                        messages={messages}
                        isLoading={isLoading}
                        messagesEndRef={messagesEndRef}
                        currentChatId={currentChatId}
                    />

                    {/* Status Notification */}
                    {status && (
                        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 p-3 rounded-lg flex items-center gap-3 shadow-lg z-20 animate-fade-in ${status.type === 'error' ? 'bg-red-500/90 text-white' :
                            status.type === 'success' ? 'bg-green-500/90 text-white' :
                                'bg-blue-500/90 text-white'
                            }`}>
                            {status.type === 'error' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : status.type === 'success' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>{status.message}</span>
                            <button onClick={() => setStatus(null)} className="ml-auto hover:text-white/80">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Error Notification (Legacy, kept for other errors if needed, but status handles most) */}
                    {error && !status && (
                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 p-3 bg-red-500/90 text-white rounded-lg flex items-center gap-3 shadow-lg z-20 animate-fade-in">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                            <button onClick={() => setError(null)} className="ml-auto hover:text-gray-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </main>

                {/* Input Area */}
                <div className="flex-none p-4 w-full bg-gradient-to-t from-dark-bg via-dark-bg to-transparent max-w-5xl mx-auto">
                    <MessageInput
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        onUploadFile={handleUploadFile}
                    />
                    <div className="text-center mt-2">
                        <p className="text-xs text-gray-500">
                            AI can make mistakes. Please verify important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
