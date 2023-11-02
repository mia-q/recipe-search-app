const baseURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
let n="&number="
let numOfResults;
const apiKey = "&apiKey=d44c076e976b4c809c5562e00c9111fa";
let resultIds=[];


function getRecipe(numOfResults) {
    let userInput = document.getElementById("ingredients").value;
    userInput = userInput.toString();
    fetch (baseURL + userInput + n + numOfResults + apiKey)
    .then(res => res.json())
    .then((data) => {
        console.log(data);
        for (let i=0; i<data.length; i++){
            let result = document.createElement("div")
            result.id = "result" + i;
            result.class = "result"
            let heading = document.createElement("h3");
            heading.innerHTML = data[i].title;
            let image = document.createElement("img");
            image.src = data[i].image;
            let resultButton = document.createElement("button");
            resultButton.innerHTML = "Open Recipe Card";
            resultButton.addEventListener("click", () => goToRecipe(resultIds[i]));
            result.appendChild(heading);
            result.appendChild(image);
            result.appendChild(resultButton);
            document.getElementById("results-container").appendChild(result);
            let moreResults = document.createElement("button");
            moreResults.innerHTML = "More Results";
            moreResults.addEventListener("click", loadMore);
            document.getElementById("more-results").appendChild(moreResults);
            resultIds.push(data[i].id);
            console.log(resultIds);
        }
    }) 
    return numOfResults;
}

function loadMore (event) {
    event.stopPropogation();  //look into this more and figure out where to place it!!
    if (numOfResults < 15) {
        newNum = numOfResults + 3;
        getRecipe(newNum);
    }
}

    
    

function goToRecipe(id) {
    fetch("https://api.spoonacular.com/recipes/" + id +"/card?apiKey=d44c076e976b4c809c5562e00c9111fa")
    .then(res => res.json())
    .then((data) => {
        console.log(data);
        let recipeCard = document.createElement("img");
        recipeCard.src = data[0].url;
        document.getElementById("recipeCard").appendChild(recipeCard);
    })
}