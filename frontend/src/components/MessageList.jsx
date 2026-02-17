import React from 'react';

const MessageList = ({ messages, isLoading, messagesEndRef }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
            {messages.map((msg) => {
                // Only render User and AI messages, skip system upload messages
                if (msg.isUpload) return null;

                // User / AI Message
                return (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-md backdrop-blur-sm ${msg.sender === 'user'
                                ? 'bg-primary-600/90 text-white rounded-br-none'
                                : 'bg-dark-surface/90 text-gray-100 border border-dark-border rounded-bl-none'
                            }`}>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>

                            {/* Sources Section for AI messages */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-600/50 text-xs text-gray-400">
                                    <strong>Sources:</strong>
                                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                                        {msg.sources.map((src, i) => (
                                            <li key={i} className="truncate" title={src}>{src}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className={`text-[10px] mt-2 opacity-50 flex items-center gap-1 ${msg.sender === 'user' ? 'justify-end text-primary-100' : 'justify-start text-gray-400'
                                }`}>
                                <span>{msg.timestamp}</span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex justify-start animate-fade-in">
                    <div className="bg-dark-surface/90 border border-dark-border rounded-2xl rounded-bl-none px-5 py-4 shadow-md flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
