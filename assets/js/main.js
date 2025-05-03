/**
 * Complete Fertility - Main JavaScript
 */

// DOM Elements
const body = document.body;
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const chatButton = document.querySelector('.chat-button');
const chatContainer = document.querySelector('.chat-container');
const chatClose = document.querySelector('.chat-close');
const chatInput = document.querySelector('.chat-input');
const chatSend = document.querySelector('.chat-send');
const chatBody = document.querySelector('.chat-body');
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const cartClose = document.querySelector('.cart-close');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total-value');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let activeSection = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Navigation
    window.addEventListener('scroll', handleScroll);
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });

    // Chat Widget
    if (chatButton) {
        chatButton.addEventListener('click', toggleChat);
    }
    if (chatClose) {
        chatClose.addEventListener('click', toggleChat);
    }
    if (chatSend) {
        chatSend.addEventListener('click', sendChatMessage);
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Cart Sidebar
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    if (cartClose) {
        cartClose.addEventListener('click', toggleCart);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }
    
    // Add to Cart Buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Initialize Cart
    updateCartUI();
    
    // Initialize Sliders/Carousels
    initCarousels();
    
    // Set initial active section
    if (sections.length > 0) {
        activeSection = sections[0].id;
        highlightActiveNavItem();
    }
    
    // Initialize animations
    initAnimations();
}

/**
 * Handle the scroll event
 */
function handleScroll() {
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
    
    // Update active section based on scroll position
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    if (currentSection !== activeSection && currentSection !== '') {
        activeSection = currentSection;
        highlightActiveNavItem();
    }
}

/**
 * Highlight the active nav item based on the current section
 */
function highlightActiveNavItem() {
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href && href.includes(activeSection)) {
            link.classList.add('active');
        }
    });
}

/**
 * Handle navigation link click
 * @param {Event} e - Click event
 */
function handleNavLinkClick(e) {
    const href = this.getAttribute('href');
    
    if (href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active section
            activeSection = targetId;
            highlightActiveNavItem();
        }
    }
}

/**
 * Initialize carousels/sliders
 */
function initCarousels() {
    // Hero Carousel
    const heroCarousel = document.querySelector('#heroCarousel');
    if (heroCarousel) {
        new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            pause: 'hover'
        });
    }
    
    // Products Carousel
    const productsCarousel = document.querySelector('#productsCarousel');
    if (productsCarousel) {
        new bootstrap.Carousel(productsCarousel, {
            interval: false
        });
    }
    
    // Testimonials Carousel
    const testimonialsCarousel = document.querySelector('#testimonialsCarousel');
    if (testimonialsCarousel) {
        new bootstrap.Carousel(testimonialsCarousel, {
            interval: 4000
        });
    }
}

/**
 * Initialize animations
 */
function initAnimations() {
    // Animate on scroll
    const animatedElements = document.querySelectorAll('.animated');
    
    // Initial check
    animatedElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('fadeIn');
        }
    });
    
    // Scroll check
    window.addEventListener('scroll', () => {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('fadeIn')) {
                element.classList.add('fadeIn');
            }
        });
    });
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in the viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

/**
 * Toggle the chat widget
 */
function toggleChat() {
    chatContainer.style.display = chatContainer.style.display === 'block' ? 'none' : 'block';
    
    if (chatContainer.style.display === 'block') {
        // Show initial message
        if (chatBody.children.length === 0) {
            addChatMessage('Hello! 👋 How can we help you today?', 'incoming');
        }
        
        // Focus on input
        chatInput.focus();
    }
}

/**
 * Send a chat message
 */
function sendChatMessage() {
    const message = chatInput.value.trim();
    
    if (message !== '') {
        // Add user message
        addChatMessage(message, 'outgoing');
        
        // Clear input
        chatInput.value = '';
        
        // Simulate response (in a real app, you would send the message to a server/API)
        setTimeout(() => {
            // Simulate typing
            const typingMessage = addChatMessage('<em>Typing...</em>', 'incoming');
            
            setTimeout(() => {
                // Remove typing message
                chatBody.removeChild(typingMessage);
                
                // Add response
                let response = 'Thank you for reaching out! One of our executives will connect with you shortly. Meanwhile, can you please tell us what specific information you are looking for?';
                
                // Simple keyword based responses
                if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
                    response = 'Our products are priced competitively to ensure affordability for farmers. For specific pricing information, please check the product details page or contact our sales team.';
                } else if (message.toLowerCase().includes('delivery') || message.toLowerCase().includes('shipping')) {
                    response = 'We offer delivery services to most locations. Delivery times typically range from 2-5 business days depending on your location.';
                } else if (message.toLowerCase().includes('discount') || message.toLowerCase().includes('offer')) {
                    response = 'We frequently run special offers for our customers. Currently, we are offering a 10% discount on bulk orders. Check our promotions page for more details.';
                } else if (message.toLowerCase().includes('product') || message.toLowerCase().includes('fertilizer')) {
                    response = 'We offer a variety of fertilizers and agricultural products designed to boost crop yield and soil health. Can you specify which type of product you are interested in?';
                }
                
                addChatMessage(response, 'incoming');
            }, 1500);
        }, 500);
    }
}

