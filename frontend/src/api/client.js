const API_BASE_URL = 'http://localhost:8000';

/**
 * Sends a chat message to the backend and returns the response.
 * @param {string} query - The user's question.
 * @returns {Promise<object>} - The full response object (answer, sources, etc).
 */
export const sendMessage = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message:  query }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Return full object to access answer and sources
    } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
    }
};

/**
 * Uploads a document to the backend.
 * @param {File} file - The file object to upload.
 * @returns {Promise<object>} - The response from the upload endpoint.
 */
export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
            // Content-Type header is set automatically by browser with boundary for FormData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Upload failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to upload document:", error);
        throw error;
    }
};

