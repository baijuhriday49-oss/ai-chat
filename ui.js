/**
 * UI Manager
 * Handles DOM manipulation and visual updates
 */

const UIManager = {
    elements: {
        chatContainer: document.getElementById('chat-container'),
        historyList: document.getElementById('history-list'),
        themeToggle: document.getElementById('theme-toggle'),
        settingsBtn: document.getElementById('settings-btn'),
        newChatBtn: document.getElementById('new-chat-btn'),
        settingsModal: document.getElementById('settings-modal'),
        closeSettings: document.getElementById('close-settings'),
        settingsForm: document.getElementById('settings-form'),
        apiKeyInput: document.getElementById('api-key'),
        modelInput: document.getElementById('model-select'),
        endpointInput: document.getElementById('api-endpoint'),
        chatInput: document.getElementById('chat-input'),
        sendBtn: document.getElementById('send-btn'),
        sidebar: document.getElementById('sidebar'),
        sidebarToggle: document.getElementById('sidebar-toggle')
    },

    initTheme(currentTheme) {
        if (currentTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        return isDark;
    },

    renderHistory(chats, activeChatId, onChatSelect, onDeleteChat) {
        this.elements.historyList.innerHTML = '';
        chats.forEach(chat => {
            const div = document.createElement('div');
            const isActive = chat.id === activeChatId;
            div.className = `group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                isActive ? 'bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`;
            
            div.innerHTML = `
                <div class="flex items-center space-x-3 overflow-hidden">
                    <i data-lucide="message-square" class="w-4 h-4 flex-shrink-0"></i>
                    <span class="truncate text-sm font-medium">${chat.title}</span>
                </div>
                <button class="delete-chat opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity" data-id="${chat.id}">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            `;

            div.addEventListener('click', (e) => {
                if (e.target.closest('.delete-chat')) {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                } else {
                    onChatSelect(chat.id);
                }
            });

            this.elements.historyList.appendChild(div);
        });
        lucide.createIcons();
    },

    addMessage(role, content, animate = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-6 ${animate ? 'animate-fade-in' : ''}`;
        
        const isUser = role === 'user';
        const formattedContent = role === 'assistant' ? marked.parse(content) : content;

        msgDiv.innerHTML = `
            <div class="flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600 ml-3' : 'bg-emerald-600 mr-3'}">
                    <i data-lucide="${isUser ? 'user' : 'bot'}" class="w-5 h-5 text-white"></i>
                </div>
                <div class="message-bubble p-4 rounded-2xl ${
                    isUser 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                } shadow-sm">
                    <div class="prose prose-sm dark:prose-invert max-w-none">
                        ${formattedContent}
                    </div>
                </div>
            </div>
        `;
        
        this.elements.chatContainer.appendChild(msgDiv);
        this.scrollToBottom();
        lucide.createIcons();
    },

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'flex justify-start mb-6 animate-fade-in';
        indicator.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 mr-3 flex items-center justify-center">
                    <i data-lucide="bot" class="w-5 h-5 text-white"></i>
                </div>
                <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center h-10 px-6">
                    <div class="dot-flashing"></div>
                </div>
            </div>
        `;
        this.elements.chatContainer.appendChild(indicator);
        this.scrollToBottom();
        lucide.createIcons();
    },

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    },

    clearChat() {
        this.elements.chatContainer.innerHTML = '';
    },

    scrollToBottom() {
        this.elements.chatContainer.scrollTop = this.elements.chatContainer.scrollHeight;
    },

    toggleModal(show) {
        if (show) {
            this.elements.settingsModal.classList.remove('hidden');
            this.elements.settingsModal.classList.add('flex');
        } else {
            this.elements.settingsModal.classList.add('hidden');
            this.elements.settingsModal.classList.remove('flex');
        }
    },

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm animate-fade-in';
        errorDiv.innerHTML = `<p class="font-bold">Error</p><p>${message}</p>`;
        this.elements.chatContainer.appendChild(errorDiv);
        this.scrollToBottom();
    }
};

export default UIManager;
