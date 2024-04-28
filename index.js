const baseURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";

const numOfResults ="&number=5"
const apiKey = "&apiKey=3c67ba49ba964921847deca7bda78892";
// const apiKey = "&apiKey=d44c076e976b4c809c5562e00c9111fa";
let resultIds=[];
// const newBaseURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=';
const options = {
	method: 'GET',
	headers: {
		// 'X-RapidAPI-Key': '4cfecbde77msh57baceea9d7c0e7p138824jsneaab2127d667',
		// 'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
	}
};


const mainContainer = document.querySelector('.container');
const resultsContainer = document.getElementById("results-container"); 
const searchForm = document.getElementById("search-form");
const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

let ingredientsToInclude = [];
let ingredientsContainer = document.getElementById("list");
searchInput.addEventListener("click", () => {
    searchInput.value="";
})


searchButton.addEventListener('click', getRecipe); 

async function getRecipe(event){
    console.log("getRecipe function is running");
    event.preventDefault();
    
    console.log("getRecipe function is running");
    let userInput = searchInput.value;
    storeIngredients(userInput);
    userInput = userInput.toString();
    let fullURL = baseURL + userInput + numOfResults + apiKey;
    try {
        if (userInput === "") {
            throw new Error("Hmmm...there's nothing there.");
        }
        const response = await fetch(fullURL, options);
        const result = await response.json();
        console.log(result);
        if (result.length === 0) {
            throw new Error("There are no recipes with that ingredient.");
        }
        if (result.length > 0){
        resultsContainer.replaceChildren();
        }
        newShowResults(result);
    } catch (error) {
        console.error(error);
        displayUserInputError(error.message);
    }
}

function displayUserInputError(message) {
    const errorDiv = document.createElement("div");
    const errorPicture = document.createElement("img"); 
    const errorMessage = document.createElement("h4");

    errorDiv.className="error-div";
    errorPicture.src = "images/spilled-milk.jpg";
    errorMessage.textContent = message;

    resultsContainer.replaceChildren(errorDiv);
    errorDiv.replaceChildren(errorPicture, errorMessage);
}


function newShowResults(data) {
    for(let recipe of data){  
        const result = document.createElement("div");
        result.className = "result";

        const heading = document.createElement("h3");
        heading.innerHTML = recipe.title;
        heading.className = "result-heading";

        const image = document.createElement("img");
        image.src = recipe.image;
        image.className = "result-image";

        const resultButton = document.createElement("button");
        resultButton.innerHTML = "Open Recipe Card";
        resultButton.className = "result-button";
        resultButton.addEventListener("click", () => goToRecipe(recipe.id));

        result.appendChild(heading);
        result.appendChild(image);
        result.appendChild(resultButton);
        resultsContainer.appendChild(result);
        }
    }

function storeIngredients (userInput) {
    document.getElementById("list-title").style.display="block";
    newSearchBtn = document.getElementById("new-search");
    newSearchBtn.style.display="block";
    let list = document.createElement("ul");
    let item = document.createElement("li");
    item.className = "list-items";
    ingredientsContainer.appendChild(list);
    newSearchBtn.addEventListener("click", () => {
        window.location.reload();
    })
    if (ingredientsToInclude.includes(userInput)) {
        return ingredientsToInclude; 
    } else {
        ingredientsToInclude.push(userInput);
        item.textContent = userInput;
        list.appendChild(item);
    }    
}

function goToRecipe(id) {
    try {
        fetch("https://api.spoonacular.com/recipes/" + id +"/card?apiKey=3c67ba49ba964921847deca7bda78892")
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            showCard(data);
        })
    
    } catch {
        console.error(error.message);
        showError();
    }
    
}

function showCard (data) {
    const modalDiv = document.createElement("div"); 
    const modalCardContainer = document.createElement("div");
    modalDiv.className = "modal";
    modalCardContainer.className = "modal-card-container";
    const recipeCard = document.createElement("img");
    recipeCard.className = "recipe-card-pic";
    recipeCard.src = data.url;

    const closeBtn = document.createElement('img');
    closeBtn.src = 'images/close-button-svgrepo-com.svg';
    closeBtn.alt = 'close button';
    closeBtn.className = 'close-button';
    closeBtn.addEventListener("click", () => {
        modalDiv.style.display = "none";
    });

    window.onclick = function(event) {
        if (event.target == modalDiv) {
            modalDiv.style.display = "none";
        }
    }
    modalCardContainer.appendChild(recipeCard); 
    modalCardContainer.appendChild(closeBtn);
    modalDiv.appendChild(modalCardContainer);
    mainContainer.appendChild(modalDiv);
}


