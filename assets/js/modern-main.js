/**
 * Complete Fertility - Modern JavaScript
 * Enhanced UI interactions and animations
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initAnimations();
    initProductFilters();
    initCart();
    initChatWidget();
    initFAQAccordion();
    initNewsletterForm();
    initContactForm();
    initCarousels();
    initNavbarScroll();
    initCartSidebar();
    initHeroParallax();
    initBackToTop();
    setActiveNavLink();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('fixed-top');
            document.body.style.paddingTop = navbar.offsetHeight + 'px';
        } else {
            navbar.classList.remove('fixed-top');
            document.body.style.paddingTop = '0';
        }
    });

    // Mobile menu toggle
    if (navbarToggler) {
        navbarToggler.addEventListener('click', () => {
            navbarToggler.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbarCollapse && navbarCollapse.classList.contains('show') &&
            !navbarCollapse.contains(e.target) && 
            !navbarToggler.contains(e.target)) {
            // Use Bootstrap's collapse method
            $(navbarCollapse).collapse('hide');
            navbarToggler.classList.remove('active');
        }
    });

    // Active link highlighting
    navLinks.forEach(link => {
        if (link.getAttribute('href') === window.location.pathname.split('/').pop() ||
            (link.getAttribute('href') === 'index.html' && (window.location.pathname === '/' || window.location.pathname.endsWith('/')))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Initialize animations and scroll effects
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animated');

    // Function to check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    };

    // Initial check for elements in viewport
    animatedElements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('fade-in');
        }
    });

    // Check on scroll
    window.addEventListener('scroll', () => {
        animatedElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('fade-in')) {
                element.classList.add('fade-in');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Product filtering functionality
 */
