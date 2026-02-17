import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, isLoading, onUploadFile }) => {
    const [input, setInput] = useState('');
    const fileInputRef = React.useRef(null);

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

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onUploadFile(file);
            e.target.value = ''; // Reset
        }
    };

    return (
        <div className="relative w-full">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={onFileChange}
                accept=".pdf,.txt,.md,.docx"
            />

            <form
                onSubmit={handleSubmit}
                className="relative flex items-end gap-2 bg-dark-surface border border-dark-border rounded-xl shadow-lg ring-1 ring-white/5 focus-within:ring-primary-500/50 focus-within:border-primary-500/50 transition-all duration-200 pl-2 flex items-center"
            >
                {/* Upload Button */}
                <button
                    type="button"
                    onClick={handleUploadClick}
                    className="p-3 text-gray-400 hover:text-gray-200 transition-colors"
                >
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=linear"> <g id="attach"> <path id="vector" d="M20.6475 10.6158L11.8855 19.3778C9.93289 21.3304 6.76706 21.3304 4.81444 19.3778C2.86182 17.4252 2.86182 14.2594 4.81444 12.3068L12.9462 4.17503C14.313 2.80819 16.5291 2.80819 17.8959 4.17503C19.2628 5.54186 19.2628 7.75794 17.8959 9.12478L10.1024 16.9183C9.32132 17.6994 8.05499 17.6994 7.27394 16.9183C6.4929 16.1373 6.49289 14.8709 7.27394 14.0899L14.468 6.89585" stroke="#f3f4f6" stroke-width="1.5" stroke-linecap="round"></path> </g> </g> </g></svg>
                    {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg> */}
                </button>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    rows={1}
                    className="w-full bg-transparent border-0 text-gray-100 placeholder:truncate placeholder:line-clamp-1 text-ellipsis placeholder-gray-500 pl-2 pr-[55px] py-3.5 focus:ring-0 resize-none min-h-[52px] scrollbar-hide outline-none"
                    // style={{ height: 'auto', minHeight: '52px' }}
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
