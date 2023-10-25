const baseURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
let n="&number="
let numOfResults = 3;
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
            let heading = document.createElement("h1");
            heading.innerHTML = data[i].title;
            let image = document.createElement("img");
            image.src = data[i].image;
            let resultButton = document.createElement("button");
            resultButton.innerHTML = "Open Recipe Card";
            resultButton.addEventListener("click", () => goToRecipe(i));
            result.appendChild(heading);
            result.appendChild(image);
            result.appendChild(resultButton);
            document.getElementById("results-container").appendChild(result);
            resultIds.push(data[i].id);
            console.log(resultIds);
        }
    }) 
}

function loadMore () {
    newNum = numOfResults + 3;
    getRecipe(newNum);
}

    
    

function goToRecipe(id) {
    fetch("https://api.spoonacular.com/recipes/" + id +"/card?apiKey=d44c076e976b4c809c5562e00c9111fa")
    .then(res => res.json())
    .then((data) => {
        console.log(data);
        document.getElementById("result-link").href=data[0].url;
    })
}