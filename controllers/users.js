const User = require("../models/user.js");

module.exports.renderSignupPage = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to CozyStay!");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginPage = (req, res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    if (res.locals.action === "reserve") {
        req.flash("success", "You're back! Click Reserve to confirm your booking.");
    } else {
        req.flash("success", "Welcome back to CozyStay! You are logged in!");
    }
    delete req.session.redirectUrl;
    delete req.session.action;

    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res, next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
}