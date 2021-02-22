const signInBtn = document.querySelector(".sign-in");
const signOutBtn = document.querySelector(".sign-out");

async function getUser() {
    const user = await fetch(`http://localhost:3000/getData`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'get':'user'
        },
    });
    const res = await user.json();
    const userID = await res.user;
    console.log(res.user);
    
    if (res.user == "not found") {
        if (signInBtn.classList.contains("d-none")) {
            signInBtn.classList.remove("d-none");
            signOutBtn.classList.add("d-none");
        }
    }
    else {
        if (signOutBtn.classList.contains("d-none")) {
            signInBtn.classList.add("d-none");
            signOutBtn.classList.remove("d-none");
        }
    }

    return userID;
}

const userID = getUser();