///to-do:
// CURRENT FOCUS - Clear away "can't find any recipes message" when user clicks search again
//1. Clear away "can't find any recipes message" when user clicks search again
//2. Hide API Key
//3. Make sure we can search using multiple ingredients. (make format for search parameters less strict so users can type all kinds of things and it still turns out correctly).a maybe create a side panel that shows ingredients the user has added, allow them to delete them...idk
//4. Modal images need to return a uniform aspect ratio with legible uniform font-size.

const baseURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";

const numOfResults ="&number=5"
const apiKey = "&apiKey=d44c076e976b4c809c5562e00c9111fa";
let resultIds=[];
const newBaseURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '4cfecbde77msh57baceea9d7c0e7p138824jsneaab2127d667',
		'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
	}
};


const mainContainer = document.querySelector('.container');
const resultsContainer = document.getElementById("results-container"); 
const searchForm = document.getElementById("search-form");
const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
                                            
// const apiKey = "&apiKey=0b8a94dc43f6454cab020baffb9438e5";
let ingredientsToInclude = [];
let ingredientsContainer = document.getElementById("list");
searchInput.addEventListener("click", () => {
    searchInput.value="";
})

// document.addEventListener('keypress', function (e) {
//     if (e.key === "Enter") {
//         const container = document.getElementById("results-container");
//         const result = document.getElementsByClassName("result");
//         removeChildNodes(container, result);
//         getRecipe();
//     }
// }) //might need to remove this after merge idk 

searchButton.addEventListener('click', getRecipe); 

async function getRecipe(event){
    console.log("getRecipe function is running");
    event.preventDefault();
    resultsContainer.replaceChildren(); // So this was the simple solution I wanted to employ originally right away to clear away any existing nodes

    console.log("getRecipe function is running");
    let userInput = searchInput.value;
    storeIngredients(userInput);
    userInput = userInput.toString();
    let fullURL = newBaseURL + userInput + numOfResults;
    try {
        if (userInput === "") {
            throw new Error("This isn't Neverland and we're not Peter Pan. Please enter an actual ingredient.");
//         let userInput = inputBox.value;
//         ingredientsToInclude.push(userInput);
//         let searchIngredients = ingredientsToInclude.toString();
//         fetch (baseURL + searchIngredients + n + numOfResults + apiKey)
//         .then(res => res.json())
//         .then((data) => {
//         console.log(data);
//         showResults(data);
//         storeIngredients(userInput);
          }
        const response = await fetch(fullURL, options);
        const result = await response.json();
        console.log(result);
        if (result.length === 0) {
            throw new Error("I'm sorry, there were no results found for those mysterious ass ingredients.");
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
    errorPicture.src = "images/spilledMilk.jpg";
    errorMessage.textContent = message;
   
    
    resultsContainer.replaceChildren(errorDiv);
    errorDiv.replaceChildren(errorPicture, errorMessage);
}


function newShowResults(data) {
  
    for(let recipe of data){  
        
        const result = document.createElement("div");

// function showResults(data) {
//     for (let i=0; i<data.length; i++) {
//         const container = document.getElementById("results-container");
//         const result = document.createElement("div")
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
  
// function typoCheck (ids) {
//     const typoMessage = document.createElement("h4");
//     typoMessage.textContent = "Hmmm...we can't find any recipes using those ingredients. Try a different search.";
//     if (ids.length === 0) {
//         document.getElementById("results-container").appendChild(typoMessage);
//     }  else {
//         typoMessage.style.display = "none";
//     }
// }

function goToRecipe(id) {
    try {
        fetch("https://api.spoonacular.com/recipes/" + id +"/card?apiKey=d44c076e976b4c809c5562e00c9111fa")
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

// function showError() {
//     const errorDiv = document.createElement("div");
//     errorDiv.id = "error-div";
//     const errorPic = document.createElement("img");
//     errorPic.src = "images/spilled-milk.jpg";
//     errorPic.width = "500px";
//     const errorMessage = document.createElement("h4");
//     errorMessage.textContent = "Oops...something went wrong.";
//     const tryAgain = document.createElement("button");
//     tryAgain.id ="try-again";
//     tryAgain.innerHTML = "Try Again";
//     tryAgain.addEventListener("click", () => {
//         window.location.reload();
//     });
//     mainContainer.appendChild(errorDiv);
//     errorDiv.appendChild(errorPic);
//     errorDiv.appendChild(errorMessage);
//     errorDiv.appendChild(tryAgain);
// }

