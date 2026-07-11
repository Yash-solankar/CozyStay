const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utilis/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usersController = require("../controllers/users.js");

router.route("/signup")
.get(usersController.renderSignupPage)
.post(wrapAsync(usersController.signup));

router.route("/login")
.get(usersController.renderLoginPage)
.post(saveRedirectUrl, 
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),
    usersController.login);



//LogOut
router.get("/logout", usersController.logout);

module.exports = router;