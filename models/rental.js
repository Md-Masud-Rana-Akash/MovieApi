const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require("mongoose");
const { customerSchema } = require('../models/customer.js');
const { movieSchema } = require('../models/movie.js');

const rentalSchema = new mongoose.Schema({

    customer:{
        type: customerSchema,
        required: true
    },

    movie:{
        type:movieSchema,
        required:true
    },

    dateOut:{
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned:{
        type: Date,
       
    },
    rentalFee:{
        type: Number,
        min:0
    }

});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validateRental = validateRental;