
//-------------------includes----------------------
const searchId = sessionStorage.getItem("search");
const detailsPage = document.querySelector(".details-page");
const poster = document.querySelector(".poster");
const title = document.querySelector(".title");
const genre = document.querySelector(".genre");
const year = document.querySelector(".year");
const plot = document.querySelector(".plot");
const released = document.querySelector(".released");
const imdbRating = document.querySelector(".imdb-rating");
const rtRating = document.querySelector(".rt-rating");
const cast = document.querySelector(".cast");
const type = document.querySelector(".type");
// const favBtn = document.querySelector(".fav-btn");
// const bucketBtn = document.querySelector(".bucket-btn");

// Search for the title based on the query and returns the result.
async function searchById() {
    const key = "a860a075";
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${key}&i=${searchId}`);
        const res = await response.json();
        console.log(res);
        displayValues(res);
        return res;
    }
    catch (e) {
        console.log(e);
    }
}

// Display the title with information gained from the OMDb API.
function displayValues(res) {
    poster.src = res.Poster;
    title.innerText = res.Title;
    type.innerText = res.Type;
    year.innerText = res.Year;
    released.innerText = res.Released;
    let imdb = "---";
    let rt = "---";
    for (let rating of res.Ratings) {
        console.log(rating.Source);
        if (rating.Source == "Internet Movie Database") {
            imdb = rating.Value;
        }
        if (rating.Source == "Rotten Tomatoes") {
            rt = rating.Value;
        }
    }
    imdbRating.innerText = imdb;
    rtRating.innerText = rt;
    plot.innerText = res.Plot;
    genre.innerText = res.Genre;
    const actors = res.Actors.split(",");
    for (let actor of actors) {
        let temp = document.createElement('li');
        temp.innerText = actor;
        cast.appendChild(temp);
    }
    detailsPage.classList.remove("d-none");
}

const result = searchById();
checkFav();
checkBucket();