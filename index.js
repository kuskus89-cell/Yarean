// --- 1. GLOBAL SELECTORS ---
const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const userInput = document.getElementById('user-input');
const resultsContainer = document.getElementById('results-container');
const resultsTitle = document.getElementById('results-title');

const exploreSection = document.querySelector('.categories-section');
const resultsSection = document.querySelector('.results-section');
const favoritesSection = document.getElementById('favorites-section');
const shoppingSection = document.getElementById('shopping-section');

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();


// --- 3. SEARCH & CATEGORY LOGIC ---
async function getMeals(searchTerm) {
    resultsContainer.innerHTML = "<p>Searching...</p>";
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        resultsTitle.innerText = `Search Results for: "${searchTerm}"`;
        displayMeals(data.meals);
    } catch (error) {
        resultsContainer.innerHTML = "<p>Error loading meals. Please try again.</p>";
    }
}

async function fetchCategories() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const data = await response.json();
    displayCategories(data.categories);
}

function displayCategories(categories) {
    const grid = document.getElementById('category-grid');
    grid.innerHTML = categories.map(cat => `
        <div class="cat-card" onclick="filterByCategory('${cat.strCategory}')">
            <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}">
            <h3>${cat.strCategory}</h3>
        </div>
    `).join('');
}

async function filterByCategory(category) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    resultsTitle.innerText = `Category: ${category}`;
    displayMeals(data.meals); 
}

// --- 4. CORE DISPLAY FUNCTION ---
function displayMeals(meals) {
    resultsContainer.innerHTML = ""; 
    if (!meals) {
        resultsContainer.innerHTML = "<h3>No meals found.</h3>";
        return;
    }

    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal-card';
        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <div class="card-buttons">
                <button onclick="getMealDetails('${meal.idMeal}')">View</button>
                <button class="fav-btn" onclick="toggleFavorite('${meal.idMeal}', '${meal.strMeal.replace(/'/g, "&apos;")}', '${meal.strMealThumb}')">
                    ❤️
                </button>
            </div>
        `;
        resultsContainer.appendChild(mealDiv);
    });
}

// --- 5. FAVORITES LOGIC ---
function toggleFavorite(mealId, mealName, mealThumb) {
    let favorites = JSON.parse(localStorage.getItem('myMeals')) || [];
    const isFavorite = favorites.some(meal => meal.id === mealId);

    if (isFavorite) {
        favorites = favorites.filter(meal => meal.id !== mealId);
    } else {
        favorites.push({ id: mealId, name: mealName, thumb: mealThumb });
    }

    localStorage.setItem('myMeals', JSON.stringify(favorites));
    alert(isFavorite ? "Removed from Favorites" : "Added to Favorites!");
}

function loadFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const favorites = JSON.parse(localStorage.getItem('myMeals')) || [];

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = "<p>You haven't saved any recipes yet!</p>";
        return;
    }

    favoritesGrid.innerHTML = favorites.map(meal => `
        <div class="meal-card">
            <img src="${meal.thumb}" alt="${meal.name}">
            <h3>${meal.name}</h3>
            <div class="card-buttons">
                <button onclick="getMealDetails('${meal.id}')">View</button>
                <button class="fav-btn" onclick="removeFromFavorites('${meal.id}')">❌</button>
            </div>
        </div>
    `).join('');
}

function removeFromFavorites(mealId) {
    let favorites = JSON.parse(localStorage.getItem('myMeals')) || [];
    favorites = favorites.filter(meal => meal.id !== mealId);
    localStorage.setItem('myMeals', JSON.stringify(favorites));
    loadFavorites();
}

// --- 6. SHOPPING LIST LOGIC ---
function addToShoppingList(item) {
    let list = JSON.parse(localStorage.getItem('shoppingList')) || [];
    if (!list.includes(item)) {
        list.push(item);
        localStorage.setItem('shoppingList', JSON.stringify(list));
        alert("Added to shopping list!");
    } else {
        alert("Already in your list!");
    }
}

function renderShoppingList() {
    const listItems = document.getElementById('shopping-list-items');
    const list = JSON.parse(localStorage.getItem('shoppingList')) || [];
    
    if (list.length === 0) {
        listItems.innerHTML = "<li>Your list is empty.</li>";
        return;
    }

    listItems.innerHTML = list.map((item, index) => `
        <li class="shop-item">
            <span>${item}</span>
            <button onclick="removeFromList(${index})">Delete</button>
        </li>
    `).join('');
}

function removeFromList(index) {
    let list = JSON.parse(localStorage.getItem('shoppingList')) || [];
    list.splice(index, 1);
    localStorage.setItem('shoppingList', JSON.stringify(list));
    renderShoppingList();
}

// --- 7. MODAL & DETAIL LOGIC ---
async function getMealDetails(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const meal = data.meals[0];
    
    let ingredientsHTML = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            const itemString = `${measure} ${ingredient}`.replace(/'/g, "&apos;");
            ingredientsHTML += `
                <li>
                    ${measure} ${ingredient} 
                    <button class="add-ing-btn" onclick="addToShoppingList('${itemString}')">+</button>
                </li>`;
        }
    }

    document.getElementById('modal-body').innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        <h3>Ingredients:</h3>
        <ul class="ingredient-list">${ingredientsHTML}</ul>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    `;
    document.getElementById('meal-modal').style.display = "block";
}

// --- 8. EVENT LISTENERS ---
searchBtn.addEventListener('click', () => {
    const term = userInput.value.trim();
    if (term) getMeals(term);
});

randomBtn.addEventListener('click', async () => {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    showView('explore');
    resultsTitle.innerText = "Chef's Choice: Random Meal";
    displayMeals(data.meals);
    resultsSection.scrollIntoView({ behavior: 'smooth' });
});

function showView(view) {
    exploreSection.style.display = view === 'explore' ? 'block' : 'none';
    resultsSection.style.display = view === 'explore' ? 'block' : 'none';
    favoritesSection.style.display = view === 'favorites' ? 'block' : 'none';
    shoppingSection.style.display = view === 'shopping' ? 'block' : 'none';
}

document.getElementById('show-favorites').addEventListener('click', () => { showView('favorites'); loadFavorites(); });
document.getElementById('show-explore').addEventListener('click', () => showView('explore'));
document.getElementById('show-shopping').addEventListener('click', () => { showView('shopping'); renderShoppingList(); });

document.querySelector('.close-btn').onclick = () => document.getElementById('meal-modal').style.display = "none";
window.onclick = (event) => {
    if (event.target == document.getElementById('meal-modal')) {
        document.getElementById('meal-modal').style.display = "none";
    }
};

document.getElementById('clear-list').onclick = () => {
    localStorage.removeItem('shoppingList');
    renderShoppingList();
};
});