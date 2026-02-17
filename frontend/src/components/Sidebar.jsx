import React from 'react';


const Sidebar = ({ documents, chats, currentChatId, onNewChat, onSelectChat, onUploadSuccess, onDeleteChat, onDeleteDocument, onSelectDocument }) => {






    // Sort chats by timestamp descending
    const sortedChats = Object.values(chats).sort((a, b) => b.timestamp - a.timestamp);

    return (
        <aside className="w-64 bg-dark-surface border-r border-dark-border flex flex-col h-full overflow-hidden">
            {/* 1. New Chat Button (Top) */}
            <div className="p-4">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-dark-bg border border-dark-border hover:bg-dark-surface/80 text-white rounded-md transition-all shadow-sm hover:shadow-md text-sm font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Chat</span>
                </button>
            </div>

            {/* 2. Chat History List (Middle - Flexible) */}
            <div className="flex-1 overflow-y-auto px-2 mb-2">
                <div className="px-2 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    History
                </div>
                {sortedChats.length === 0 ? (
                    <div className="px-2 text-sm text-gray-500 italic">No previous chats.</div>
                ) : (
                    <ul className="space-y-1">
                        {sortedChats.map((chat) => (
                            <li key={chat.id} className="relative group">
                                <button
                                    onClick={() => onSelectChat(chat.id)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors flex items-center gap-2 pr-8
                                        ${chat.id === currentChatId
                                            ? 'bg-dark-bg/80 text-primary-400 border border-dark-border'
                                            : 'text-gray-300 hover:bg-dark-bg/50'
                                        }`}
                                >
                                    <svg className="w-4 h-4 flex-none opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <span className="truncate">{chat.title || 'New Chat'}</span>
                                </button>
                                {/* Delete Chat Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Delete this chat history?')) {
                                            onDeleteChat(chat.id);
                                        }
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete Chat"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 3. Document Section (Bottom - Fixed height or constrained) */}
            <div className="p-4 border-t border-dark-border bg-dark-surface z-10">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</h2>
                </div>

                {/* Compact File List (Max 3 items shown, scroll if more) */}
                <div className="max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                    {documents.length === 0 ? (
                        <div className="text-xs text-gray-500 italic">No files.</div>
                    ) : (
                        <ul className="space-y-1">
                            {documents.map((doc, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between p-1.5 rounded hover:bg-dark-bg/50 text-gray-400 hover:text-gray-200 text-xs cursor-pointer group transition-colors"
                                    title={doc}
                                    onClick={() => onSelectDocument(doc)}
                                >
                                    <div className="flex items-center gap-2 truncate pr-2 pointer-events-none">
                                        <svg className="w-3 h-3 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="truncate">{doc}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Delete document '${doc}'?`)) {
                                                onDeleteDocument(doc);
                                            }
                                        }}
                                        className="hidden group-hover:block text-gray-600 hover:text-red-400 p-1 rounded hover:bg-dark-bg"
                                        title="Delete File"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
