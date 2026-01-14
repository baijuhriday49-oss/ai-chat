/**
 * Storage Manager
 * Handles persistence of chat history and settings using localStorage
 */

const STORAGE_KEYS = {
    CHATS: 'ai_assistant_chats',
    SETTINGS: 'ai_assistant_settings',
    THEME: 'ai_assistant_theme'
};

const StorageManager = {
    // Save settings (API Key, Model, etc)
    saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    },

    getSettings() {
        const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : { apiKey: '', model: 'gpt-3.5-turbo', endpoint: 'https://api.openai.com/v1/chat/completions' };
    },

    // Save chat history
    saveChatHistory(history) {
        localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(history));
    },

    getChatHistory() {
        const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
        return chats ? JSON.parse(chats) : [];
    },

    // Theme preference
    saveTheme(isDark) {
        localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    },

    getTheme() {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    },

    // CRUD operations for specific chats
    createNewChat() {
        const chats = this.getChatHistory();
        const newChat = {
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [],
            timestamp: new Date().toISOString()
        };
        chats.unshift(newChat);
        this.saveChatHistory(chats);
        return newChat;
    },

    updateChatMessages(chatId, messages) {
        const chats = this.getChatHistory();
        const index = chats.findIndex(c => c.id === chatId);
        if (index !== -1) {
            chats[index].messages = messages;
            // Update title based on first message if it's still "New Chat"
            if (chats[index].title === 'New Chat' && messages.length > 0) {
                chats[index].title = messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? '...' : '');
            }
            this.saveChatHistory(chats);
        }
    },

    deleteChat(chatId) {
        const chats = this.getChatHistory().filter(c => c.id !== chatId);
        this.saveChatHistory(chats);
        return chats;
    }
};

export default StorageManager;
