const searchBtn = document.getElementById('search-btn');
const userInput = document.getElementById('user-input');
const resultsContainer = document.getElementById('results-container');

async function getMeals(searchTerm) {
    // Clear previous results
    resultsContainer.innerHTML = "<p>Searching...</p>";

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        
        displayMeals(data.meals);
    } catch (error) {
        console.error("Error fetching data:", error);
        resultsContainer.innerHTML = "<p>Something went wrong. Try again!</p>";
    }
}
    function displayMeals(meals) {
    resultsContainer.innerHTML = ""; 

    if (!meals) {
        resultsContainer.innerHTML = "<h3>No meals found. Try 'Chicken' or 'Pasta'!</h3>";
        return;
    }

    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal-card';
        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <button onclick="getMealDetails(${meal.idMeal})" style="margin-bottom: 15px;">
                View Recipe
            </button>
        `;
        resultsContainer.appendChild(mealDiv);
    });
}

// Trigger search on button click
searchBtn.addEventListener('click', () => {
    const term = userInput.value.trim();
    if (term) getMeals(term);
});