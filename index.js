const baseURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
const n="&number="
let numOfResults = 5;
const apiKey = "&apiKey=d44c076e976b4c809c5562e00c9111fa";
let resultIds=[];


function getRecipe() {
    let userInput = document.getElementById("ingredients").value;
    userInput = userInput.toString();
    fetch (baseURL + userInput + n + numOfResults + apiKey)
    .then(res => res.json())
    .then((data) => {
        console.log(data);
        for (let i=0; i<data.length; i++){
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
            document.getElementById("results-container").appendChild(result);
            resultIds.push(data[i].id);
        }
        // let moreResults = document.createElement("button");
        // moreResults.innerHTML = "More Results";
        // moreResults.addEventListener("click", loadMore);
        // document.getElementById("more-results").appendChild(moreResults);
        console.log(resultIds);
    })
}

// function loadMore() {
//     if (numOfResults < 15) {
//         numOfResults += 3;
//         getRecipe();
//     }
// }

    
    

function goToRecipe(id) {
    fetch("https://api.spoonacular.com/recipes/" + id +"/card?apiKey=d44c076e976b4c809c5562e00c9111fa")
    .then(res => res.json())
    .then((data) => {
        console.log(data);
        const modal = document.getElementById("recipe-card");
        modal.style.display = "block";
        const recipeCard = document.createElement("img");
        const span = document.getElementsByClassName("close")[0];
        span.addEventListener("click", function() {
            modal.style.display = "none";
        });
        window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
          }
        recipeCard.className = "recipe-card-pic";
        recipeCard.src = data.url;
        recipeCard.style.width = "800px";
        recipeCard.style.display = "block";
        modal.appendChild(recipeCard);
    })

}