const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilits/wrapAsync.js")
const lists = require("../models/listings.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});



router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.postNewListing));


router.get("/new", isLoggedIn,listingController.newListingFrom);

router.route("/:id")
.put(isLoggedIn, isOwned,upload.single('listing[image]'), validateListing, wrapAsync(listingController.putEditListing))
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn, isOwned, wrapAsync(listingController.destroyListing));


router.get("/:id/edit", isLoggedIn, isOwned, validateListing, wrapAsync(listingController.editListing));

module.exports = router;