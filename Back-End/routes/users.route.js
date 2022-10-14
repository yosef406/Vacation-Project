// imports
const express = require('express');
const userSchema = require('../models/users.model');
const vacationSchema = require("../models/vacation.model");
const controller = require("../controllers/users.controllers");
const middleware = require("../middleware/users.middleware");

// setups
const usersRoute = express.Router();

usersRoute.use(express.json());

// paths, methods
usersRoute.post("/signin", controller.post_signin); // for GET method can use "/signin?userName=someName&password=thePassword"
usersRoute.post("/signup", controller.post_signup);


usersRoute.patch("/:id", middleware.getUserWithID, async (req, res) => {
    try {
        userSchema.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, user) => {
            if (err != null) {
                res.status(200).json({ message: "user has been updated", success: true, user });
            } else {
                res.status(500).json({ message: err.message, success: false });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

usersRoute.post("/follow/:id", middleware.getUserWithID, async (req, res) => {
    try {
        let user = req.user
        let vacation = await vacationSchema.findById(req.body.vacationToFollow);
        if (user != null && vacation != null) {

            if (!user.following.includes(req.body.vacationToFollow)) {
                user.following.push(req.body.vacationToFollow);
                await vacation.update({ $inc: { numOfFollowers: 1 } }).exec();
                await user.save();
                res.status(200).json({ message: "vacation was successfully added to following group", success: true, user });
            } else {
                res.status(400).json({ message: "user is already following this vacation", success: false });
            }

        } else {
            res.status(500).json({ message: "internal server error", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

usersRoute.post("/unfollow/:id", middleware.getUserWithID, async (req, res) => {
    try {
        let user = req.user
        let vacation = await vacationSchema.findById(req.body.vacationToFollow);

        if (user != null && vacation != null) {

            if (user.following.includes(req.body.vacationToFollow)) {

                user.following.remove(req.body.vacationToFollow);

                await vacation.update({ $inc: { numOfFollowers: -1 } }).exec();

                await user.save();
                res.status(200).json({ message: "vacation was successfully removed from following group", success: true, user });
            } else {
                res.status(400).json({ message: "user is already does not follow this vacation", success: false });
            }
        } else {
            res.status(500).json({ message: "internal server error", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

usersRoute.get("/filterFollowing/:id", middleware.getUserWithID, (req, res) => {

    let user = req.user;
    if (user != null)
        user.populate('following').then((result) => {
            res.status(200).json({ message: "vacation was successfully removed from following group", success: true, vacations: result.following });
        }).catch((err) => res.status(500).json({ message: err.message, success: false }));
    else
        res.status(500).json({ message: "internal server error", success: false });
})

module.exports = usersRoute;