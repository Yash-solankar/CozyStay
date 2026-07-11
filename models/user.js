const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
    //By default passport-local mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value. so we are free to create schema for user and password or otherwise passport will create it
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);