/**
 * Advanced Product Filtering System
 * Complete Fertility Website
 */

document.addEventListener('DOMContentLoaded', () => {
    initProductFilters();
});

/**
 * Initialize product filtering functionality
 */
function initProductFilters() {
    const filterBtns = document.querySelectorAll('.product-filter-btn');
    const priceRangeSlider = document.getElementById('price-range');
    const priceRangeValue = document.getElementById('price-range-value');
    const searchInput = document.querySelector('.products-search-input');
    const productsGrid = document.querySelector('.products-grid');
    const productsContainer = document.querySelector('.products-container');
    const productCards = document.querySelectorAll('.product-card');
    const sortSelect = document.getElementById('sort-products');
    const filtersForm = document.getElementById('products-filters-form');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    const filterReset = document.querySelector('.filter-reset');
    
    let activeFilters = {
        category: 'all',
        minPrice: 0,
        maxPrice: 5000,
        search: '',
        tags: [],
        sort: 'default'
    };
    
    // Category filter buttons
    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update active filter
                activeFilters.category = this.dataset.category;
                
                // Apply filters
                applyFilters();
            });
        });
    }
    
    // Price range slider
    if (priceRangeSlider && priceRangeValue) {
        priceRangeSlider.addEventListener('input', function() {
            const value = this.value;
            priceRangeValue.textContent = `₹${value}`;
            
            // Update active filter
            activeFilters.maxPrice = parseInt(value);
            
            // Apply filters
            applyFilters();
        });
    }
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Update active filter
            activeFilters.search = this.value.toLowerCase();
            
            // Apply filters
            applyFilters();
        });
    }
    
    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // Update active filter
            activeFilters.sort = this.value;
            
            // Apply filters
            applyFilters();
        });
    }
    
    // Filter checkboxes (tags)
    if (filterCheckboxes.length) {
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const tag = this.value;
                
                if (this.checked) {
                    // Add tag to active filters
                    activeFilters.tags.push(tag);
                } else {
                    // Remove tag from active filters
                    activeFilters.tags = activeFilters.tags.filter(t => t !== tag);
                }
                
                // Apply filters
                applyFilters();
            });
        });
    }
    
    // Filter reset button
    if (filterReset) {
        filterReset.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Reset active filters
            activeFilters = {
                category: 'all',
                minPrice: 0,
                maxPrice: 5000,
                search: '',
                tags: [],
                sort: 'default'
            };
            
            // Reset UI
            filterBtns.forEach(btn => {
                if (btn.dataset.category === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            if (priceRangeSlider) {
                priceRangeSlider.value = 5000;
                priceRangeValue.textContent = '₹5000';
            }
            
            if (searchInput) {
                searchInput.value = '';
            }
            
            if (sortSelect) {
                sortSelect.value = 'default';
            }
            
            if (filterCheckboxes.length) {
                filterCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
            }
            
            // Apply filters
            applyFilters();
        });
    }
    
    // Apply filters function
    function applyFilters() {
        if (!productCards.length) return;
        
        // Show loading state
        if (productsContainer) {
            productsContainer.classList.add('loading');
        }
        
        // Delay to show loading animation
        setTimeout(() => {
            let visibleCount = 0;
            
            productCards.forEach(card => {
                // Get card data
                const id = card.dataset.id;
                const category = card.dataset.category;
                const price = parseInt(card.dataset.price.replace('₹', ''));
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const tags = card.dataset.tags ? card.dataset.tags.split(',') : [];
                
                // Check if card matches all active filters
                let isVisible = true;
                
                // Category filter
                if (activeFilters.category !== 'all' && category !== activeFilters.category) {
                    isVisible = false;
                }
                
                // Price filter
                if (price < activeFilters.minPrice || price > activeFilters.maxPrice) {
                    isVisible = false;
                }
                
                // Search filter
                if (activeFilters.search && !title.includes(activeFilters.search)) {
                    isVisible = false;
                }
                
                // Tags filter
                if (activeFilters.tags.length > 0) {
                    const hasAllTags = activeFilters.tags.every(tag => tags.includes(tag));
                    if (!hasAllTags) {
                        isVisible = false;
                    }
                }
                
                // Show/hide card
                if (isVisible) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Sort visible products
            if (activeFilters.sort !== 'default' && productsGrid) {
                const visibleCards = Array.from(productCards).filter(card => card.style.display !== 'none');
                
                visibleCards.sort((a, b) => {
                    const priceA = parseInt(a.dataset.price.replace('₹', ''));
                    const priceB = parseInt(b.dataset.price.replace('₹', ''));
                    
                    if (activeFilters.sort === 'price-low-high') {
                        return priceA - priceB;
                    } else if (activeFilters.sort === 'price-high-low') {
                        return priceB - priceA;
                    }
                    
                    return 0;
                });
                
                // Reorder cards in DOM
                visibleCards.forEach(card => {
                    productsGrid.appendChild(card);
                });
            }
            
            // Show no results message if no products visible
            const noResultsMessage = document.querySelector('.no-products-found');
            
            if (noResultsMessage) {
                if (visibleCount === 0) {
                    noResultsMessage.style.display = 'block';
                } else {
                    noResultsMessage.style.display = 'none';
                }
            }
            
            // Remove loading state
            if (productsContainer) {
                productsContainer.classList.remove('loading');
            }
        }, 500);
    }
} 