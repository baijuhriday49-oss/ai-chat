/**
 * API Manager
 * Handles communication with the AI provider
 */

const APIManager = {
    async sendMessage(messages, settings) {
        if (!settings.apiKey) {
            throw new Error("Please provide an API key in the settings.");
        }

        try {
            const response = await fetch(settings.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.apiKey}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: messages,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API Request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

export default APIManager;
