/* ================================
   VALENDU ACADEMY - AI CHATBOT JS
   ================================ */

class ValenduChatbot {
    constructor() {
        this.button = document.getElementById('chatbotButton');
        this.window = document.getElementById('chatbotWindow');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSendBtn');
        this.closeBtn = document.getElementById('chatbotClose');

        this.isOpen = false;
        this.init();
    }

    init() {
        // Event listeners
        if (this.button) {
            this.button.addEventListener('click', () => this.toggleChat());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeChat());
        }
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendMessage());
        }
        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Greeting message
        this.addBotMessage('👋 Hi! I\'m AI Mentor from Valendu Academy. How can I help you today?');
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.window.classList.add('active');
        this.button.classList.add('active');
        this.input.focus();
    }

    closeChat() {
        this.isOpen = false;
        this.window.classList.remove('active');
        this.button.classList.remove('active');
    }

    sendMessage() {
        const message = this.input.value.trim();

        if (!message) return;

        // Add user message
        this.addUserMessage(message);
        this.input.value = '';
        this.input.focus();

        // Disable send button
        this.sendBtn.disabled = true;

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate bot thinking time and send reply
        setTimeout(() => {
            const reply = this.getBotReply(message);
            this.removeTypingIndicator();
            this.addBotMessage(reply);
            this.sendBtn.disabled = false;
        }, 1000);
    }

    addUserMessage(message) {
        const messageDiv = this.createMessageElement(message, 'user');
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messageDiv = this.createMessageElement(message, 'bot');
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    createMessageElement(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        // Check if message contains WhatsApp button
        if (text.includes('[WHATSAPP_BUTTON]')) {
            text = text.replace('[WHATSAPP_BUTTON]', '');
            contentDiv.innerHTML = text;

            const whatsappBtn = document.createElement('a');
            whatsappBtn.href = 'https://whatsapp.com/channel/0029Vb7achN2kNFiwk0ICg3p';
            whatsappBtn.target = '_blank';
            whatsappBtn.className = 'chat-whatsapp-btn';
            whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Join Chat on WhatsApp';

            contentDiv.appendChild(whatsappBtn);
        } else {
            contentDiv.textContent = text;
        }

        messageDiv.appendChild(contentDiv);
        return messageDiv;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot', 'typing-indicator-message');
        typingDiv.id = 'typingIndicator';

        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('typing-dot');
            typingIndicator.appendChild(dot);
        }

        typingDiv.appendChild(typingIndicator);
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    getBotReply(message) {
        const lowerMessage = message.toLowerCase();

        // Join/Admission
        if (
            lowerMessage.includes('join') ||
            lowerMessage.includes('admission') ||
            lowerMessage.includes('enroll') ||
            lowerMessage.includes('register')
        ) {
            return 'To join Valendu Academy, please fill out the registration form on our website or contact us on WhatsApp. [WHATSAPP_BUTTON]';
        }

        // Fees
        if (
            lowerMessage.includes('fee') ||
            lowerMessage.includes('cost') ||
            lowerMessage.includes('price') ||
            lowerMessage.includes('charge')
        ) {
            return 'Fees depend on the training program and level. Please contact us on WhatsApp for full details and current pricing. [WHATSAPP_BUTTON]';
        }

        // Trial
        if (
            lowerMessage.includes('trial') ||
            lowerMessage.includes('free class') ||
            lowerMessage.includes('demo') ||
            lowerMessage.includes('demo class')
        ) {
            return 'Trial sessions are available every weekend. Contact us to book your slot! [WHATSAPP_BUTTON]';
        }

        // Location
        if (
            lowerMessage.includes('location') ||
            lowerMessage.includes('address') ||
            lowerMessage.includes('where') ||
            lowerMessage.includes('contact us')
        ) {
            return 'You can find our academy location in the Contact section of our website. For quick inquiries, join our WhatsApp channel. [WHATSAPP_BUTTON]';
        }

        // Contact
        if (
            lowerMessage.includes('contact') ||
            lowerMessage.includes('phone') ||
            lowerMessage.includes('email') ||
            lowerMessage.includes('whatsapp')
        ) {
            return 'You can join our official WhatsApp channel for updates and quick support. [WHATSAPP_BUTTON]';
        }

        // Training
        if (
            lowerMessage.includes('training') ||
            lowerMessage.includes('drill') ||
            lowerMessage.includes('program') ||
            lowerMessage.includes('course')
        ) {
            return 'We offer training programs for all levels: Beginner, Intermediate, and Advanced. Each program is tailored to your position on the field. Visit our Training Roadmap section to learn more!';
        }

        // Positions
        if (
            lowerMessage.includes('position') ||
            lowerMessage.includes('goalkeeper') ||
            lowerMessage.includes('defender') ||
            lowerMessage.includes('midfielder') ||
            lowerMessage.includes('striker') ||
            lowerMessage.includes('forward')
        ) {
            return 'We have position-specific training for: Goalkeeper, Defender, Midfielder, and Striker. Each position gets specialized drills and coaching!';
        }

        // Testimonials/Reviews
        if (
            lowerMessage.includes('testimonial') ||
            lowerMessage.includes('review') ||
            lowerMessage.includes('success') ||
            lowerMessage.includes('student')
        ) {
            return 'Check out our Student Testimonials section to see how our training has transformed our students\' football careers!';
        }

        // Hall of Fame
        if (
            lowerMessage.includes('elite') ||
            lowerMessage.includes('hall of fame') ||
            lowerMessage.includes('champion') ||
            lowerMessage.includes('valendu priyadarshi')
        ) {
            return 'Check out our Hall of Fame section to see our elite players and their amazing achievements! 🏆';
        }

        // Help/Menu
        if (
            lowerMessage.includes('help') ||
            lowerMessage.includes('menu') ||
            lowerMessage.includes('what can you do') ||
            lowerMessage.includes('options')
        ) {
            return '📋 I can help you with:\n• Join/Admission\n• Fees & Programs\n• Trial Sessions\n• Location & Contact\n• Training Programs\n• Positions\n\nJust type your query!';
        }

        // Greeting
        if (
            lowerMessage.includes('hello') ||
            lowerMessage.includes('hi') ||
            lowerMessage.includes('hey') ||
            lowerMessage.includes('namaste')
        ) {
            return '👋 Hello! Welcome to Valendu Academy. How can I assist you today?';
        }

        // Goodbye
        if (
            lowerMessage.includes('bye') ||
            lowerMessage.includes('goodbye') ||
            lowerMessage.includes('see you') ||
            lowerMessage.includes('thanks')
        ) {
            return '👋 Thank you for reaching out to Valendu Academy! Feel free to chat anytime. All the best! ⚽';
        }

        // Default reply
        return '✨ Thank you for messaging Valendu Academy! 🎯\n\nPlease try queries like:\n• "join"\n• "fees"\n• "trial"\n• "location"\n• "training"\n• "positions"\n\nOr type "help" for more options!';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 50);
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new ValenduChatbot();
});
