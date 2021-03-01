const watchlistSection = document.querySelector(".watchlist-section");
const emptyWatchlist = document.querySelector(".empty-watchlist");
const viewFormWl = document.querySelector(".view-form-wl");

async function getWatchlist() {
    const list = await fetch(`http://localhost:3000/getData`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'get': 'watchlist'
        },
        body: JSON.stringify({
            'userID': `${await userID}`
        })
    });
    const res = await list.json();
    if (res.result == 'empty') {
        console.log("nothing in here");
        //TODO - display a msg showing empty watchlist.
        if (!watchlistSection.classList.contains("d-none")) {
            watchlistSection.classList.add("d-none");
        }
        if (emptyWatchlist.classList.contains("d-none")) {
            emptyWatchlist.classList.remove("d-none");
        }
    }
    else {
        console.log("there you go", res.result);
        let titlearr = [];

        for (let i = 0; i < res.result.length; i++) {
            let title = await searchwatchlistItems(res.result[i]);
            console.log("title", title);
            createWatchlistCard(title);
            // createWatchlistCard(res.result, i);
        }
    }
}

function createWatchlistCard(item) {
    const card = document.createElement('div');
    card.className = "card mb-3 w-75";

    card.addEventListener('click', () => {
        // console.log(item);
        const id = item.imdbID;
        sendRequest(id);
    })

    const row = document.createElement('div');
    row.className = "row";
    card.appendChild(row);

    const col4 = document.createElement('div');
    col4.className = "col-md-3 d-flex justify-content-center";
    row.appendChild(col4);

    const img = document.createElement('img');
    img.src = `${item.Poster}`;
    img.className = "img-fluid poster";
    col4.appendChild(img);

    const col8 = document.createElement('div');
    col8.className = "col-md-7";
    row.appendChild(col8);

    const card_body = document.createElement('div');
    card_body.className = "card-body";
    col8.appendChild(card_body);

    const card_title = document.createElement('h5');
    card_title.className = "card-title";
    card_title.innerText = `${item.Title}`
    card_body.appendChild(card_title);

    const desc = document.createElement('p');
    desc.innerText = `${item.Plot}`;
    desc.className = "card-desc pt-2";
    card_body.appendChild(desc);

    const release = document.createElement('p');
    release.innerText = `${item.Released}`;
    release.className = "card-release pt-2";
    card_body.appendChild(release);

    const rating = document.createElement('p');
    rating.innerText = `${item.Rated}`;
    rating.className = "card-rating";
    card_body.appendChild(rating);

    // const watchlistBtn = document.createElement('button');
    // watchlistBtn.className = "btn btn-secondary bucket-btn";
    // watchlistBtn.innerText = "Add to WatchList";
    // card_body.appendChild(watchlistBtn);


    watchlistSection.appendChild(card);
}

async function sendRequest(id){
    sessionStorage.setItem("search", id);
    viewFormWl.requestSubmit();
}

async function searchwatchlistItems(searchID) {
    const key = "a860a075";
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${key}&i=${searchID}`);
        const res = await response.json();
        console.log(res);
        return res;
    }
    catch (e) {
        console.log(e);
    }
}
const bucketBtn = document.querySelector(".bucket-btn");

async function initiate(){
    // console.log("signed in user",await userID)
    if(await userID != "not found"){
        getWatchlist();
    }
    else{
        console.log("no");
        window.location = "/login"
        //display error msg
    }
}


initiate();
