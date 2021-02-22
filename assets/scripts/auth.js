const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const formToRegister = document.querySelector(".form-to-register");
const formToLogin = document.querySelector(".form-to-login");
const registerBtn = document.querySelector(".registerbtn");
const loginBtn = document.querySelector(".loginbtn");
const registerUsername = document.querySelector(".register-username");
const registerPassword = document.querySelector(".register-password");
const loginUsername = document.querySelector(".login-username");
const loginPassword = document.querySelector(".login-password");
const confirmPassword = document.querySelector(".confirm-password");
const registerFeedback = document.querySelectorAll(".register-feedback");
const loginFeedback = document.querySelectorAll(".login-feedback");
const loginErr = document.querySelector(".login-err");

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    for (let i of loginFeedback) {
        if (!i.classList.contains("d-none")) {
            i.classList.add("d-none");
        }
    }
    let checkEmptyVal = checkEmpty([loginUsername, loginPassword]);
    if (checkEmptyVal != -1) {
        loginFeedback[checkEmptyVal].innerText = "This field is required";
        loginFeedback[checkEmptyVal].style.color = "red";
        loginFeedback[checkEmptyVal].classList.remove("d-none");
    }
    else {
        formToLogin.requestSubmit();
    }
})


registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    for (let i of registerFeedback) {
        if (!i.classList.contains("d-none")) {
            i.classList.add("d-none");
        }
    }
    let checkEmptyVal = checkEmpty([registerUsername, registerPassword, confirmPassword]);
    if (checkEmptyVal != -1) {
        registerFeedback[checkEmptyVal].innerText = "This field is required";
        registerFeedback[checkEmptyVal].style.color = "red";
        registerFeedback[checkEmptyVal].classList.remove("d-none");
    } else if (checkpassword() == false) {
        registerFeedback[2].innerText = "passwords dont match";
        registerFeedback[2].style.color = "red";
        registerFeedback[2].classList.remove("d-none");
    }
    else {
        formToRegister.requestSubmit();
    }
    // checkUsername();
})

function checkEmpty(arr) {
    for (let [index, item] of arr.entries()) {
        if (!item.value) {
            return index;
        }
    }
    return -1;
}


function checkpassword() {
    if (registerPassword.value == confirmPassword.value) {
        return true;
    }
    return false;
}

function checkUsername() {

}

function switchMethod() {
    loginForm.classList.toggle("d-none");
    registerForm.classList.toggle("d-none");
}

async function check_login_state() {
    const user = await fetch(`http://localhost:3000/getData`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'get': 'login_err'
        },
    });
    const res = await user.json();
    console.log(res.err);

    if (res.err == "not found") {
        if (!loginErr.classList.contains("d-none")) {
            loginErr.classList.add("d-none");
        }
    }
    else {
        if (loginErr.classList.contains("d-none")) {
            loginErr.classList.remove("d-none");
        }
    }
}

check_login_state();