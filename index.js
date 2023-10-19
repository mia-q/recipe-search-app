const baseURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
numOfResults=3;
let n="&number=" + numOfResults;
const apiKey = "&apiKey=d44c076e976b4c809c5562e00c9111fa";
let resultIds=[];

function getRecipe() {
    let userInput = document.getElementById("ingredients").value;
    userInput.toString();
    fetch (baseURL + userInput + n + apiKey)
    .then(res => res.json())
    .then((data) => {
        console.log(data);
        for (let i=0; i<data.length; i++){
            document.getElementById("result-title" + i).innerHTML=data[i].title;
            document.getElementById("result-img" + i).src=data[i].image;document.getElementById("result-link" + i).setAttribute("style", "display: block");
        }
        resultIds.push(data[i].id);
    })        
    }
    
// function loadMore () {
//     numOfResults + 3;
// }

function goToRecipe(i) {
    
    fetch("https://api.spoonacular.com/recipes/" + resultIds[i] +"/card&apiKey=d44c076e976b4c809c5562e00c9111fa")
    .then(res => res.json())
    .then((data) => {
        console.log(data);
    //     document.getElementById("result-link").href= `https://api.spoonacular.com/recipes/${data[i].id}/card`
    })
}