/**
 * Add a message to the chat body
 * @param {string} message - The message text
 * @param {string} type - The message type ('incoming' or 'outgoing')
 * @returns {HTMLElement} - The message element
 */
function addChatMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${type}`;
    
    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'chat-bubble';
    bubbleEl.innerHTML = message;
    
    messageEl.appendChild(bubbleEl);
    chatBody.appendChild(messageEl);
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
    
    return messageEl;
}

/**
 * Toggle the cart sidebar
 */
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    
    // Disable body scroll when cart is open
    if (cartSidebar.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = '';
    }
}

/**
 * Handle adding a product to cart
 * @param {Event} e - Click event
 */
function handleAddToCart(e) {
    e.preventDefault();
    
    const productCard = this.closest('.product-card');
    
    if (productCard) {
        const productId = productCard.dataset.id;
        const productName = productCard.querySelector('.product-title').textContent;
        const productPrice = parseFloat(productCard.querySelector('.product-price .current').textContent.replace(/[^\d.]/g, ''));
        const productImage = productCard.querySelector('.product-thumb img').src;
        
        // Check if product is already in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex > -1) {
            // Product exists in cart, increment quantity
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartUI();
        
        // Show notification
        showNotification(`${productName} added to cart!`);
        
        // Open cart sidebar
        toggleCart();
    }
}

/**
 * Update the cart UI
 */
function updateCartUI() {
    // Update cart icon count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
    
    // Update cart items list
    if (cartItemsList) {
        cartItemsList.innerHTML = '';
        
        if (cart.length === 0) {
            // Cart is empty
            cartItemsList.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Your cart is empty</p>
                    <a href="#products" class="btn btn-primary">Shop Now</a>
                </div>
            `;
        } else {
            // Cart has items
            cart.forEach(item => {
                const cartItemEl = document.createElement('div');
                cartItemEl.className = 'cart-item';
                cartItemEl.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                        <div class="cart-item-qty">
                            <button class="cart-qty-btn minus" data-id="${item.id}">-</button>
                            <span class="cart-qty-value">${item.quantity}</span>
                            <button class="cart-qty-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                cartItemsList.appendChild(cartItemEl);
            });
            
            // Add event listeners for quantity buttons and remove buttons
            const minusButtons = cartItemsList.querySelectorAll('.cart-qty-btn.minus');
            const plusButtons = cartItemsList.querySelectorAll('.cart-qty-btn.plus');
            const removeButtons = cartItemsList.querySelectorAll('.cart-item-remove');
            
            minusButtons.forEach(button => {
                button.addEventListener('click', decreaseCartItemQuantity);
            });
            
            plusButtons.forEach(button => {
                button.addEventListener('click', increaseCartItemQuantity);
            });
            
            removeButtons.forEach(button => {
                button.addEventListener('click', removeCartItem);
            });
        }
    }
    
    // Update cart total
    if (cartTotal) {
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotal.textContent = `₹${totalPrice.toFixed(2)}`;
    }
}

/**
 * Decrease the quantity of a cart item
 */
function decreaseCartItemQuantity() {
    const itemId = this.dataset.id;
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            // Decrease quantity
            cart[itemIndex].quantity -= 1;
        } else {
            // Remove item if quantity would be 0
            cart.splice(itemIndex, 1);
        }
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartUI();
    }
}

/**
 * Increase the quantity of a cart item
 */
function increaseCartItemQuantity() {
    const itemId = this.dataset.id;
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        // Increase quantity
        cart[itemIndex].quantity += 1;
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartUI();
    }
}

/**
 * Remove an item from the cart
 */
function removeCartItem() {
    const itemId = this.dataset.id;
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        // Remove item
        cart.splice(itemIndex, 1);
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartUI();
    }
}

/**
 * Show a notification
 * @param {string} message - The notification message
 */
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notificationEl = document.querySelector('.notification');
    
    if (!notificationEl) {
        notificationEl = document.createElement('div');
        notificationEl.className = 'notification';
        body.appendChild(notificationEl);
    }
    
    // Set message
    notificationEl.textContent = message;
    
    // Show notification
    notificationEl.classList.add('active');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notificationEl.classList.remove('active');
    }, 3000);
}

/**
 * Display content for a specific section
 * @param {string} sectionId - The ID of the section to display
 */
function display(sectionId) {
    // Hide all sections
    const allSections = document.querySelectorAll('[id^="section"]');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        
        // Scroll to top of section
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
} 