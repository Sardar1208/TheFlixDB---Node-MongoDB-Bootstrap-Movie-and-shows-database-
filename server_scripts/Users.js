const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fav: [{
        type: String,
    }],
    bucket: [{
        type: String,
    }]
})


const user = mongoose.model("user", userSchema);

module.exports = {
    user: user,
}