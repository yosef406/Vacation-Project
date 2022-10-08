// imports
const express = require('express');
const UserSchema = require('../models/users.model')
const controller = require("../controllers/users.controllers");
const middleware = require("../middleware/users.middleware");

// setups
const usersRoute = express.Router();

// paths, methods
// usersRoute.post("/signup", controller.post_signup);
// usersRoute.post("/login", controller.post_login);

// usersRoute.patch("/:id", middleware.getUserWithID, async (req, res) => {
//     try {

//         usersSchema.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
//             if (err != null) {
//                 res.status(500).json({ message: err.message, success: false });
//                 return;
//             } else {
//                 res.status(200).json({ message: "user has been updated", success: true });
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message, success: false });
//     }
// });

module.exports = usersRoute;