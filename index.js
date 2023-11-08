///to-do:
// CURRENT FOCUS - showResults(data) returns "not defined" 
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
const n="&number="
let numOfResults = 5;
const apiKey = "&apiKey=d44c076e976b4c809c5562e00c9111fa";
let resultIds=[];

const mainContainer = document.querySelector('.container');

document.addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        getRecipe();
    }
}) //ideally this can be done using a form element and the "onsubmit" eventlistener, but i messed with it and couldn't quite get it...

function getRecipe() {
    try {
       let userInput = document.getElementById("ingredients").value;
        userInput = userInput.toString();
        fetch (baseURL + userInput + n + numOfResults + apiKey)
        .then(res => res.json())
        .then((data) => {
        console.log(data);
        showResults(data);    
    }) 
    } catch (error){
        console.error(error.message);
        showError();
        }
}

const typoMessage = document.getElementById("typo-message"); //Moving outside of function for global access
typoMessage.textContent=

function showResults(data) {
        //clearPreviousError();  Hacky and resource-wasteful, I know. 
        console.log("show results has started...");
     
    if(data.length > 0) {    
            typoMessage.style.display = "none"
            console.log("Did we get to if statement?")
        for (let i=0; i<data.length; i++) {
            const container = document.getElementById("results-container");
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
            container.appendChild(result);
            resultIds.push(data[i].id);
            document.getElementById("search").addEventListener("click", () => removeChildNodes(container, result));
            console.log(data);
            console.log(resultIds); // Check to see if resultIds looks like when nothing entereed. This isn't even running now
        }
    } else{
        console.log("This is where error should run"); // we get here now
        // typoCheck(resultIds);
        typoMessage.style.display = "block"; // maybe we don't need a whole function and can just switch display on/off like this?
    }
    
    console.log("show results has finished...")
}

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
function showError() {
    // const errorPicture = document.createElement("img"); 
    // const errorMessage = document.createElement("h4");
    errorPicture.src = "images/spilledMilk.jpg"; // typo -didn't reference the element created above correctly
    errorPicture.width = "500px";
    errorMessage.textContent = "Oops...something went wrong.";
    
    resultBox.appendChild(errorPicture);
    resultBox.appendChild(errorMessage);
}

function clearError(){
    resultBox.replaceChildren();
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
    


