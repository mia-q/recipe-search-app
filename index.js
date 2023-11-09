///to-do:
// CURRENT FOCUS - Clear away "can't find any recipes message" when user clicks search again
//1. Clear away "can't find any recipes message" when user clicks search again
//2. Hide API Key
//3. Make sure we can search using multiple ingredients. (make format for search parameters less strict so users can type all kinds of things and it still turns out correctly).a maybe create a side panel that shows ingredients the user has added, allow them to delete them...idk
//4. Modal images need to return a uniform aspect ratio with legible uniform font-size.

 /*
                 FLOW For the Modal creation:
                 ~    document.eventListener --> getRecipe()
                 ~      getRecipe() --> showResults()
                 ~       showResults()
                ~48        resultButton.addEventListener --> goToRecipe()
                ~90    goToRecipe() --> 98 showCard()
                ~110    showCard() 

                user clicks on getRecipe
                showResults runs once and displays initial recipe cards
                also creates/displays resultButton w/ event listener
                user clicks resultButton listener and runs goToRecipe
                goToRecipe() makes a 2nd API fetch and RETURNS A PROMISE to showCard()
                *** showCard() pseudo code continues below next to the function itself

            */

           
const baseURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
const numOfResults ="&number=5"
// let numOfResults = 5; Just put 5 in variable above if we're hardcoding for 5 max results anyway
const apiKey = "&apiKey=d44c076e976b4c809c5562e00c9111fa";
let resultIds=[];

const mainContainer = document.querySelector('.container');
const resultsContainer = document.getElementById("results-container"); // 5 result cards displayed here

const newBaseURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '4cfecbde77msh57baceea9d7c0e7p138824jsneaab2127d667',
		'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
	}
};

/* i think error handling will be more straightforward and easier to work with using async and await */
async function newGetRecipe(){
    let userInput = document.getElementById("ingredients").value; // should this be with the event? 
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
    const errorPicture = document.createElement("img"); 
    const errorMessage = document.createElement("h4");
    errorPicture.src = "images/spilledMilk.jpg"; 
    errorPicture.width = "500px";
    errorMessage.textContent = message;
    
    resultsContainer.appendChild(errorPicture);
    resultsContainer.appendChild(errorMessage);
}

function clearError(){
    resultsContainer.replaceChildren();
}

// const searchBtn = document.querySelector('#search-btn'); 

// searchBtn.addEventListener('click', getRecipe);


// document.addEventListener('keypress', function (e) {
//     if (e.key === "Enter") {
//         getRecipe();
//     }
// }) 

// function getRecipe() {
//     try {
//        let userInput = document.getElementById("ingredients").value;
//         userInput = userInput.toString();
//         fetch (baseURL + userInput + numOfResults + apiKey)
//         .then(res => res.json())
//         .then((data) => {
//         console.log(data);
//         showResults(data);    
//     }) 
//     } catch (error){
//         console.error(error.message);
//         showError();
//         }
// }

const typoMessage = document.getElementById("typo-message"); //Moving outside of function for global access
typoMessage.textContent="ooops";



// Refactored showresults() using async function to get data
function newShowResults(data) {
    console.log("newShowResults started");
    console.log(data); 
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

function showResults(data) {
   
        typoMessage.style.display = "none"
           

        for (let i=0; i<data.length; i++) {
           
            const result = document.createElement("div")
            result.className = "result";

            const heading = document.createElement("h3");
            heading.innerHTML = data[i].title;
            heading.className = "result-heading";

            const image = document.createElement("img");
            image.src = data[i].image;
            image.className = "result-image";

            const resultButton = document.createElement("button");
            resultButton.innerHTML = "Open Recipe Card";
            resultButton.className = "result-button";
            resultButton.addEventListener("click", () => goToRecipe(resultIds[i]));

            // Can we just remove the Listener above and add it back every time? Or remove the child nodes early in this process?
            result.appendChild(heading);
            result.appendChild(image);
            result.appendChild(resultButton);

            resultsContainer.appendChild(result);

            resultIds.push(data[i].id);
            // what does the line below do ? Was this a solution for losing the effect of css grid?
           // document.getElementById("search-btn").addEventListener("click", () => removeChildNodes(container, result)); // something weird about this
            
        }
  
    
   
}

 // ****** !!!!! IF STATEMENT BELOW IS SOLUTION FOR REMOVING ERROR MESSAGE AFTER RESEARCH
    // if(data.length > 0) {   
    // } else{
    //     console.log("This is where error should run"); // we get here now
    //     // typoCheck(resultIds);
    //     typoMessage.style.display = "block"; // maybe we don't need a whole function and can just switch display on/off like this?
    // } 

// Chat GPT suggestion below(Also didn't work):

//function typoCheck(ids) {
//     const typoMessage = document.getElementById("typo-message"); // Get the existing typo message element
//     if (ids.length === 0) {
//         typoMessage.style.display = "block"; // Show the message when there are no results
//     } else {
//         typoMessage.style.display = "none"; // Hide the message when there are results
//     }
// }

// Original typoCheck routine doesn't clear for subsequent searches.

// function typoCheck (ids) {
//     const typoMessage = document.createElement("h4");
//     typoMessage.textContent = "Hmmm...we can't find any recipes using those ingredients. Try a different search.";
//     if (ids.length === 0) {
//         document.getElementById("results-container").appendChild(typoMessage);
//     }  else {
//         typoMessage.style.display = "hidden";
//     }
// }

function removeChildNodes(parent, firstChild) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    resultIds = [];
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
    // recipeCard.style.width = "800px";


    const closeBtn = document.createElement('img');
    closeBtn.src = 'images/close-button-svgrepo-com.svg';
    closeBtn.alt = 'close button';
    closeBtn.className = 'close-button';
  
  
    
    closeBtn.addEventListener("click", () => {
        //modal.replaceChildren(); // NEW CODE didn't fix things here either
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

/* Pulled variables below out of showError() so we could access variables for clearError()
    This doesn't feel like the cleanest solution but it works I guess. Maybe keeps us 
    from doing a bunch of refactoring, but don't have the energy for that rabbit hole.
*/
const errorPicture = document.createElement("img"); 
const errorMessage = document.createElement("h4");
const resultBox = document.getElementById("results-container");


// maybe this would be easier if it was in static HTML and we just hid it or displayed it.


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
    
