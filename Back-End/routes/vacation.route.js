// imports
const express = require('express');
const VacationSchema = require('../models/vacation.model');

// setups
const vacationRoute = express.Router();

vacationRoute.get("/", async (req, res) => {
    // let count = await VacationSchema.count();
    // VacationSchema.find().skip(Number.parseInt(req.query.skip)).limit(10).sort({ startDate: 1 }).then((result) => {
    VacationSchema.find().sort({ startDate: 1 }).then((result) => {
        res.status(200).json({ message: "Vacations found", success: true, vacations: result })
    }).catch((err) => res.status(500).json({ message: err, success: false }));
});

vacationRoute.post("/new", async (req, res) => {
    let newVacation = new VacationSchema(req.body);
    newVacation.save().then((result) => {
        res.status(200).json({ message: "new vacation created.", success: true });
    }).catch((err) => res.status(500).json({ message: err, success: false }));
});

vacationRoute.post("/edit/:id", (req, res) => {
    VacationSchema
        .findByIdAndUpdate(req.params.id, { $set: req.body }, {}, (err, doc, response) => {
            if (err == null) {
                res.status(200).json({ message: "vacation has been updated.", success: true });
            } else {
                res.status(500).json({ message: err, success: false });
            }
        });
});

vacationRoute.delete("/:id", (req, res) => {
    VacationSchema.findByIdAndDelete(req.params.id, {}, (err, doc, result) => {
        if (err == null) {
            res.status(200).json({ message: "Vacation deleted.", success: true });
        } else {
            res.status(500).json({ message: err, success: false });
        }
    });
});

module.exports = vacationRoute;