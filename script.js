let currentPage = 1;
const apiKey = "c69db6e471e727410f2c0141b7f82e64";
const appId = "e986536c";

const recipesContainer = document.getElementById('recipes-container');
const loadingElement = document.getElementById('loading');
const pageNumber = document.getElementById('page-number');

document.getElementById('search-btn').addEventListener('click', () => {
    currentPage = 1;
    fetchRecipes();
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchRecipes();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchRecipes();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

function fetchRecipes() {
    const query = document.getElementById('search-input').value;
    const cuisine = document.getElementById('cuisine-type').value;
    const diet = document.getElementById('diet-type').value;
    const meal = document.getElementById('meal-type').value;

    if (!query) {
        alert('Please enter a search term');
        return;
    }

    recipesContainer.innerHTML = '';
    loadingElement.style.display = 'block';

    const apiUrl = new URL('https://api.edamam.com/api/recipes/v2');
    apiUrl.searchParams.append('type', 'public');
    apiUrl.searchParams.append('q', query);
    apiUrl.searchParams.append('app_id', appId);
    apiUrl.searchParams.append('app_key', apiKey);
    if (cuisine) apiUrl.searchParams.append('cuisineType', cuisine);
    if (diet) apiUrl.searchParams.append('diet', diet);
    if (meal) apiUrl.searchParams.append('mealType', meal);
    apiUrl.searchParams.append('from', (currentPage - 1) * 10);
    apiUrl.searchParams.append('to', currentPage * 10);

    console.log('Fetching from URL:', apiUrl.toString()); // For debugging

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`API error: ${response.status}. Response: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            loadingElement.style.display = 'none';
            if (data.hits && data.hits.length > 0) {
                displayRecipes(data.hits);
            } else {
                recipesContainer.innerHTML = '<p>No recipes found.</p>';
            }
        })
        .catch(error => {
            loadingElement.style.display = 'none';
            recipesContainer.innerHTML = `<p>Error fetching recipes: ${error.message}</p>`;
            console.error('Error:', error);
        });
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    recipes.forEach(recipeData => {
        const recipe = recipeData.recipe;

        const recipeCard = `
            <div class="recipe-card">
                <img src="${recipe.image}" alt="${recipe.label}">
                <h3>${recipe.label}</h3>
                <p>Calories: ${Math.round(recipe.calories)}</p>
                <button class="recipe-btn" onclick="window.open('${recipe.url}', '_blank')">View Recipe</button>
            </div>
        `;

        recipesContainer.insertAdjacentHTML('beforeend', recipeCard);
    });

    pageNumber.textContent = currentPage;
}