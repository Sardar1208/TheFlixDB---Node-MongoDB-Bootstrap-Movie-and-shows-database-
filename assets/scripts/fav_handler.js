const favBtn = document.querySelector(".fav-btn");

// Checks if the user clicked the fav button.
favBtn.addEventListener('click', async (e) => {

    // This is the returned value from searchByid().
    const x = await result;

    // If it is unfaved, then fav it.
    if (favBtn.classList.contains("outline")) {
        // Update the button to faved. 
        favBtn.src = "/svg/fav_fill.svg";
        favBtn.classList.remove("outline");
        favBtn.classList.add("fill");

        //Add to favourites in db .
        const fav = await fetch(`http://localhost:3000/fav`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'userID': `${await userID}`,
                'imdbID': `${x.imdbID}`
            })
        });
        const res = await fav.json();

    } // If it is faved, then unfav it.
    else {
        // Update the button to unfaved.
        favBtn.src = "/svg/fav_outline.svg";
        favBtn.classList.add("outline");
        favBtn.classList.remove("fill");

        //Remove from favourites in db.
        const fav = await fetch(`http://localhost:3000/fav`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'get': 'remove_fav',
            },
            body: JSON.stringify({
                'userID': `${await userID}`,
                'imdbID': `${x.imdbID}`
            })
        });
        const res = await fav.json();
    }
})

// Checks if the title is faved or not, and updates the favBtn based on it.
async function checkFav() {

    // This is the returned value from searchByid().
    const x = await result;

    // Disables the favBtn until the server returns its state. 
    if (!favBtn.classList.contains("d-none")) {
        favBtn.classList.add("d-none");
    }

    // Send request to server for the state of favBtn
    const fav = await fetch(`http://localhost:3000/getData`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'get': 'is_fav'
        },
        body: JSON.stringify({
            'userID': `${await userID}`,
            'imdbID': `${x.imdbID}`
        })
    });
    const res = await fav.json();
    console.log("is_fav: ", res);

    // Update the favBtn state based on the result.
    if (res.result == true) {
        favBtn.src = "/svg/fav_fill.svg";
        if (favBtn.classList.contains("outline")) {
            favBtn.classList.remove("outline");
            favBtn.classList.add("fill");
        }
    }

    // Enables the favBtn again.
    if (favBtn.classList.contains("d-none")) {
        favBtn.classList.remove("d-none");
    }
}