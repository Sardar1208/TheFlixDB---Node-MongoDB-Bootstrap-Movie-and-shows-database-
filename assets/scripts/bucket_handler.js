const bucketBtn = document.querySelector(".bucket-btn");
const addToWLBtn = document.querySelector(".addToWLBtn");

// Checks if the user clicked the bucket button.
addToWLBtn.addEventListener('click', async (e) => {

    // This is the returned value from searchByid().
    const x = await result;

    // If it is unbucketed, then bucket it.
    if (bucketBtn.classList.contains("outline")) {
        // Update the button to bucketed. 
        bucketBtn.src = "/svg/bucket_fill.svg";
        bucketBtn.classList.remove("outline");
        bucketBtn.classList.add("fill");

        //Add to bucket in db .
        const bucket = await fetch(`http://localhost:3000/bucket`, {
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
        const res = await bucket.json();

    } // If it is bucketed, then unbucket it.
    else {
        // Update the button to unbucketed.
        bucketBtn.src = "/svg/bucket_outline.svg";
        bucketBtn.classList.add("outline");
        bucketBtn.classList.remove("fill");

        //Remove from bucket in db.
        const bucket = await fetch(`http://localhost:3000/bucket`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'get': 'remove_bucket',
            },
            body: JSON.stringify({
                'userID': `${await userID}`,
                'imdbID': `${x.imdbID}`
            })
        });
        const res = await bucket.json();
    }
})



// Checks if the title is bucketed or not, and updates thebucketBtn based on it.
async function checkBucket() {

    // This is the returned value from searchByid().
    const x = await result;

    // Disables the bucketBtn until the server returns its state. 
    if (!bucketBtn.classList.contains("d-none")) {
        bucketBtn.classList.add("d-none");
    }

    // Send request to server for the state of bucketBtn
    const bucket = await fetch(`http://localhost:3000/getData`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'get': 'is_bucket'
        },
        body: JSON.stringify({
            'userID': `${await userID}`,
            'imdbID': `${x.imdbID}`
        })
    });
    const res = await bucket.json();
    console.log("is_bucket: ", res);

    // Update the bucketBtn state based on the result.
    if (res.result == true) {
        bucketBtn.src = "/svg/bucket_fill.svg";
        if (bucketBtn.classList.contains("outline")) {
            bucketBtn.classList.remove("outline");
            bucketBtn.classList.add("fill");
        }
    }

    // Enables the bucketBtn again.
    if (bucketBtn.classList.contains("d-none")) {
        bucketBtn.classList.remove("d-none");
    }
}