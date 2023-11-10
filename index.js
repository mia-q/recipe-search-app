///to-do:
// CURRENT FOCUS - Clear away "can't find any recipes message" when user clicks search again
//1. Clear away "can't find any recipes message" when user clicks search again
//2. Hide API Key
//3. Make sure we can search using multiple ingredients. (make format for search parameters less strict so users can type all kinds of things and it still turns out correctly).a maybe create a side panel that shows ingredients the user has added, allow them to delete them...idk
//4. Modal images need to return a uniform aspect ratio with legible uniform font-size.

           
const baseURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
const numOfResults ="&number=5"
// let numOfResults = 5; Just put 5 in variable above if we're hardcoding for 5 max results anyway
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


searchButton.addEventListener('click', getRecipe); // should make sure DOM loads before this event listener is added


/* i think error handling will be more straightforward and easier to work with using async and await */
async function getRecipe(event){
    console.log("getRecipe function is running");
    event.preventDefault();
    resultsContainer.replaceChildren(); // So this was the simple solution I wanted to employ originally right away to clear away any existing nodes

    console.log("getRecipe function is running");
    let userInput = searchInput.value;
    userInput = userInput.toString();
    let fullURL = newBaseURL + userInput + numOfResults;
    try {
        if (userInput === "") {
            throw new Error("This isn't Neverland and we're not Peter Pan. Please enter an actual ingredient.");
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
        if (event.target == modal) {
              modalDiv.style.display = "none";
        }
    }
   
    modalCardContainer.appendChild(recipeCard); 
    modalCardContainer.appendChild(closeBtn);
    modalDiv.appendChild(modalCardContainer);
    mainContainer.appendChild(modalDiv);
  
}





//everything from here down is just failed experiments that might come in handy later (even if it's just a reminder of what doesn't work)





 //     resultButton.addEventListener("click", () => {
    //         const modal = document.getElementById("recipe-card");
    //         while (modal.firstElementChild) {
    //     modal.removeChild(modal.firstElementChild);
    // };
    // });

// function loadMore() {
//     if (numOfResults < 15) {
//         numOfResults += 3;
//         getRecipe();
//     }
// }

// let moreResults = document.createElement("button");
        // moreResults.innerHTML = "More Results";
        // moreResults.addEventListener("click", loadMore);
        // document.getElementById("more-results").appendChild(moreResults);    
    
