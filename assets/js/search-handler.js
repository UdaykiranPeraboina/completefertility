/**
 * Search Handler for Complete Fertility Website
 * Manages search form submissions and validation
 */

document.addEventListener('DOMContentLoaded', () => {
    initSearchFunctionality();
});

/**
 * Initialize search functionality
 */
function initSearchFunctionality() {
    const searchModal = document.getElementById('searchModal');
    const searchForms = document.querySelectorAll('.search-bar form');
    const searchInputs = document.querySelectorAll('.search-bar input[type="text"]');
    
    if (!searchForms.length) return;
    
    // Handle form submissions
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const input = this.querySelector('input[type="text"]');
            
            // Validate search query
            if (!input || !input.value.trim()) {
                e.preventDefault();
                showSearchError(input, 'Please enter a search term');
                return;
            }
            
            // Store search term in session storage for results page
            sessionStorage.setItem('searchQuery', input.value.trim());
            
            // If we're on products page already, prevent default and trigger search directly
            if (window.location.pathname.includes('products.html')) {
                e.preventDefault();
                filterProductsBySearch(input.value.trim());
                
                if (searchModal) {
                    $('#searchModal').modal('hide');
                }
            }
        });
    });
    
    // Clear error state on input focus
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.remove('is-invalid');
            const errorElement = this.parentElement.querySelector('.invalid-feedback');
            if (errorElement) {
                errorElement.remove();
            }
        });
    });
    
    // Check for existing search query when loading products page
    if (window.location.pathname.includes('products.html')) {
        const searchQuery = sessionStorage.getItem('searchQuery');
        if (searchQuery) {
            // Update search input
            searchInputs.forEach(input => {
                input.value = searchQuery;
            });
            
            // Apply filter
            filterProductsBySearch(searchQuery);
            
            // Create clear search button if it doesn't exist
            if (!document.querySelector('.clear-search')) {
                const searchContainer = document.querySelector('.products-filter');
                if (searchContainer) {
                    const clearBtn = document.createElement('button');
                    clearBtn.className = 'btn btn-sm btn-outline-secondary clear-search';
                    clearBtn.innerHTML = 'Clear Search <i class="fas fa-times"></i>';
                    clearBtn.addEventListener('click', clearSearch);
                    searchContainer.appendChild(clearBtn);
                }
            }
        }
    }
}

/**
 * Display error message for search input
 */
function showSearchError(inputElement, message) {
    inputElement.classList.add('is-invalid');
    
    // Remove existing error messages
    const existingError = inputElement.parentElement.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'invalid-feedback';
    errorElement.textContent = message;
    
    // Insert after input
    inputElement.parentElement.appendChild(errorElement);
    
    // Focus input
    inputElement.focus();
}

/**
 * Filter products based on search query
 */
function filterProductsBySearch(query) {
    query = query.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    let resultsCount = 0;
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const category = card.querySelector('.product-category').textContent.toLowerCase();
        const isMatch = title.includes(query) || category.includes(query);
        
        if (isMatch) {
            card.style.display = '';
            resultsCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show or create results message
    updateSearchResultsMessage(resultsCount, query);
}

/**
 * Update search results message
 */
function updateSearchResultsMessage(count, query) {
    const productsContainer = document.querySelector('.products-container') || document.querySelector('.row');
    let resultsMessage = document.querySelector('.search-results-message');
    
    if (!resultsMessage) {
        resultsMessage = document.createElement('div');
        resultsMessage.className = 'search-results-message alert';
        if (productsContainer) {
            productsContainer.insertBefore(resultsMessage, productsContainer.firstChild);
        }
    }
    
    if (count > 0) {
        resultsMessage.className = 'search-results-message alert alert-success';
        resultsMessage.innerHTML = `<i class="fas fa-check-circle"></i> Found ${count} result${count !== 1 ? 's' : ''} for "${query}"`;
    } else {
        resultsMessage.className = 'search-results-message alert alert-warning';
        resultsMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> No products found matching "${query}"`;
    }
}

/**
 * Clear search and reset product display
 */
function clearSearch() {
    // Clear stored search
    sessionStorage.removeItem('searchQuery');
    
    // Reset input fields
    const searchInputs = document.querySelectorAll('.search-bar input[type="text"]');
    searchInputs.forEach(input => {
        input.value = '';
    });
    
    // Reset product visibility
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = '';
    });
    
    // Remove search message
    const resultsMessage = document.querySelector('.search-results-message');
    if (resultsMessage) {
        resultsMessage.remove();
    }
    
    // Remove clear button
    const clearBtn = document.querySelector('.clear-search');
    if (clearBtn) {
        clearBtn.remove();
    }
} 