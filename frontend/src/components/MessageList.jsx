import React from 'react';

const MessageList = ({ messages, isLoading, messagesEndRef }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`group flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                >
                    <div
                        className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}
                    >
                        {/* Avatar */}
                        <div
                            className={`flex-none w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shadow-sm ${msg.sender === 'user'
                                    ? 'bg-gray-700 text-gray-300'
                                    : 'bg-primary-600 text-white'
                                }`}
                        >
                            {msg.sender === 'user' ? 'U' : 'AI'}
                        </div>

                        {/* Bubble */}
                        <div
                            className={`relative px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-gray-700 text-gray-100 rounded-tr-sm'
                                    : 'bg-dark-surface border border-dark-border text-gray-200 rounded-tl-sm'
                                }`}
                        >
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                            <span className={`text-[10px] opacity-50 mt-1 block w-full ${msg.sender === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                {msg.timestamp}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex justify-start w-full">
                    <div className="flex max-w-[80%] gap-3">
                        <div className="flex-none w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium animate-pulse">
                            AI
                        </div>
                        <div className="bg-dark-surface border border-dark-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
