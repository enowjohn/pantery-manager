// Pantry Manager Interactive Website JavaScript

// Global state
let pantryItems = [];
let currentSection = 'home';

// Sample food items for demo
const sampleItems = [
    { name: 'Milk', emoji: '🥛', category: 'Dairy', daysUntilExpiry: 3 },
    { name: 'Bread', emoji: '🍞', category: 'Bakery', daysUntilExpiry: 7 },
    { name: 'Carrots', emoji: '🥕', category: 'Vegetables', daysUntilExpiry: 5 },
    { name: 'Cheese', emoji: '🧀', category: 'Dairy', daysUntilExpiry: 14 },
    { name: 'Apples', emoji: '🍎', category: 'Fruits', daysUntilExpiry: 10 },
    { name: 'Chicken', emoji: '🍗', category: 'Meat', daysUntilExpiry: 2 },
    { name: 'Rice', emoji: '🍚', category: 'Grains', daysUntilExpiry: 30 },
    { name: 'Tomatoes', emoji: '🍅', category: 'Vegetables', daysUntilExpiry: 4 },
    { name: 'Yogurt', emoji: '🥛', category: 'Dairy', daysUntilExpiry: 5 },
    { name: 'Bananas', emoji: '🍌', category: 'Fruits', daysUntilExpiry: 3 }
];

// Sample recipes
const sampleRecipes = [
    {
        name: 'Quick Pasta Primavera',
        ingredients: ['Tomatoes', 'Carrots', 'Cheese'],
        description: 'A delicious pasta dish using fresh vegetables and cheese',
        time: '20 minutes'
    },
    {
        name: 'Garden Salad',
        ingredients: ['Carrots', 'Tomatoes', 'Apples'],
        description: 'Fresh and healthy salad with seasonal vegetables',
        time: '10 minutes'
    },
    {
        name: 'Dairy Smoothie',
        ingredients: ['Milk', 'Yogurt', 'Apples', 'Bananas'],
        description: 'Nutritious smoothie perfect for breakfast',
        time: '5 minutes'
    },
    {
        name: 'Chicken Stir Fry',
        ingredients: ['Chicken', 'Carrots', 'Rice'],
        description: 'Quick and flavorful Asian-inspired dish',
        time: '25 minutes'
    },
    {
        name: 'Cheese Sandwich',
        ingredients: ['Bread', 'Cheese', 'Tomatoes'],
        description: 'Classic grilled cheese with fresh tomatoes',
        time: '15 minutes'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDemo();
    initializeForm();
    initializeAnimations();
    updateProgressBar();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
        });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function updateActiveNav() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Demo functionality
function initializeDemo() {
    // Add some initial items for demonstration
    setTimeout(() => {
        addItem('Milk', 3);
        addItem('Bread', 7);
        addItem('Carrots', 2);
    }, 1000);
}

function addItem(itemName, daysUntilExpiry) {
    const item = sampleItems.find(item => 
        item.name.toLowerCase() === itemName?.toLowerCase()
    );
    
    if (!item && !itemName) {
        // Add random item if no specific item requested
        const randomItem = sampleItems[Math.floor(Math.random() * sampleItems.length)];
        pantryItems.push({...randomItem, id: Date.now()});
    } else if (item) {
        pantryItems.push({...item, id: Date.now(), daysUntilExpiry: daysUntilExpiry || item.daysUntilExpiry});
    } else {
        // Add custom item
        pantryItems.push({
            id: Date.now(),
            name: itemName,
            emoji: '📦',
            category: 'Other',
            daysUntilExpiry: daysUntilExpiry || 7
        });
    }
    
    updatePantryDisplay();
    showNotification('Item added to pantry!');
}

function removeItem(itemId) {
    pantryItems = pantryItems.filter(item => item.id !== itemId);
    updatePantryDisplay();
    showNotification('Item removed from pantry');
}

function clearPantry() {
    if (pantryItems.length === 0) {
        showNotification('Pantry is already empty');
        return;
    }
    
    if (confirm('Are you sure you want to clear all items from your pantry?')) {
        pantryItems = [];
        updatePantryDisplay();
        hideRecipeSuggestion();
        showNotification('Pantry cleared');
    }
}

function updatePantryDisplay() {
    const pantryContainer = document.getElementById('pantry-items');
    const itemCount = document.getElementById('item-count');
    const expiringCount = document.getElementById('expiring-count');
    
    // Update counts
    itemCount.textContent = `${pantryItems.length} items`;
    const expiringSoon = pantryItems.filter(item => item.daysUntilExpiry <= 3).length;
    expiringCount.textContent = `${expiringSoon} expiring soon`;
    
    // Clear current display
    pantryContainer.innerHTML = '';
    
    if (pantryItems.length === 0) {
        pantryContainer.innerHTML = `
            <div class="empty-state">
                <p>Your pantry is empty. Click "Add Item" to get started!</p>
            </div>
        `;
        return;
    }
    
    // Sort items by expiry (soonest first)
    const sortedItems = [...pantryItems].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
    
    // Display items
    sortedItems.forEach(item => {
        const itemElement = createItemElement(item);
        pantryContainer.appendChild(itemElement);
    });
}

