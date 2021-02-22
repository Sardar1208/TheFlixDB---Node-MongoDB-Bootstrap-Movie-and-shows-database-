const xx = document.querySelectorAll(".xx");
const searchbtn = document.querySelector(".searchbtn");
const searchbar = document.querySelector(".search");
const sideText = document.querySelector(".side-text");
const searchResults = document.querySelector(".search-results");
const resultSection = document.querySelector(".view-page");
const mainPage = document.querySelector(".main-page");
const viewHeading = document.querySelector(".view-heading");
const searchPageResults = document.querySelector(".results");


// Extracts the query and calls the omdb api  for results.
async function search() {
    if (!mainPage.classList.contains("d-none")) {
        mainPage.classList.toggle("d-none");
    }
    resultSection.classList.remove("d-none");
    // window.location.hash = "view-page";

    const query = searchbar.value;
    const key = "a860a075";
    const res = await searchQuery(query, key)

    viewHeading.innerText = query;

    //If we get a result then process it and display.
    if (res.Response == "True") {
        processData(res.Search);
    }
    else {
        // Otherwise give error.
        console.log("Sorry we cant find what you are looking for");
    }
}

// Calls the omdb api
async function searchQuery(query, key) {
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=a860a075`);

    //Converts the response in readable JSON. 
    return response.json();
}

// Process the obtained results one by one
function processData(results) {

    searchPageResults.innerHTML = '';

    // Goes through the results one by one and displays it based on the type.
    for (let i = 0; i < results.length; i++) {
        createCard(results, i);
    }
}