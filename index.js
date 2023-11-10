///to-do:
//1. Hide API Key

const baseURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
const n="&number="
let numOfResults = 2;
const apiKey = "&apiKey=0b8a94dc43f6454cab020baffb9438e5";
let resultIds=[];
let ingredientsToInclude = [];
const mainContainer = document.querySelector('.container');
let ingredientsContainer = document.getElementById("list");
const inputBox = document.getElementById("ingredients");
inputBox.addEventListener("click", () => {
    inputBox.value="";
})

document.addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        const container = document.getElementById("results-container");
        const result = document.getElementsByClassName("result");
        removeChildNodes(container, result);
        getRecipe();
    }
})

function getRecipe() {
    try {
        let userInput = inputBox.value;
        storeIngredients(userInput);
        let searchIngredients = ingredientsToInclude.toString();
        fetch (baseURL + searchIngredients + n + numOfResults + apiKey)
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

function showResults(data) {
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
        result.appendChild(heading);
        result.appendChild(image);
        result.appendChild(resultButton);
        container.appendChild(result);
        resultIds.push(data[i].id);
        document.getElementById("search").addEventListener("click", () => removeChildNodes(container, result));
    }
    console.log(resultIds);
    typoCheck(resultIds);
}

function typoCheck (ids) {
    const typoMessage = document.createElement("h4");
    typoMessage.textContent = "Hmmm...we can't find any recipes using those ingredients. Try a different search.";
    if (ids.length === 0) {
        document.getElementById("results-container").appendChild(typoMessage);
    }  else {
        typoMessage.style.display = "none";
    }
}

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


function showError() {
    const errorDiv = document.createElement("div");
    errorDiv.id = "error-div";
    const errorPic = document.createElement("img");
    errorPic.src = "images/spilled-milk.jpg";
    errorPic.width = "500px";
    const errorMessage = document.createElement("h4");
    errorMessage.textContent = "Oops...something went wrong.";
    const tryAgain = document.createElement("button");
    tryAgain.id ="try-again";
    tryAgain.innerHTML = "Try Again";
    tryAgain.addEventListener("click", () => {
        window.location.reload();
    });
    mainContainer.appendChild(errorDiv);
    errorDiv.appendChild(errorPic);
    errorDiv.appendChild(errorMessage);
    errorDiv.appendChild(tryAgain);
}

    


