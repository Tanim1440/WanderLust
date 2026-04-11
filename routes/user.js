const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilits/wrapAsync.js");
const passport = require("passport");
const review = require("../models/review.js");
const {reachUrl}=require("../middleware.js");

const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.signupUser));

router.route("/login")
.get(userController.loginForm)
.post(reachUrl,
     passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),userController.loginUser
);


router.get("/logout",userController.logoutUser);

module.exports = router;