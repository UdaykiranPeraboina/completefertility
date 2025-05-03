/**
 * Complete Fertility Chatbot
 * Simple, reliable implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create and append the chatbot UI
    createChatbotUI();
    
    // Initialize chatbot functionality
    initChatbot();
});

function createChatbotUI() {
    const chatbotHTML = `
        <div id="chatbot-container">
            <div class="chatbot-trigger">
                <i class="fas fa-comment"></i>
            </div>
            <div class="chatbot-box">
                <div class="chatbot-header">
                    <div class="chatbot-header-title">
                        <img src="https://res.cloudinary.com/dyv6tyill/image/upload/v1730567160/Screenshot_2024-11-02_223548_xulbw3.png" alt="Complete Fertility" class="chatbot-header-logo">
                        <h4>Complete Fertility Assistant</h4>
                    </div>
                    <button class="chatbot-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbot-messages">
                    <div class="message bot-message">
                        <p>Hello! I'm your Complete Fertility assistant. How can I help you with your farming or fertilizer needs today?</p>
                    </div>
                    <div class="quick-replies">
                        <button class="quick-reply-btn">Product Info</button>
                        <button class="quick-reply-btn">Best Fertilizers</button>
                        <button class="quick-reply-btn">Pricing</button>
                        <button class="quick-reply-btn">Soil Testing</button>
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbot-message-input" placeholder="Type your message here...">
                    <button id="chatbot-send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add chatbot styles
    const chatbotStyles = `
        <style id="chatbot-styles">
            #chatbot-container {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 9999;
                font-family: 'Poppins', 'Segoe UI', sans-serif;
            }
            
            .chatbot-box {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 500px;
                background-color: #fff;
                border-radius: 15px;
                box-shadow: 0 5px 25px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .chatbot-box.active {
                display: flex;
            }
            
            .chatbot-header {
                padding: 15px;
                background: linear-gradient(135deg, #3cb371, #2e8b57);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .chatbot-header-title {
                display: flex;
                align-items: center;
            }
            
            .chatbot-header-logo {
                height: 30px;
                margin-right: 10px;
            }
            
            .chatbot-header h4 {
                margin: 0;
                font-size: 1.1rem;
            }
            
            .chatbot-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.3s;
            }
            
            .chatbot-close:hover {
                opacity: 1;
            }
            
            .chatbot-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background-color: #f8f9fa;
                display: flex;
                flex-direction: column;
            }
            
            .message {
                margin-bottom: 15px;
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 18px;
                position: relative;
                clear: both;
                line-height: 1.5;
            }
            
            .message p {
                margin: 0;
            }
            
            .bot-message {
                background-color: #e9ecef;
                color: #333;
                border-bottom-left-radius: 5px;
                align-self: flex-start;
            }
            
            .user-message {
                background-color: #3cb371;
                color: white;
                border-bottom-right-radius: 5px;
                align-self: flex-end;
            }
            
            .chatbot-input {
                display: flex;
                padding: 15px;
                background-color: white;
                border-top: 1px solid #e9ecef;
            }
            
            .chatbot-input input {
                flex: 1;
                padding: 12px 15px;
                border: 1px solid #ddd;
                border-radius: 25px;
                outline: none;
                font-size: 0.95rem;
                transition: border 0.3s;
            }
            
            .chatbot-input input:focus {
                border-color: #3cb371;
            }
            
            .chatbot-input button {
                width: 45px;
                height: 45px;
                margin-left: 10px;
                background-color: #3cb371;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }
            
            .chatbot-input button:hover {
                background-color: #2e8b57;
                transform: scale(1.05);
            }
            
            .chatbot-trigger {
                width: 60px;
                height: 60px;
                background-color: #3cb371;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                cursor: pointer;
                transition: all 0.3s;
                color: white;
                font-size: 1.5rem;
            }
            
            .chatbot-trigger:hover {
                transform: scale(1.1);
                background-color: #2e8b57;
            }
            
            .quick-replies {
                display: flex;
                flex-wrap: wrap;
                margin-top: 10px;
                gap: 8px;
            }
            
            .quick-reply-btn {
                background-color: white;
                border: 1px solid #3cb371;
                border-radius: 20px;
                padding: 8px 15px;
                font-size: 0.9rem;
                color: #3cb371;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            
            .quick-reply-btn:hover {
                background-color: #3cb371;
                color: white;
            }
            
            .typing-indicator {
                padding: 10px 16px;
                display: flex;
                align-items: center;
                background-color: #e9ecef;
                border-radius: 18px;
                border-bottom-left-radius: 5px;
                max-width: 80%;
                align-self: flex-start;
                margin-bottom: 15px;
            }
            
            .typing-indicator span {
                height: 8px;
                width: 8px;
                float: left;
                margin: 0 1px;
                background-color: #9E9EA1;
                display: block;
                border-radius: 50%;
                opacity: 0.4;
                animation: blink 1s infinite;
            }
            
            .typing-indicator span:nth-of-type(1) {
                animation-delay: 0s;
            }
            
            .typing-indicator span:nth-of-type(2) {
                animation-delay: 0.2s;
            }
            
            .typing-indicator span:nth-of-type(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes blink {
                0% {
                    opacity: 0.4;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    opacity: 0.4;
                }
            }
        </style>
    `;
    
    // Append HTML and styles to document
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    document.head.insertAdjacentHTML('beforeend', chatbotStyles);
}

function initChatbot() {
    // Get DOM elements
    const chatbotTrigger = document.querySelector('.chatbot-trigger');
    const chatbotBox = document.querySelector('.chatbot-box');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-message-input');
    const chatbotSend = document.getElementById('chatbot-send');
    
    // Toggle chatbot visibility
    chatbotTrigger.addEventListener('click', function() {
        chatbotBox.classList.toggle('active');
        if (chatbotBox.classList.contains('active')) {
            chatbotInput.focus();
        }
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', function() {
        chatbotBox.classList.remove('active');
    });
    
    // Handle quick reply buttons
    const quickReplyButtons = document.querySelectorAll('.quick-reply-btn');
    quickReplyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent;
            sendUserMessage(text);
        });
    });
    
    // Send message with button
    chatbotSend.addEventListener('click', function() {
        sendMessage();
    });
    
    // Send message with Enter key
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Function to send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            sendUserMessage(message);
            chatbotInput.value = '';
        }
    }
    
    // Add user message and get bot response
    function sendUserMessage(text) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `<p>${text}</p>`;
        chatbotMessages.appendChild(userMessage);
        
        // Remove any existing quick replies
        const existingReplies = chatbotMessages.querySelector('.quick-replies');
        if (existingReplies) {
            existingReplies.remove();
        }
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process response after delay
        setTimeout(function() {
            // Get bot response
            const response = getBotResponse(text);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add bot message
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.innerHTML = `<p>${response.text}</p>`;
            chatbotMessages.appendChild(botMessage);
            
            // Add quick replies if available
            if (response.quickReplies && response.quickReplies.length > 0) {
                const quickRepliesDiv = document.createElement('div');
                quickRepliesDiv.className = 'quick-replies';
                
                response.quickReplies.forEach(reply => {
                    const button = document.createElement('button');
                    button.className = 'quick-reply-btn';
                    button.textContent = reply;
                    button.addEventListener('click', function() {
                        sendUserMessage(reply);
                    });
                    quickRepliesDiv.appendChild(button);
                });
                
                chatbotMessages.appendChild(quickRepliesDiv);
            }
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 1000);
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = chatbotMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Get bot response based on user input
    function getBotResponse(input) {
        // Convert to lowercase for easier matching
        input = input.toLowerCase();
        
        // Product Info responses
        if (input.includes('product') || input.includes('info')) {
            return {
                text: "We offer a complete range of fertilizers including NPK blends, organic options, and specialty formulations. What crops are you growing?",
                quickReplies: ["Grains/Cereals", "Fruits/Vegetables", "Organic Farming"]
            };
        }
        
        // Best Fertilizers responses
        else if (input.includes('best') || input.includes('recommend') || input.includes('top')) {
            return {
                text: "Our bestselling fertilizers include Premium NPK 10-26-26 for general use, Ultra Pure Urea 46-0-0 for nitrogen needs, and Organic Vermicompost for organic growers. Which would you like to know more about?",
                quickReplies: ["NPK Details", "Urea Info", "Organic Options"]
            };
        }
        
        // Pricing responses
        else if (input.includes('price') || input.includes('cost') || input.includes('how much')) {
            return {
                text: "Our fertilizer prices start from ₹550 for Organic Vermicompost, ₹850 for Urea, and ₹1,450 for Premium NPK blends. We offer discounts on bulk orders. Would you like a detailed price list?",
                quickReplies: ["Full Price List", "Get a Quote", "Bulk Pricing"]
            };
        }
        
        // Soil Testing responses
        else if (input.includes('soil') || input.includes('test')) {
            return {
                text: "We offer comprehensive soil testing for ₹45 per sample. Our analysis includes NPK levels, pH, organic matter, and micronutrient profiling. Based on results, we recommend personalized fertilizer programs.",
                quickReplies: ["How to Sample", "Test Results", "Order Test Kit"]
            };
        }
        
        // Grains/Cereals responses
        else if (input.includes('grain') || input.includes('cereal') || input.includes('wheat') || input.includes('rice')) {
            return {
                text: "For grain crops, we recommend our balanced NPK fertilizers. Our Premium Grain Blend (15-15-15) includes essential micronutrients for maximum yield. Application rate is 150-200 kg/hectare.",
                quickReplies: ["Wheat Specific", "Rice Specific", "Corn Specific", "Application Tips"]
            };
        }
        
        // Fruits/Vegetables responses
        else if (input.includes('fruit') || input.includes('vegetable')) {
            return {
                text: "For fruits and vegetables, we recommend our Harvest Rich series with higher potassium. Our Vegetable Special (8-16-24) and Fruit Tree Formula (10-10-30) promote better quality and yield.",
                quickReplies: ["Vegetable Tips", "Fruit Trees", "Berry Crops", "Application Rates"]
            };
        }
        
        // Organic Farming responses
        else if (input.includes('organic')) {
            return {
                text: "Our organic line includes OMRI-certified Vermicompost, Bone Meal, Neem Cake, and Liquid Seaweed Extract. All meet strict organic standards and support soil health.",
                quickReplies: ["Organic Vegetables", "Organic Fruits", "Certification", "Pricing"]
            };
        }
        
        // Application methods
        else if (input.includes('apply') || input.includes('application') || input.includes('how to use')) {
            return {
                text: "Most granular fertilizers can be broadcast, banded, or side-dressed. Liquid fertilizers can be foliar applied or through irrigation. We recommend soil testing before application for optimal results.",
                quickReplies: ["Broadcasting", "Banding", "Foliar Application", "Soil Testing"]
            };
        }
        
        // Quote request
        else if (input.includes('quote')) {
            return {
                text: "For a personalized quote, please tell us about your farm size, crop type, and location. This helps us calculate appropriate quantities and delivery costs.",
                quickReplies: ["Small Farm", "Medium Farm", "Large Farm", "Contact Team"]
            };
        }
        
        // Contact responses
        else if (input.includes('contact') || input.includes('speak') || input.includes('call')) {
            return {
                text: "You can reach our team at +91 7013384658 Monday through Saturday, 9:00 AM - 6:00 PM, or email CompleteFertility@gmail.com. Would you like us to have someone call you?",
                quickReplies: ["Request Callback", "Email Support", "Visit Dealer"]
            };
        }
        
        // Greetings
        else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return {
                text: "Hello! I'm here to help with your farming and fertilizer needs. What information can I provide you today?",
                quickReplies: ["Product Info", "Best Fertilizers", "Pricing", "Soil Testing"]
            };
        }
        
        // Thank you responses
        else if (input.includes('thank')) {
            return {
                text: "You're welcome! I'm glad I could help. Is there anything else you'd like to know about our fertilizers or services?",
                quickReplies: ["More Questions", "Contact Team", "End Chat"]
            };
        }
        
        // Closing
        else if (input.includes('bye') || input.includes('goodbye') || input.includes('end chat')) {
            return {
                text: "Thank you for chatting with Complete Fertility! Have a great day and a successful growing season. Feel free to return if you have more questions!",
                quickReplies: ["Restart", "Visit Website"]
            };
        }
        
        // Default fallback
        else {
            return {
                text: "I'm here to help with fertilizer and soil health questions. Could you please specify what information you're looking for?",
                quickReplies: ["Product Info", "Best Fertilizers", "Pricing", "Soil Testing", "Contact Team"]
            };
        }
    }
}
