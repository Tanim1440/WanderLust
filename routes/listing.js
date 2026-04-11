const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilits/wrapAsync.js")
const lists = require("../models/listings.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");

const listingController=require("../controllers/listings.js");



//index route
router.get("/", wrapAsync(listingController.index));

//add route
router.get("/new", isLoggedIn,listingController.newListingFrom);
router.post("/", validateListing, isLoggedIn, wrapAsync(listingController.postNewListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwned, validateListing, wrapAsync(listingController.editListing));
router.put("/:id", isLoggedIn, isOwned, validateListing, wrapAsync(listingController.putEditListing));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//delete route
router.delete("/:id", isLoggedIn, isOwned, wrapAsync(listingController.destroyListing));

module.exports = router;