function createItemElement(item) {
    const div = document.createElement('div');
    div.className = 'pantry-item';
    
    const expiryClass = getExpiryClass(item.daysUntilExpiry);
    const expiryText = getExpiryText(item.daysUntilExpiry);
    
    div.innerHTML = `
        <div class="item-info">
            <span class="item-emoji">${item.emoji}</span>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.category} • ${expiryText}</p>
            </div>
        </div>
        <div class="item-actions">
            <span class="item-expiry ${expiryClass}">${expiryText}</span>
            <button class="btn btn-outline" onclick="removeItem(${item.id})" style="padding: 5px 10px; font-size: 0.8rem;">Remove</button>
        </div>
    `;
    
    return div;
}

function getExpiryClass(days) {
    if (days <= 0) return 'expiry-expired';
    if (days <= 3) return 'expiry-soon';
    return 'expiry-good';
}

function getExpiryText(days) {
    if (days <= 0) return 'Expired';
    if (days === 1) return 'Expires tomorrow';
    if (days <= 7) return `Expires in ${days} days`;
    return `${days} days left`;
}

function generateRecipe() {
    if (pantryItems.length === 0) {
        showNotification('Add some items to your pantry first!');
        return;
    }
    
    // Find recipes that can be made with current items
    const availableItems = pantryItems.map(item => item.name);
    const matchingRecipes = sampleRecipes.filter(recipe => 
        recipe.ingredients.some(ingredient => 
            availableItems.some(item => 
                item.toLowerCase().includes(ingredient.toLowerCase()) ||
                ingredient.toLowerCase().includes(item.toLowerCase())
            )
        )
    );
    
    if (matchingRecipes.length === 0) {
        showNotification('No recipes found with current items. Try adding more ingredients!');
        return;
    }
    
    // Select a random matching recipe
    const recipe = matchingRecipes[Math.floor(Math.random() * matchingRecipes.length)];
    displayRecipe(recipe);
}

function displayRecipe(recipe) {
    const recipeContainer = document.getElementById('recipe-suggestion');
    const recipeContent = document.getElementById('recipe-content');
    
    recipeContent.innerHTML = `
        <h4>${recipe.name}</h4>
        <p><strong>Time:</strong> ${recipe.time}</p>
        <p><strong>Ingredients needed:</strong> ${recipe.ingredients.join(', ')}</p>
        <p>${recipe.description}</p>
        <div style="margin-top: 20px;">
            <button class="btn btn-primary" onclick="showNotification('Recipe saved to your collection!')">Save Recipe</button>
            <button class="btn btn-secondary" onclick="hideRecipeSuggestion()">Close</button>
        </div>
    `;
    
    recipeContainer.style.display = 'block';
    recipeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideRecipeSuggestion() {
    document.getElementById('recipe-suggestion').style.display = 'none';
}

// Form handling
function initializeForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
}

function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    showNotification('Thank you for your message! We\'ll get back to you soon.');
    event.target.reset();
}

// Animations
function initializeAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    document.querySelectorAll('.problem-card, .feature-card, .business-card').forEach(card => {
        observer.observe(card);
    });
}

// Progress bar animation
function updateProgressBar() {
    const progressBar = document.querySelector('.progress');
    if (progressBar) {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 65) {
                clearInterval(interval);
            } else {
                width += 1;
                progressBar.style.width = width + '%';
            }
        }, 20);
    }
}

// Notification system
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Interactive hero items
document.addEventListener('DOMContentLoaded', function() {
    const heroItems = document.querySelectorAll('.item');
    heroItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemName = this.getAttribute('data-name') || this.textContent;
            showNotification(`${itemName} added to your pantry!`);
            
            // Add pulse animation
            this.style.animation = 'pulse 0.5s ease-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
});

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.problem-card, .feature-card, .business-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Smooth reveal animation for stats
document.addEventListener('DOMContentLoaded', function() {
    const stats = document.querySelectorAll('.stat-number, .impact-number');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const isMoney = finalValue.includes('$');
                const isK = finalValue.includes('K') || finalValue.includes('M') || finalValue.includes('+');
                
                let numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
                let currentValue = 0;
                const increment = numericValue / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(timer);
                    }
                    
                    let displayValue = Math.floor(currentValue);
                    if (isK) {
                        if (finalValue.includes('M')) {
                            displayValue = (currentValue / 1000000).toFixed(1) + 'M';
                        } else if (finalValue.includes('K')) {
                            displayValue = (currentValue / 1000).toFixed(1) + 'K';
                        } else {
                            displayValue = Math.floor(currentValue) + '+';
                        }
                    } else if (isMoney) {
                        displayValue = '$' + Math.floor(currentValue) + (finalValue.includes('K') ? 'K' : '');
                    } else if (isPercentage) {
                        displayValue = Math.floor(currentValue) + '%';
                    }
                    
                    target.textContent = displayValue;
                }, 30);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
});

// Mobile touch support
document.addEventListener('DOMContentLoaded', function() {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
});

// Performance optimization - lazy load images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Let default tab behavior work
            return;
        }
        
        if (e.key === 'Escape') {
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
            
            // Close recipe suggestion if open
            hideRecipeSuggestion();
        }
    });
    
    // Add ARIA labels dynamically
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
});
