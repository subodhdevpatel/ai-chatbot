import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="relative w-full">
            <form
                onSubmit={handleSubmit}
                className="relative flex items-end gap-2 bg-dark-surface border border-dark-border rounded-xl shadow-lg ring-1 ring-white/5 focus-within:ring-primary-500/50 focus-within:border-primary-500/50 transition-all duration-200"
            >
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about the documents..."
                    rows={1}
                    className="w-full bg-transparent border-0 text-gray-100 placeholder:truncate placeholder:line-clamp-1 text-ellipsis placeholder-gray-500 pl-4 pr-[55px] py-3.5 focus:ring-0 resize-none min-h-[52px] max-h-32 scrollbar-hide"
                    style={{ height: 'auto', minHeight: '52px' }}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 bottom-2 p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