function initProductFilters() {
    const filterBtns = document.querySelectorAll('[data-toggle="pill"]');
    const searchInput = document.querySelector('.products-filter input[type="text"]');
    
    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
            });
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const category = card.querySelector('.product-category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Shopping cart functionality
 */
function initCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartClose = document.querySelector('.cart-close');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total-value');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart UI
    const updateCartUI = () => {
        if (cartItems && cartCount && cartTotal) {
            // Update cart count
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
            
            // Update cart total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `₹${total.toFixed(2)}`;
            
            // Update cart items
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
            } else {
                cart.forEach((item, index) => {
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');
                    cartItem.innerHTML = `
                        <div class="cart-item-img">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-info">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                            <div class="cart-item-qty">
                                <button class="cart-qty-btn minus" data-index="${index}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="cart-qty-value">${item.quantity}</span>
                                <button class="cart-qty-btn plus" data-index="${index}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    cartItems.appendChild(cartItem);
                });
                
                // Add event listeners to cart item buttons
                document.querySelectorAll('.cart-qty-btn.minus').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.dataset.index);
                        if (cart[index].quantity > 1) {
                            cart[index].quantity--;
                        } else {
                            cart.splice(index, 1);
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartUI();
                    });
                });
                
                document.querySelectorAll('.cart-qty-btn.plus').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.dataset.index);
                        cart[index].quantity++;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartUI();
                    });
                });
                
                document.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.dataset.index);
                        cart.splice(index, 1);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartUI();
                    });
                });
            }
        }
    };
    
    // Toggle cart sidebar
    const toggleCart = () => {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };
    
    // Add event listeners
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', toggleCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.product-card');
            if (!card) return;
            
            const id = card.dataset.id;
            const name = card.querySelector('.product-title').textContent;
            const image = card.querySelector('.product-thumb img').src;
            const priceText = card.querySelector('.product-price .current').textContent;
            const price = parseFloat(priceText.replace('₹', ''));
            
            // Check if item is already in cart
            const existingItemIndex = cart.findIndex(item => item.id === id);
            
            if (existingItemIndex !== -1) {
                // Item already in cart, increase quantity
                cart[existingItemIndex].quantity++;
            } else {
                // Add new item to cart
                cart.push({
                    id,
                    name,
                    image,
                    price,
                    quantity: 1
                });
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartUI();
            
            // Show notification
            showNotification(`${name} added to cart!`);
            
            // Optionally open cart
            toggleCart();
        });
    });
    
    // Initialize cart UI
    updateCartUI();
}

/**
 * Show notification
 */
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('notification');
        document.body.appendChild(notification);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Chat widget functionality
 */
function initChatWidget() {
    const chatButton = document.querySelector('.chat-button');
    const chatContainer = document.querySelector('.chat-container');
    const chatClose = document.querySelector('.chat-close');
    const chatInput = document.querySelector('.chat-input');
    const chatSend = document.querySelector('.chat-send');
    const chatBody = document.querySelector('.chat-body');
    
    if (!chatButton || !chatContainer) return;
    
    // Toggle chat widget
    const toggleChat = () => {
        chatContainer.classList.toggle('active');
        
        if (chatContainer.classList.contains('active') && chatBody.children.length === 0) {
            // Add initial message
            addChatMessage('Hello! 👋 How can we help you today?', 'incoming');
            
            // Focus on input
            chatInput.focus();
        }
    };
    
    // Add chat message
    const addChatMessage = (message, type) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', type);
        
        const bubbleElement = document.createElement('div');
        bubbleElement.classList.add('chat-bubble');
        bubbleElement.textContent = message;
        
        messageElement.appendChild(bubbleElement);
        chatBody.appendChild(messageElement);
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    };
    
    // Send chat message
    const sendChatMessage = () => {
        const message = chatInput.value.trim();
        
        if (message) {
            // Add user message
            addChatMessage(message, 'outgoing');
            
            // Clear input
            chatInput.value = '';
            
            // Simulate response (in real app, this would be an API call)
            setTimeout(() => {
                let response = 'Thank you for your message. Our team will get back to you shortly.';
                
                // Simple keyword responses
                if (message.toLowerCase().includes('pricing') || message.toLowerCase().includes('cost')) {
                    response = 'Our pricing depends on the product and quantity. Please check our products page or contact our sales team at +91 7013384658.';
                } else if (message.toLowerCase().includes('delivery') || message.toLowerCase().includes('shipping')) {
                    response = 'We deliver across India. Delivery time typically ranges from 2-5 business days depending on your location.';
                } else if (message.toLowerCase().includes('order') && message.toLowerCase().includes('place')) {
                    response = 'You can place an order through our website by adding products to your cart and proceeding to checkout, or by calling our customer service.';
                }
                
                addChatMessage(response, 'incoming');
            }, 1000);
        }
    };
    
    // Event listeners
    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    
    chatSend.addEventListener('click', sendChatMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

/**
 * FAQ accordion functionality
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-question');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle icon
            if (icon) {
                icon.classList.toggle('fa-plus');
                icon.classList.toggle('fa-minus');
            }
            
            // Toggle answer visibility
            if (answer) {
                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });
}

/**
 * Newsletter form functionality
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // In a real application, this would send data to a server
                emailInput.value = '';
                showNotification('Thank you for subscribing to our newsletter!');
            } else {
                showNotification('Please enter a valid email address.');
            }
        });
    }
}

/**
 * Contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Email validation
            const emailField = this.querySelector('#email');
            if (emailField && emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
                isValid = false;
                emailField.classList.add('is-invalid');
            }
            
            if (isValid) {
                // In a real application, this would send data to a server
                
                // Reset form
                this.reset();
                
                // Show success message
                showNotification('Thank you for your message. We\'ll get back to you soon!');
            } else {
                showNotification('Please fill out all required fields correctly.');
            }
        });
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Initialize carousels
 */
function initCarousels() {
    // For Bootstrap carousels
    const carousels = document.querySelectorAll('.carousel');
    
    if (carousels.length && typeof bootstrap !== 'undefined') {
        carousels.forEach(carousel => {
            new bootstrap.Carousel(carousel, {
                interval: 5000,
                touch: true
            });
        });
    }
}

/**
 * Initialize navbar scroll behavior
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbar) {
        // Add fixed navbar on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('fixed-top', 'scrolled');
            } else {
                if (!navbarToggler.classList.contains('active')) {
                    navbar.classList.remove('scrolled');
                }
            }
        });
        
        // Toggle navbar on mobile
        if (navbarToggler) {
            navbarToggler.addEventListener('click', () => {
                navbarToggler.classList.toggle('active');
                navbar.classList.toggle('scrolled');
            });
        }
    }
}

/**
 * Initialize cart sidebar
 */
function initCartSidebar() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartClose = document.querySelector('.cart-close');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }
}

/**
 * Initialize parallax effect for hero section
 */
function initHeroParallax() {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            
            if (scrollPosition <= window.innerHeight) {
                const translateY = scrollPosition * 0.3;
                heroSection.style.backgroundPositionY = `calc(50% + ${translateY}px)`;
            }
        });
    }
}

/**
 * Set active nav link based on current page URL
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Remove all active classes first
        link.classList.remove('active');
        
        // Get href attribute
        const href = link.getAttribute('href');
        
        // Skip search and cart icons
        if (href === '#search' || href === '#cart') return;
        
        // Check if href matches current page
        if (href === currentPage) {
            link.classList.add('active');
        }
        
        // Special case for index.html / home page
        if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
            if (href === 'index.html' || href === './') {
                link.classList.add('active');
            }
        }
    });
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
} 