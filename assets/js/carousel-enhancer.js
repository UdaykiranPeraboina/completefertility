/**
 * Carousel Enhancer
 * Additional functionality for the Complete Fertility carousel
 */

document.addEventListener('DOMContentLoaded', () => {
    initEnhancedCarousel();
});

/**
 * Initialize enhanced carousel features
 */
function initEnhancedCarousel() {
    const carousel = document.getElementById('heroCarousel');
    
    if (!carousel) return;
    
    // First, initialize the carousel with proper settings
    $(carousel).carousel({
        interval: 8000,
        pause: 'hover',
        wrap: true, // Ensure carousel loops around
        keyboard: true // Enable keyboard navigation
    });
    
    // Fix carousel navigation - completely override the default behavior
    const prevButton = carousel.querySelector('.carousel-control-prev');
    const nextButton = carousel.querySelector('.carousel-control-next');
    
    if (prevButton) {
        // Remove any existing event listeners
        const prevClone = prevButton.cloneNode(true);
        prevButton.parentNode.replaceChild(prevClone, prevButton);
        
        prevClone.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(carousel).carousel('prev');
            return false;
        });
    }
    
    if (nextButton) {
        // Remove any existing event listeners
        const nextClone = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(nextClone, nextButton);
        
        nextClone.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(carousel).carousel('next');
            return false;
        });
    }
    
    // Also fix indicator clicks
    const indicators = carousel.querySelectorAll('.carousel-indicators li');
    indicators.forEach(indicator => {
        const indicatorClone = indicator.cloneNode(true);
        indicator.parentNode.replaceChild(indicatorClone, indicator);
        
        indicatorClone.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const slideIndex = this.getAttribute('data-slide-to');
            $(carousel).carousel(parseInt(slideIndex));
            return false;
        });
    });
    
    // Track carousel events
    carousel.addEventListener('slide.bs.carousel', function(e) {
        console.log('Sliding from slide', e.from, 'to slide', e.to);
        const items = carousel.querySelectorAll('.carousel-item');
        
        // Reset animations on all slides
        items.forEach(item => {
            const animatedElements = item.querySelectorAll('.animated');
            animatedElements.forEach(el => {
                el.style.opacity = '0';
            });
        });
    });
    
    // After slide completes, trigger animations
    carousel.addEventListener('slid.bs.carousel', function(e) {
        console.log('Completed slide to', e.to);
        const activeSlide = carousel.querySelector('.carousel-item.active');
        
        if (activeSlide) {
            // Delay each animated element
            const animatedElements = activeSlide.querySelectorAll('.animated');
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 100 * (index + 1));
            });
        }
    });
    
    // Pause on hover
    const pauseOnHover = () => {
        carousel.addEventListener('mouseenter', () => {
            $(carousel).carousel('pause');
        });
        
        carousel.addEventListener('mouseleave', () => {
            $(carousel).carousel('cycle');
        });
    };
    
    // Add swipe support for mobile
    const enableSwipe = () => {
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        const handleSwipe = () => {
            const threshold = 50; // Minimum distance traveled for swipe
            
            if (touchEndX < touchStartX - threshold) {
                // Swipe left, go to next slide
                $(carousel).carousel('next');
            }
            
            if (touchEndX > touchStartX + threshold) {
                // Swipe right, go to previous slide
                $(carousel).carousel('prev');
            }
        };
    };
    
    // Keyboard navigation
    const enableKeyboardNav = () => {
        document.addEventListener('keydown', e => {
            // Only if carousel is in viewport
            const rect = carousel.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isInViewport) {
                if (e.key === 'ArrowLeft') {
                    $(carousel).carousel('prev');
                }
                
                if (e.key === 'ArrowRight') {
                    $(carousel).carousel('next');
                }
            }
        });
    };
    
    // Initialize features
    pauseOnHover();
    enableSwipe();
    enableKeyboardNav();
    
    // Ensure animations work on first slide
    setTimeout(() => {
        const activeSlide = carousel.querySelector('.carousel-item.active');
        if (activeSlide) {
            const animatedElements = activeSlide.querySelectorAll('.animated');
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 100 * (index + 1));
            });
        }
    }, 500);
    
    // Fix any href attributes that might cause navigation
    const carouselControls = carousel.querySelectorAll('.carousel-control-prev, .carousel-control-next');
    carouselControls.forEach(control => {
        if (control.hasAttribute('href')) {
            control.setAttribute('href', 'javascript:void(0);');
        }
    });
    
    console.log('Carousel enhanced successfully');
} 