import StorageManager from './storage.js';
import APIManager from './api.js';
import UIManager from './ui.js';

/**
 * Main Application Module
 */
class AIAssistant {
    constructor() {
        this.activeChat = null;
        this.settings = StorageManager.getSettings();
        this.chats = StorageManager.getChatHistory();
        
        this.init();
    }

    init() {
        // Init UI
        UIManager.initTheme(StorageManager.getTheme());
        this.loadSettingsToUI();
        
        // Load some chat or create first
        if (this.chats.length === 0) {
            this.createNewChat();
        } else {
            this.switchChat(this.chats[0].id);
        }

        this.bindEvents();
        lucide.createIcons();
    }

    bindEvents() {
        // Theme Toggle
        UIManager.elements.themeToggle.addEventListener('click', () => {
            const isDark = UIManager.toggleTheme();
            StorageManager.saveTheme(isDark);
        });

        // Sidebar Toggle Mobile
        UIManager.elements.sidebarToggle.addEventListener('click', () => {
            UIManager.elements.sidebar.classList.toggle('-translate-x-full');
        });

        // New Chat
        UIManager.elements.newChatBtn.addEventListener('click', () => {
            this.createNewChat();
            if (window.innerWidth < 1024) {
                UIManager.elements.sidebar.classList.add('-translate-x-full');
            }
        });

        // Settings Modal
        UIManager.elements.settingsBtn.addEventListener('click', () => UIManager.toggleModal(true));
        UIManager.elements.closeSettings.addEventListener('click', () => UIManager.toggleModal(false));
        
        // Save Settings
        UIManager.elements.settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.settings = {
                apiKey: UIManager.elements.apiKeyInput.value,
                model: UIManager.elements.modelInput.value,
                endpoint: UIManager.elements.endpointInput.value
            };
            StorageManager.saveSettings(this.settings);
            UIManager.toggleModal(false);
        });

        // Sending Messages
        const handleSend = () => {
            const text = UIManager.elements.chatInput.value.trim();
            if (text) {
                this.handleUserMessage(text);
                UIManager.elements.chatInput.value = '';
                UIManager.elements.chatInput.style.height = 'auto';
            }
        };

        UIManager.elements.sendBtn.addEventListener('click', handleSend);
        UIManager.elements.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });

        // Auto-resize textarea
        UIManager.elements.chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    loadSettingsToUI() {
        UIManager.elements.apiKeyInput.value = this.settings.apiKey || '';
        UIManager.elements.modelInput.value = this.settings.model || 'gpt-3.5-turbo';
        UIManager.elements.endpointInput.value = this.settings.endpoint || 'https://api.openai.com/v1/chat/completions';
    }

    createNewChat() {
        const newChat = StorageManager.createNewChat();
        this.chats = StorageManager.getChatHistory();
        this.switchChat(newChat.id);
    }

    switchChat(chatId) {
        this.activeChat = this.chats.find(c => c.id === chatId);
        UIManager.clearChat();
        UIManager.renderHistory(
            this.chats, 
            chatId, 
            (id) => this.switchChat(id),
            (id) => this.deleteChat(id)
        );
        
        if (this.activeChat.messages.length > 0) {
            this.activeChat.messages.forEach(msg => {
                UIManager.addMessage(msg.role, msg.content, false);
            });
        } else {
            // Option to show a welcome message visually (not added to history)
            UIManager.addMessage('assistant', 'Hello! How can I help you today?', false);
        }
    }

    deleteChat(chatId) {
        this.chats = StorageManager.deleteChat(chatId);
        if (this.activeChat && this.activeChat.id === chatId) {
            if (this.chats.length > 0) {
                this.switchChat(this.chats[0].id);
            } else {
                this.createNewChat();
            }
        } else {
            UIManager.renderHistory(
                this.chats, 
                this.activeChat ? this.activeChat.id : null,
                (id) => this.switchChat(id),
                (id) => this.deleteChat(id)
            );
        }
    }

    async handleUserMessage(content) {
        if (!this.activeChat) return;

        // Add to data
        const userMsg = { role: 'user', content: content };
        this.activeChat.messages.push(userMsg);
        
        // Update UI
        UIManager.addMessage('user', content);
        UIManager.showTypingIndicator();

        try {
            const aiResponse = await APIManager.sendMessage(this.activeChat.messages, this.settings);
            
            UIManager.removeTypingIndicator();
            UIManager.addMessage('assistant', aiResponse.content);
            
            // Save to data
            this.activeChat.messages.push(aiResponse);
            StorageManager.updateChatMessages(this.activeChat.id, this.activeChat.messages);
            
            // Refresh history for title updates
            this.chats = StorageManager.getChatHistory();
            UIManager.renderHistory(
                this.chats, 
                this.activeChat.id, 
                (id) => this.switchChat(id),
                (id) => this.deleteChat(id)
            );

        } catch (error) {
            UIManager.removeTypingIndicator();
            UIManager.showError(error.message);
        }
    }
}

// Instantiate the App
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
});
