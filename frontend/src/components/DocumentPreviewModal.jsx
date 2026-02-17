import React, { useEffect, useState } from 'react';

const DocumentPreviewModal = ({ filename, onClose }) => {
    const [contentUrl, setContentUrl] = useState('');
    const [fileType, setFileType] = useState('');

    useEffect(() => {
        if (filename) {
            setContentUrl(`http://localhost:8000/documents/${filename}/content`);
            const ext = filename.split('.').pop().toLowerCase();
            setFileType(ext);
        }
    }, [filename]);

    if (!filename) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-surface w-11/12 h-5/6 rounded-lg shadow-2xl flex flex-col border border-dark-border relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-dark-border bg-dark-bg/50">
                    <h3 className="text-lg font-medium text-gray-200 truncate pr-4">{filename}</h3>
                    <div className="flex items-center gap-2">
                        <a
                            href={contentUrl}
                            download
                            className="p-2 text-gray-400 hover:text-primary-400 hover:bg-dark-bg rounded-lg transition-colors"
                            title="Download"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                            </svg>
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-bg rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white relative overflow-hidden">
                    {fileType === 'pdf' ? (
                        <iframe
                            src={contentUrl}
                            className="w-full h-full border-none"
                            title="PDF Preview"
                        />
                    ) : fileType === 'txt' || fileType === 'md' ? (
                        <iframe
                            src={contentUrl}
                            className="w-full h-full border-none bg-white p-4 font-mono text-sm overflow-auto"
                            title="Text Preview"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                            <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg font-medium">Preview not available for .{fileType}</p>
                            <a
                                href={contentUrl}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                                download
                            >
                                Download File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentPreviewModal;
