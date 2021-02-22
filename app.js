
//-------Requires----------
const express = require("express");
const bodyParser = require("body-parser")
const path = require('path');
const mongoose = require("mongoose");
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db_data = require("./server_scripts/Users.js");


//-------Initialization----------
const app = express();
const jsonParser = bodyParser.json();
const User = db_data.user;


//-------Mongoose----------
mongoose.connect('mongodb://localhost:27017/users_test', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected");
});


//-------App.use----------
app.use(session({
    secret: 'this is my secret'
}))
app.use(express.static(path.join(__dirname, 'assets')));
app.use(jsonParser);
app.use(bodyParser.urlencoded({
    extended: true
}));


//-------Server----------
app.listen(3000, () => {
    console.log("Listning on port 3000");
});


//-------Routes----------
app.get("/view", (req, res) => {
    res.sendFile(path.join(__dirname + '/Pages/view.html'))
})

app.get("/login", async (req, res) => {
    res.sendFile(path.join(__dirname + '/Pages/login.html'))
})

app.get("/watchlist", async (req, res) => {
    res.sendFile(path.join(__dirname + '/Pages/watchList.html'))
})

app.get("/fav", async (req, res) => {
    res.sendFile(path.join(__dirname + '/Pages/favourites.html'))
})

app.get("/test", async (req, res) => {
    // const users = await User.deleteMany({});
    const users = await User.find({});
    console.log("users: ", users);

})

// Logs the user in  
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    //Checks if the user is registered
    const requestedUser = await User.findOne({ username: username })
    if (requestedUser) {
        // Checks if the password is right and logs in the user. 
        await bcrypt.compare(password, requestedUser.password).then((result) => {
            if (result == true) {
                console.log("logged in");

                // authorize this user.
                req.session.userID = requestedUser._id;
                res.redirect("/");
            }
            else {
                //If the password is incorrect return to login page with error msg.
                console.log("incorrect credentials");
                req.session.err = "Invalid credentials";
                res.redirect("/login");
            }
        })
    }
    else {
        //If the username is incorrect return to login page with error msg.
        console.log("invalid credentials 2");
        // username or password is incorrect.
        req.session.err = "Invalid credentials";
        res.redirect("/login");
    }
})

// Used to return data to the client based on the request.
app.use("/getData", async (req, res, next) => {

    // Returns the userID of the loggged in user through session.
    if (req.headers.get == "user") {
        if (req.session.userID) {
            res.json({ user: req.session.userID });
        }
        else {
            res.json({ user: "not found" });
        }
    }

    // Returns if there is a login error or not.
    else if (req.headers.get == "login_err") {
        if (req.session.err) {
            res.json({ err: req.session.err });
        }
        else {
            res.json({ err: "not found" });
        }
    }

    // Returns if the given title is faved or not.
    else if (req.headers.get == "is_fav") {
        const userID = await req.body.userID;
        let found = false;
        // console.log("pr_uid: ", userID);
        // console.log("pr_imdbid: ", req.body.imdbID);
        const fav_list = await User.findOne({ _id: userID })
        for (const item of fav_list.fav) {
            console.log(item);
            if (item == req.body.imdbID) {
                found = true;
                break;
            }
        }
        if (found == true) {
            res.json({ result: true });
        }
        else {
            res.json({ result: false });
        }
    }
    // Returns if the given title is faved or not.
    else if (req.headers.get == "is_bucket") {
        const userID = await req.body.userID;
        let found = false;
        // console.log("pr_uid: ", userID);
        // console.log("pr_imdbid: ", req.body.imdbID);
        const bucket_list = await User.findOne({ _id: userID })
        for (const item of bucket_list.bucket) {
            console.log(item);
            if (item == req.body.imdbID) {
                found = true;
                break;
            }
        }
        if (found == true) {
            res.json({ result: true });
        }
        else {
            res.json({ result: false });
        }
    }
    else if (req.headers.get == 'watchlist') {
        const userID = await req.body.userID;
        const user = await User.findById(userID);
        if (user.bucket.length > 0) {
            res.json({ result: user.bucket })
        }
        else {
            res.json({ result: 'empty' });
        }
    }
    else if (req.headers.get == 'favourites') {
        const userID = await req.body.userID;
        const user = await User.findById(userID);
        if (user.fav.length > 0) {
            res.json({ result: user.fav })
        }
        else {
            res.json({ result: 'empty' });
        }
    }

})

// Faves or unfaves the title.
app.post("/fav", async (req, res) => {
    const data = req.body.imdbID;

    // Unfaves the title.
    if (req.headers.get == 'remove_fav') {
        console.log("removing fav", req.body);
        const user = await User.findById(req.body.userID);
        console.log("intial_user: ", user);
        if (user.fav.includes(data)) {
            user.fav.pull(data);
            await user.save();
        }
        else {
            console.log("sorry bruh!!");
            // TODO - if unfaving fails, throw error.
        }
    }
    else { // faves the title
        console.log(req.body);
        const user = await User.findById(req.body.userID);
        if (!user.fav.includes(data)) {
            await user.fav.push(data);
            await user.save();
        }
        else {
            console.log("title already faved");
            // TODO - if title already faved, throw error.
        }
    }
})

// Faves or unfaves the title.
app.post("/bucket", async (req, res) => {
    const data = req.body.imdbID;

    // Unfaves the title.
    if (req.headers.get == 'remove_bucket') {
        console.log("removing bucket", req.body);
        const user = await User.findById(req.body.userID);
        console.log("intial_user: ", user);
        if (user.bucket.includes(data)) {
            user.bucket.pull(data);
            await user.save();
        }
        else {
            console.log("sorry bruh!!");
            // TODO - if unfaving fails, throw error.
        }
    }
    else { // faves the title
        console.log(req.body);
        const user = await User.findById(req.body.userID);
        if (!user.bucket.includes(data)) {
            await user.bucket.push(data);
            await user.save();
        }
        else {
            console.log("title already faved");
            // TODO - if title already faved, throw error.
        }
    }
})

// Signs the user out
app.post("/signout", (req, res) => {
    if (req.session.userID) {
        req.session.destroy();
    }
    res.redirect("/");
})

// Register a new user
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            console.log(username, salt, hash);
            const user = new User({ username: username, salt: salt, password: hash });
            await user.save();
            res.redirect("/");
        });
    });
})

// Home page route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/Pages/landing.html'));
})