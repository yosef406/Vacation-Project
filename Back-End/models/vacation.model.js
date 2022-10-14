const mongoose = require('mongoose');

const VacationSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    numOfFollowers: {
        type: Number,
        default: 0,
        min: 0
    },
    image: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('vacations', VacationSchema);