// DOM Element Selection
const searchBox = document.querySelector('#searchBox');
const searchBtn = document.querySelector('#searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Fetch Recipes Function
const fetchRecipes = async (query) => {
    try {
        // Show loading state
        recipeContainer.innerHTML = `
            <h2 style="grid-column: 1 / -1;">
                <span class="loading"></span> 
                Searching for delicious ${query} recipes...
            </h2>
        `;
        
        // Fetch data from TheMealDB API
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        
        // Clear previous results
        recipeContainer.innerHTML = '';
        
        if (response.meals) {
            // Add results header
            const headerDiv = document.createElement('div');
            headerDiv.style.gridColumn = '1 / -1';
            headerDiv.style.textAlign = 'center';
            headerDiv.innerHTML = `<h2>Found ${response.meals.length} delicious recipe${response.meals.length !== 1 ? 's' : ''} for "${query}"</h2>`;
            recipeContainer.appendChild(headerDiv);

            // Create recipe cards
            response.meals.forEach((meal, index) => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.style.animationDelay = `${index * 0.1}s`;
                
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
                    <div class="recipe-content">
                        <h3>${meal.strMeal}</h3>
                        <p><span>${meal.strArea}</span> Cuisine</p>
                        <p>Category: <span>${meal.strCategory}</span></p>
                        <button type="button">
                            <i class="fas fa-eye"></i> View Recipe
                        </button>
                    </div>
                `;
                
                // Add click event to view recipe button
                const button = recipeDiv.querySelector('button');
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });
                
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            // Show no results message
            recipeContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <h2>🔍 No recipes found for "${query}"</h2>
                    <p style="margin-top: 1rem; color: #5a4464;">Try searching for something else, like "chicken", "pasta", or "dessert"</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h2>Oops! Something went wrong</h2>
                <p style="margin-top: 1rem; color: #5a4464;">Please check your internet connection and try again</p>
            </div>
        `;
    }
};

// Extract Ingredients Function
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== "") {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

// Open Recipe Popup Function
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3><i class="fas fa-list"></i> Ingredients</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3><i class="fas fa-book-open"></i> Instructions</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    
    // Show modal and prevent body scrolling
    recipeDetailsContent.parentElement.style.display = "block";
    document.body.style.overflow = "hidden";
};

// Close Recipe Popup Function
const closeRecipePopup = () => {
    recipeDetailsContent.parentElement.style.display = "none";
    document.body.style.overflow = "auto";
};

// Event Listeners
recipeCloseBtn.addEventListener('click', closeRecipePopup);

// Close modal when clicking outside
document.querySelector('.recipe-details').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeRecipePopup();
    }
});

// Search button click event
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipes(searchInput);
    } else {
        recipeContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center;">
                <h2>Please enter a search term above</h2>
            </div>
        `;
    }
});

// Allow search on Enter key
searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchBtn.click();
    }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && recipeDetailsContent.parentElement.style.display === 'block') {
        closeRecipePopup();
    }
});

// Page Load Animations
document.addEventListener('DOMContentLoaded', () => {
    // Add entrance animation to hero elements
    const heroElements = document.querySelectorAll('.hero-content h2, .hero-content p, .feature-card');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'all 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Focus on search box when page loads
    searchBox.focus();
});

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optional: Add search suggestions (you can implement this later)
const handleSearchSuggestions = debounce((searchTerm) => {
    // Implementation for search suggestions can go here
    console.log('Searching for:', searchTerm);
}, 300);

// Optional: Listen for input changes for suggestions
searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length > 2) {
        handleSearchSuggestions(searchTerm);
    }
});